# Smart Support Ticket Automation

An automated customer support ticket management system built using **Python, FastAPI, PostgreSQL, and n8n**.

The application receives customer support requests, classifies them based on their message, assigns priority, stores ticket information in PostgreSQL, and automatically triggers an n8n workflow for priority-based ticket handling.

## Live Demo

- **Live Frontend:** https://supportflow-frontend-oehi.onrender.com
- **Backend API:** https://smart-support-automation.onrender.com
- **API Documentation:** https://smart-support-automation.onrender.com/docs
- **GitHub Repository:** https://github.com/Nishi-Bagri/smart-support-automation

## Features

- Receive customer support tickets through an API.
- Classify tickets into categories:
  - Payment
  - Return
  - Cancellation
  - Delivery
  - Order
  - General
- Assign high or normal priority.
- Automatically determine urgent or normal handling.
- Store customer tickets in PostgreSQL.
- Trigger n8n workflow automatically after ticket creation.
- Route high-priority and normal-priority tickets through n8n.
- Return a unique ticket ID after successful database insertion.
- Retrieve saved tickets through the backend API.

## Technology Stack

| Technology | Purpose |
|---|---|
| Python | Application logic |
| FastAPI | REST API development |
| Pydantic | Request validation |
| PostgreSQL | Database |
| Psycopg | PostgreSQL connectivity |
| n8n | Workflow automation |
| React | Frontend |
| Vite | Frontend development |
| Render | Cloud deployment |
| Supabase PostgreSQL | Hosted database |
| Git & GitHub | Version control |

## Architecture

```text
Customer
   |
   v
React Frontend
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
n8n Production Webhook
   |
   v
IF Node: Check Priority
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
│   ├── main.py
│   ├── classifier.py
│   ├── database.py
│   ├── requirements.txt
│   ├── .env
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
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
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file inside the backend folder and configure your database connection and n8n webhook URL according to your local setup.

```env
DB_HOST=your_postgresql_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_postgresql_password

N8N_WEBHOOK_URL=your_n8n_production_webhook_url
```

Never commit database credentials or private webhook URLs to GitHub.

### 5. Create the PostgreSQL database

Create a PostgreSQL database and execute:

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

From the backend directory:

```bash
python -m uvicorn main:app --reload
```

Backend runs locally at:

http://127.0.0.1:8000

API documentation:

http://127.0.0.1:8000/docs

### 7. Start the frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL provided by Vite.

## API Endpoints

### Create a Support Ticket

**POST** `/tickets`

Example request:

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

### Get All Tickets

**GET** `/tickets`

Returns the saved support tickets from the database.

## Workflow Testing

The following ticket classification scenarios have been tested:

| Customer Message | Category | Priority | Handling |
|---|---|---|---|
| My payment was deducted twice | Payment | High | Urgent |
| My product arrived damaged | Return | High | Urgent |
| Tell me the delivery status | Delivery | Normal | Normal |
| Please cancel my order | Cancellation | Normal | Normal |
| I need my order confirmation | Order | Normal | Normal |

## Current Project Status

- [x] FastAPI backend
- [x] Rule-based ticket classification
- [x] PostgreSQL database integration
- [x] Ticket insertion and unique ID generation
- [x] n8n webhook integration
- [x] High-priority and normal-priority routing
- [x] Backend and frontend cloud deployment
- [x] Automatic n8n execution verified from live frontend
- [x] End-to-end ticket processing verified

## Future Enhancements

- AI-based intent classification
- Sentiment analysis
- Context-aware priority detection
- Automated customer response suggestions
- Authentication and authorization
- Production monitoring and logging
- Automated test suite

## Author

**Nishi Bagri**

GitHub: https://github.com/Nishi-Bagri

---

*This project demonstrates backend development, REST API design, database integration, and workflow automation.*