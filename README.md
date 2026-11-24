# Smart Support Ticket Automation

An automated customer support ticket management system built using **Python, FastAPI, PostgreSQL, and n8n**.

The application receives customer support requests, classifies them based on their message, assigns priority, stores ticket information in PostgreSQL, and routes tickets through an automated n8n workflow.

## Features

- Receive customer support tickets through an API.
- Classify tickets into categories:
  - Payment
  - Return
  - Cancellation
  - Delivery
  - General
- Assign high or normal priority.
- Automatically determine urgent or normal handling.
- Store customer tickets in PostgreSQL.
- Automate ticket processing and routing using n8n.
- Return a unique ticket ID after successful database insertion.

## Technology Stack

| Technology | Purpose |
|---|---|
| Python | Application logic |
| FastAPI | REST API development |
| Pydantic | Request validation |
| PostgreSQL | Database |
| Psycopg | PostgreSQL connectivity |
| n8n | Workflow automation |
| Cloudflare Tunnel | Temporary public access during development |
| Git & GitHub | Version control |

## Architecture

```text
Customer
   |
   v
n8n Webhook
   |
   v
HTTP Request
   |
   v
FastAPI Backend
   |
   v
Ticket Classification
   |
   v
PostgreSQL Database
   |
   v
API Response
   |
   v
n8n IF Node
   |
   +------ High Priority
   |          |
   |          v
   |      Urgent Handling
   |
   +------ Normal Priority
              |
              v
         Normal Handling
```

## Project Structure

```text
smart-support-automation/
│
├── backend/
│   ├── venv/
│   ├── main.py
│   ├── classifier.py
│   ├── database.py
│   ├── .env
│   └── .gitignore
│
├── workflows/
│
├── docs/
│
├── tests/
│
└── README.md
```

*Note: `.env` and `venv/` are excluded from version control.*

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Nishi-Bagri/smart-support-automation.git
cd smart-support-automation
```

### 2. Create a virtual environment

```bash
cd backend
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install fastapi uvicorn pydantic psycopg[binary] python-dotenv
```

### 4. Configure environment variables

Create a `.env` file inside the backend folder:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_support_db
DB_USER=postgres
DB_PASSWORD=your_postgresql_password
```

Never commit database credentials to GitHub.

### 5. Create the PostgreSQL database

Create a database named `smart_support_db` and execute:

```sql
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    handling_type VARCHAR(20) NOT NULL,
    status VARCHAR(30) DEFAULT 'received',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Start FastAPI

```bash
python -m uvicorn main:app --reload
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

## API Endpoint

**Create a support ticket**

`POST /tickets`

Request:

```json
{
  "customer_name": "Priya",
  "message": "My payment was deducted twice"
}
```

Example response:

```json
{
  "ticket_id": 1,
  "message": "Support ticket saved successfully",
  "customer_name": "Priya",
  "category": "payment",
  "priority": "high",
  "handling_type": "urgent",
  "status": "received"
}
```

## Workflow Testing

The following scenarios have been tested:

| Customer Message | Category | Priority | Handling |
|---|---|---|---|
| My payment was deducted twice | Payment | High | Urgent |
| My product arrived damaged | Return | High | Urgent |
| Tell me the delivery status | Delivery | Normal | Normal |
| Please cancel my order | Cancellation | Normal | Normal |

## Current Project Status

- [x] FastAPI backend
- [x] Rule-based ticket classification
- [x] PostgreSQL database integration
- [x] Ticket insertion and unique ID generation
- [x] n8n webhook integration
- [x] High-priority and normal-priority routing
- [ ] Automated test suite
- [ ] Production cloud deployment

## Future Enhancements

- AI-based intent classification
- Sentiment analysis
- Context-aware priority detection
- Automated customer response suggestions
- Authentication and authorization
- Production monitoring and logging

## Author

**Nishi Bagri**

GitHub: https://github.com/Nishi-Bagri

---

*This project is being developed as a practical demonstration of backend development, database integration, and workflow automation.*