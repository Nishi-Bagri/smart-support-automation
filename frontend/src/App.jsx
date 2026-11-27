
import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "https://smart-support-automation.onrender.com";

function App() {
  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");
  const [apiStatus, setApiStatus] = useState("Checking...");
  const [ticketSearch, setTicketSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Load saved tickets from the backend
  useEffect(() => {
    async function loadTickets() {
      try {
        const response = await fetch(`${API_URL}/tickets`);

        if (!response.ok) {
          throw new Error("Failed to load tickets");
        }

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error loading tickets:", error);
      }
    }

    loadTickets();
  }, []);

  // Check backend health
  useEffect(() => {
    async function checkBackend() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Backend unavailable");
        }

        setApiStatus("Online");
      } catch {
        setApiStatus("Offline");
      }
    }

    checkBackend();
  }, []);

  // Create a new support ticket
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: customerName,
          message: message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Could not create ticket");
      }

      const createdTicket = {
        ...data,
        message: message,
      };

      setTickets((previous) => [createdTicket, ...previous]);
      setNotice(`Ticket #${data.ticket_id} created successfully`);

      setCustomerName("");
      setMessage("");
    } catch (error) {
      setNotice(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Display ticket list
  function renderTicketList() {
    if (tickets.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">▤</div>
          <h3>No tickets yet</h3>
          <p>New support tickets will appear here.</p>
        </div>
      );
    }

    return (
      <div className="ticket-list">
        {tickets.map((ticket, index) => (
          <div className="ticket-row" key={ticket.ticket_id || index}>
            <div className="ticket-avatar">
              {ticket.customer_name?.charAt(0)?.toUpperCase() || "?"}
            </div>

            <div className="ticket-info">
              <strong>
                #{ticket.ticket_id} · {ticket.customer_name}
              </strong>

              <p>{ticket.message}</p>

              <div className="ticket-tags">
                <span className="category">{ticket.category}</span>
                <span className={`priority ${ticket.priority}`}>
                  {ticket.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const filteredTickets = tickets.filter((ticket) => {
    const searchText = ticketSearch.trim().toLowerCase();

    const matchesSearch =
      String(ticket.ticket_id ?? "").toLowerCase().includes(searchText) ||
      String(ticket.customer_name ?? "").toLowerCase().includes(searchText) ||
      String(ticket.message ?? "").toLowerCase().includes(searchText);

    const matchesCategory =
      categoryFilter === "All" ||
      String(ticket.category ?? "").toLowerCase() ===
        categoryFilter.toLowerCase();

    const matchesPriority =
      priorityFilter === "All" ||
      String(ticket.priority ?? "").toLowerCase() ===
        priorityFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <span>SupportFlow</span>
        </div>

        <p className="sidebar-label">WORKSPACE</p>

        <button
          type="button"
          className={`nav-item ${
            activePage === "Dashboard" ? "active" : ""
          }`}
          onClick={() => setActivePage("Dashboard")}
        >
          ▦ Dashboard
        </button>

        <button
          type="button"
          className={`nav-item ${
            activePage === "Support Tickets" ? "active" : ""
          }`}
          onClick={() => setActivePage("Support Tickets")}
        >
          ▤ Support Tickets
        </button>

        <button
          type="button"
          className={`nav-item ${
            activePage === "Settings" ? "active" : ""
          }`}
          onClick={() => setActivePage("Settings")}
        >
          ⚙ Settings
        </button>

        <div className="sidebar-bottom">
          <div className="avatar">SB</div>
          <div>
            <strong>Support Team</strong>
            <small>Administrator</small>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace / {activePage}</span>

            <h1>
              {activePage === "Dashboard"
                ? "Support Dashboard"
                : activePage}
            </h1>

            <p>
              {activePage === "Dashboard" &&
                "Manage and track customer support requests."}

              {activePage === "Support Tickets" &&
                "View all saved customer support tickets."}

              {activePage === "Settings" &&
                "Manage your application configuration and integrations."}
            </p>
          </div>

          <div className={`status status-${apiStatus.toLowerCase()}`}>
            <span className="status-dot"></span>
            Backend {apiStatus.toLowerCase()}
          </div>
        </header>

        {/* Dashboard */}
        {activePage === "Dashboard" && (
          <>
            <section className="stats">
              <div className="stat-card">
                <span>Total tickets</span>
                <strong>{tickets.length}</strong>
                <small>Saved support tickets</small>
              </div>

              <div className="stat-card">
                <span>High priority</span>
                <strong>
                  {
                    tickets.filter(
                      (ticket) => ticket.priority === "high"
                    ).length
                  }
                </strong>
                <small>Requires attention</small>
              </div>

              <div className="stat-card">
                <span>Normal priority</span>
                <strong>
                  {
                    tickets.filter(
                      (ticket) => ticket.priority === "normal"
                    ).length
                  }
                </strong>
                <small>Standard requests</small>
              </div>
            </section>

            <section className="content-grid">
              <div className="panel form-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Create support ticket</h2>
                    <p>Submit a new customer request.</p>
                  </div>
                  <span className="heading-icon">＋</span>
                </div>

                <form onSubmit={handleSubmit}>
                  <label htmlFor="customer">Customer name</label>

                  <input
                    id="customer"
                    value={customerName}
                    onChange={(event) =>
                      setCustomerName(event.target.value)
                    }
                    placeholder="Enter customer name"
                    minLength={2}
                    required
                  />

                  <label htmlFor="message">Customer message</label>

                  <textarea
                    id="message"
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    placeholder="Describe the customer's issue..."
                    minLength={5}
                    rows={5}
                    required
                  />

                  <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Create ticket →"}
                  </button>

                  {notice && <p className="notice">{notice}</p>}
                </form>
              </div>

              <div className="panel tickets-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recent tickets</h2>
                    <p>Recently saved support tickets.</p>
                  </div>
                  <span className="ticket-count">{tickets.length}</span>
                </div>

                {renderTicketList()}
              </div>
            </section>
          </>
        )}

        {/* Support Tickets */}
        {activePage === "Support Tickets" && (
          <section className="panel tickets-panel page-panel">
            <div className="tickets-heading">
              <div>
                <h2>Support Tickets</h2>
                <p>Manage and monitor all customer support requests.</p>
              </div>

              <div className="ticket-count">
                {filteredTickets.length} of {tickets.length} tickets
              </div>
            </div>

            <div className="ticket-filters">
              <input
                type="search"
                className="ticket-search"
                placeholder="Search by ticket ID, customer, or message..."
                value={ticketSearch}
                onChange={(event) => setTicketSearch(event.target.value)}
                aria-label="Search support tickets"
              />

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                aria-label="Filter tickets by category"
              >
                <option value="All">All categories</option>
                <option value="Payment">Payment</option>
                <option value="Delivery">Delivery</option>
                <option value="Return">Return</option>
                <option value="Cancellation">Cancellation</option>
                <option value="General">General</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                aria-label="Filter tickets by priority"
              >
                <option value="All">All priorities</option>
                <option value="High">High priority</option>
                <option value="Normal">Normal priority</option>
                <option value="Low">Low priority</option>
              </select>

              <button
                type="button"
                className="clear-filters-btn"
                onClick={() => {
                  setTicketSearch("");
                  setCategoryFilter("All");
                  setPriorityFilter("All");
                }}
              >
                Clear filters
              </button>
            </div>

            {tickets.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">▤</div>
                <h3>No tickets yet</h3>
                <p>Create a support ticket from the Dashboard to get started.</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="empty-tickets">
                <h3>No matching tickets</h3>
                <p>Try a different search term or clear your filters.</p>
              </div>
            ) : (
              <div className="tickets-table-wrapper">
                <table className="tickets-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Customer</th>
                      <th>Message</th>
                      <th>Category</th>
                      <th>Priority</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTickets.map((ticket, index) => (
                      <tr key={ticket.ticket_id ?? index}>
                        <td className="ticket-id">
                          #{ticket.ticket_id ?? "—"}
                        </td>

                        <td className="ticket-customer">
                          {ticket.customer_name || "Unknown"}
                        </td>

                        <td className="ticket-message">
                          {ticket.message || "No message provided"}
                        </td>

                        <td>
                          <span className="category-badge">
                            {ticket.category || "General"}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`priority-badge priority-${String(
                              ticket.priority || "normal"
                            ).toLowerCase()}`}
                          >
                            {ticket.priority || "Normal"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Settings */}
        {activePage === "Settings" && (
          <section className="settings-panel page-panel">
            <div className="panel-heading">
              <div>
                <h2>Application Settings</h2>
                <p>Manage your SupportFlow application.</p>
              </div>
            </div>

            {/* General */}
            <div className="panel setting-section">
              <h3>General</h3>

              <div className="setting-item">
                <label>Workspace name</label>
                <p>SupportFlow</p>
                <small>Smart Support Ticket Automation</small>
              </div>

              <div className="setting-item">
                <label>Application type</label>
                <p>Customer Support Dashboard</p>
              </div>
            </div>

            {/* System Status */}
            <div className="panel setting-section">
              <h3>System Status</h3>

              <div className="setting-item">
                <label>Backend API</label>
                <p
                  className={
                    apiStatus === "Online"
                      ? "api-online"
                      : apiStatus === "Offline"
                      ? "api-offline"
                      : ""
                  }
                >
                  {apiStatus}
                </p>
                <small>
                  Status is checked using your FastAPI health endpoint.
                </small>
              </div>

              <div className="setting-item">
                <label>Backend URL</label>
                <p>{API_URL}</p>
              </div>
            </div>

            {/* Integrations */}
            <div className="panel setting-section">
              <h3>Integrations</h3>
              <p className="settings-description">
                Open your connected services and project resources.
              </p>

              <div className="integration-list">
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="integration-link"
                >
                  <div>
                    <strong>Supabase</strong>
                    <small>PostgreSQL database</small>
                  </div>
                  <span>Open ↗</span>
                </a>

                <a
                  href="https://dashboard.render.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="integration-link"
                >
                  <div>
                    <strong>Render</strong>
                    <small>Backend deployment and logs</small>
                  </div>
                  <span>Open ↗</span>
                </a>

                <a
                  href="https://automation2026n.app.n8n.cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="integration-link"
                >
                  <div>
                    <strong>n8n</strong>
                    <small>Ticket automation workflow</small>
                  </div>
                  <span>Open ↗</span>
                </a>

                <a
                  href="https://github.com/Nishi-Bagri/smart-support-automation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="integration-link"
                >
                  <div>
                    <strong>GitHub</strong>
                    <small>Project source code</small>
                  </div>
                  <span>Open ↗</span>
                </a>

                <a
                  href={`${API_URL}/docs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="integration-link"
                >
                  <div>
                    <strong>API Documentation</strong>
                    <small>FastAPI Swagger interface</small>
                  </div>
                  <span>Open ↗</span>
                </a>
              </div>
            </div>

            {/* About */}
            <div className="panel setting-section">
              <h3>About</h3>

              <div className="setting-item">
                <label>Project</label>
                <p>Smart Support Ticket Automation</p>
              </div>

              <div className="setting-item">
                <label>Technology stack</label>
                <p>React · FastAPI · n8n · Supabase PostgreSQL</p>
              </div>

              <div className="setting-item">
                <label>Version</label>
                <p>Version 1.0</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
