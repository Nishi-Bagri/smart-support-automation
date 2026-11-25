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

    # Step 4: Return the result
    return {
        "ticket_id": ticket_id,
        "message": "Support ticket saved successfully",
        "customer_name": ticket.customer_name,
        "category": category,
        "priority": priority,
        "handling_type": handling_type,
        "status": "received"
    }
