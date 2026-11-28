import json
import os
import urllib.request

from fastapi import FastAPI
from pydantic import BaseModel, Field

from classifier import classify_ticket
from database import get_connection

from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI(title="Smart Support Automation")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://supportflow-frontend-oehi.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TicketRequest(BaseModel):
    customer_name: str = Field(min_length=2)
    message: str = Field(min_length=5)


@app.get("/")
def home():
    return {
        "message": "Smart Support Automation API is running"
    }


@app.post("/tickets", status_code=201)
def create_ticket(ticket: TicketRequest):

    # Step 1: Classify the incoming ticket
    classification = classify_ticket(ticket.message)

    category = classification["category"]
    priority = classification["priority"]

    # Step 2: Decide how the ticket should be handled
    handling_type = "urgent" if priority == "high" else "normal"

    # Step 3: Save the ticket in PostgreSQL
    conn = get_connection()

    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO tickets
                (customer_name, message, category, priority,
                 handling_type, status)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
                """,
                (
                    ticket.customer_name,
                    ticket.message,
                    category,
                    priority,
                    handling_type,
                    "received"
                )
            )

            ticket_id = cur.fetchone()[0]

        conn.commit()

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()

        # Step 4: Trigger n8n workflow
    webhook_url = os.getenv("N8N_WEBHOOK_URL")

    if webhook_url:
        payload = {
            "ticket_id": ticket_id,
            "customer_name": ticket.customer_name,
            "message": ticket.message,
            "category": category,
            "priority": priority,
            "handling_type": handling_type,
            "status": "received"
        }

        request = urllib.request.Request(
            webhook_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        try:
            with urllib.request.urlopen(request, timeout=10) as response:
                print(f"n8n webhook triggered: HTTP {response.status}")

        except Exception as exc:
            print(f"n8n webhook failed: {exc}")

    
    # Step 5: Return the result
    return {
        "ticket_id": ticket_id,
        "message": "Support ticket saved successfully",
        "customer_name": ticket.customer_name,
        "category": category,
        "priority": priority,
        "handling_type": handling_type,
        "status": "received"
    }

@app.get("/tickets")
def get_tickets():

    conn = get_connection()

    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, customer_name, message, category, priority, handling_type, status
                FROM tickets
                ORDER BY id DESC
                """
            )

            rows = cur.fetchall()

            tickets = []

            for row in rows:
                tickets.append({
                    "ticket_id": row[0],
                    "customer_name": row[1],
                    "message": row[2],
                    "category": row[3],
                    "priority": row[4],
                    "handling_type": row[5],
                    "status": row[6]
                })

            return tickets

    finally:
        conn.close()
                