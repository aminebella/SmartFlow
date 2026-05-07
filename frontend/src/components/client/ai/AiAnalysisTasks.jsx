'use client';

export default function AiTasks({ tasks, onUpdateTask, onRemoveTask, onAddTask }) {
  if (!tasks) return null;

  const priorityStyle = (p) => ({
    HIGH:   { backgroundColor: '#c9b479', color: 'white' },
    MEDIUM: { backgroundColor: '#e2d5a0', color: '#7a6830' },
    LOW:    { backgroundColor: '#f3edd6', color: '#a08c4a', border: '1px solid #e2d5a0' },
  }[p] || {});

  return (
    <div className="bg-white rounded-xl p-5 h-full flex flex-col" style={{ border: '1px solid #e8e0cc' }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#a08c4a' }}>
          Tasks
        </p>
        <button onClick={onAddTask}
          className="text-xs px-2 py-1 rounded-lg transition hover:opacity-80"
          style={{ backgroundColor: '#f3edd6', color: '#a08c4a', border: '1px solid #e2d5a0' }}>
          + Add task
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {tasks.map((task, i) => (
          <div key={i} className="flex items-center gap-2 py-2"
            style={{ borderBottom: '1px solid #f0ebe0' }}>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
              style={priorityStyle(task.priority)}>
              {task.priority}
            </span>
            <input
              value={task.title}
              onChange={(e) => onUpdateTask(i, 'title', e.target.value)}
              className="text-sm text-slate-800 flex-1 focus:outline-none bg-transparent"
            />
            <span className="text-xs text-slate-400 flex-shrink-0">{task.sprint}</span>
            <button onClick={() => onRemoveTask(i)}
              className="text-slate-300 hover:text-red-400 transition flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}