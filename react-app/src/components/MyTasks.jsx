import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const PRIORITY_STYLES = {
  critical: { dot: 'bg-red-500',    badge: 'bg-red-50 text-red-700 border-red-200' },
  high:     { dot: 'bg-orange-500', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
  medium:   { dot: 'bg-yellow-400', badge: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  low:      { dot: 'bg-green-500',  badge: 'bg-green-50 text-green-700 border-green-200' },
};

const COLUMN_LABELS = {
  backlog:     { label: 'Backlog',     color: 'bg-slate-100 text-slate-600' },
  'in-progress':{ label: 'In Progress', color: 'bg-blue-50 text-blue-700' },
  'in-review': { label: 'In Review',   color: 'bg-purple-50 text-purple-700' },
  done:        { label: 'Done',        color: 'bg-green-50 text-green-700' },
};

function TaskRow({ task, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const ps = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;
  const col = COLUMN_LABELS[task.column] || { label: task.column, color: 'bg-surface-container text-on-surface-variant' };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(task._id);
    setDeleting(false);
  };

  return (
    <tr className="hover:bg-surface-container-low transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full shrink-0 ${ps.dot}`} />
          <div>
            <p className="font-body-md text-body-md font-medium text-on-surface">{task.title}</p>
            {task.description && (
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-0.5">{task.description}</p>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase border ${ps.badge}`}>
          {task.priority}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${col.color}`}>
          {col.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {task.board?.title || <span className="italic opacity-60">No board</span>}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : <span className="italic opacity-50">—</span>}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 text-outline hover:text-error transition-all p-1 rounded"
        >
          {deleting
            ? <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
            : <span className="material-symbols-outlined text-[16px]">delete</span>}
        </button>
      </td>
    </tr>
  );
}

export default function MyTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [filter, setFilter]     = useState('all');      // column filter
  const [priority, setPriority] = useState('all');      // priority filter
  const [search, setSearch]     = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/tasks');
      setTasks(res.data);
    } catch {
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch {
      alert('Failed to delete task.');
    }
  };

  const filtered = tasks.filter(t => {
    const matchCol  = filter   === 'all' || t.column   === filter;
    const matchPri  = priority === 'all' || t.priority === priority;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                       (t.description || '').toLowerCase().includes(search.toLowerCase());
    return matchCol && matchPri && matchSearch;
  });

  const stats = {
    total:      tasks.length,
    inProgress: tasks.filter(t => t.column === 'in-progress').length,
    done:       tasks.filter(t => t.column === 'done').length,
    critical:   tasks.filter(t => t.priority === 'critical').length,
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface">
      {/* Header */}
      <div className="px-margin-page py-xl border-b border-outline-variant/30 bg-surface-container-lowest shrink-0">
        <h2 className="font-headline-xl text-headline-xl text-on-surface mb-1">My Tasks</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">All your tasks across every board.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-margin-page">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Tasks',  value: stats.total,      icon: 'task',             color: 'text-primary' },
            { label: 'In Progress',  value: stats.inProgress, icon: 'autorenew',        color: 'text-blue-600' },
            { label: 'Completed',    value: stats.done,        icon: 'check_circle',     color: 'text-green-600' },
            { label: 'Critical',     value: stats.critical,    icon: 'priority_high',    color: 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-4 flex items-center gap-3">
              <span className={`material-symbols-outlined text-[28px] ${s.color}`}>{s.icon}</span>
              <div>
                <p className="font-headline-md text-headline-md text-on-surface">{s.value}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input
              className="w-full pl-9 pr-4 py-2 border border-outline-variant rounded-lg font-body-sm text-body-sm bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Search tasks…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* Status */}
          <div className="flex gap-1 bg-surface-container rounded-lg p-1">
            {['all', 'backlog', 'in-progress', 'in-review', 'done'].map(v => (
              <button
                key={v}
                onClick={() => setFilter(v)}
                className={`px-3 py-1.5 rounded-md font-label-md text-label-md transition-all ${filter === v ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                {v === 'all' ? 'All' : COLUMN_LABELS[v]?.label || v}
              </button>
            ))}
          </div>
          {/* Priority */}
          <select
            className="border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm text-on-surface bg-surface-container-lowest focus:border-primary outline-none"
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-[40px] text-primary mr-3">progress_activity</span>
            <p className="text-on-surface-variant font-body-lg">Loading tasks…</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20 text-error gap-2">
            <span className="material-symbols-outlined">error</span>
            <p>{error}</p>
            <button onClick={fetchTasks} className="underline ml-2">Retry</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-[48px] text-outline mb-3">inbox</span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
              {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
            </h3>
            <p className="text-on-surface-variant font-body-sm">
              {tasks.length === 0
                ? 'Go to a Project Board and add your first task.'
                : 'Try adjusting your filters or search.'}
            </p>
            {tasks.length === 0 && (
              <button
                onClick={() => navigate('/board')}
                className="mt-4 bg-primary text-on-primary font-label-md text-label-md py-2 px-5 rounded-lg hover:bg-on-primary-fixed-variant transition-colors"
              >
                Go to Boards
              </button>
            )}
          </div>
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface-container-low">
                  {['Task', 'Priority', 'Status', 'Board', 'Due Date', 'Created', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-label-md text-label-md text-on-surface-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filtered.map(task => (
                  <TaskRow key={task._id} task={task} onDelete={handleDelete} />
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 border-t border-outline-variant/30 bg-surface-container-low">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Showing {filtered.length} of {tasks.length} tasks
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
