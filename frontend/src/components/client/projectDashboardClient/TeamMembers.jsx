const members = [
  { initials: "AM", name: "Alex Morgan",  role: "Project Manager", tasks: 8,  color: "av-gold" },
  { initials: "SR", name: "Sara Ruiz",    role: "Frontend Dev",    tasks: 6,  color: "av-green" },
  { initials: "TK", name: "Tom Kira",     role: "Backend Dev",     tasks: 7,  color: "av-purple" },
  { initials: "NC", name: "Nina Chen",    role: "QA Engineer",     tasks: 4,  color: "av-warm" },
  { initials: "JL", name: "James Liu",    role: "Full Stack Dev",  tasks: 5,  color: "av-teal" },
];

export default function TeamMembers() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Team Members</span>
        <a className="card-link" href="#">View all →</a>
      </div>
      <div className="card-body card-body-team">
        {members.map((m) => (
          <div className="team-member" key={m.initials}>
            <div className={`av av-md ${m.color}`}>{m.initials}</div>
            <div className="team-member-info">
              <div className="team-member-name">{m.name}</div>
              <div className="team-member-role">{m.role}</div>
            </div>
            <div className="team-member-tasks">{m.tasks} tasks</div>
          </div>
        ))}
      </div>
    </div>
  );
}