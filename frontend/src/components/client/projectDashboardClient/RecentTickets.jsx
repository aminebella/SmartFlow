const tickets = [
  {
    key: "ECP-142",
    title: "Implement Stripe payment gateway",
    priority: { label: "Critical", cls: "prio-critical" },
    status:   { label: "In Progress", cls: "status-progress" },
    assignee: { initials: "TK", color: "av-purple" },
  },
  {
    key: "ECP-139",
    title: "Cart total with coupon codes",
    priority: { label: "High", cls: "prio-high" },
    status:   { label: "Review", cls: "status-review" },
    assignee: { initials: "SR", color: "av-green" },
  },
  {
    key: "ECP-138",
    title: "Mobile checkout responsive design",
    priority: { label: "Medium", cls: "prio-medium" },
    status:   { label: "In Progress", cls: "status-progress" },
    assignee: { initials: "JL", color: "av-teal" },
  },
  {
    key: "ECP-135",
    title: "Unit tests for order processing",
    priority: { label: "Medium", cls: "prio-medium" },
    status:   { label: "Done", cls: "status-done" },
    assignee: { initials: "NC", color: "av-warm" },
  },
  {
    key: "ECP-130",
    title: "Address validation API shipping",
    priority: { label: "Low", cls: "prio-low" },
    status:   { label: "Todo", cls: "status-todo" },
    assignee: { initials: "TK", color: "av-gold" },
  },
];

export default function RecentTickets() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Recent Tickets</span>
        <a className="card-link" href="#">View all →</a>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Who</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.key}>
                <td className="ticket-key">{t.key}</td>
                <td className="ticket-title">{t.title}</td>
                <td>
                  <span className={`prio ${t.priority.cls}`}>
                    <span className="prio-dot" />
                    {t.priority.label}
                  </span>
                </td>
                <td>
                  <span className={`status ${t.status.cls}`}>
                    {t.status.label}
                  </span>
                </td>
                <td>
                  <div className={`av av-sm ${t.assignee.color}`}>
                    {t.assignee.initials}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}