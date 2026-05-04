import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { DndContext, closestCorners } from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import api from '../api';

// ─── Droppable Column ──────────────────────────────────────────────────────────

function DroppableColumn({ id, title, tasksCount, onAddClick, onClearClick, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`w-[320px] min-w-[280px] max-w-[400px] flex flex-col max-h-full rounded-lg bg-surface-container-low shrink-0 border transition-colors ${isOver ? 'border-primary shadow-sm bg-primary/5' : 'border-outline-variant/30'
        }`}
    >
      <div className="p-3 flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-lowest/50 rounded-t-lg">
        <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
          {title}
          <span className={`${id === 'in-progress' ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'} font-label-md text-[11px] px-2 py-0.5 rounded-full`}>
            {tasksCount}
          </span>
        </h3>
        <button onClick={() => onClearClick(id, title)} className="text-outline hover:text-on-surface transition-colors" title="Clear Column">
          <span className="material-symbols-outlined text-[18px]">more_horiz</span>
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto p-2 flex flex-col gap-2 min-h-[100px] ${tasksCount === 0 ? 'items-center justify-center border-2 border-dashed border-outline-variant/40 rounded-lg m-2' : ''}`}>
        {children}
      </div>

      <div className="p-2 border-t border-outline-variant/30 bg-surface-container-lowest/50 rounded-b-lg flex items-center gap-2">
        <button
          onClick={onAddClick}
          className="flex-1 text-left text-on-surface-variant font-body-sm text-body-sm py-2 px-2 rounded-md hover:bg-surface-container transition-colors flex items-center gap-2 group"
        >
          <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">add</span>
          Add a card
        </button>
        <button
          onClick={onAddClick}
          className="bg-primary/10 text-primary p-2 rounded-md hover:bg-primary/20 transition-colors" title="Auto-Generate Steps"
        >
          <span className="material-symbols-outlined text-[18px]">psychology</span>
        </button>
      </div>
    </div>
  );
}

// ─── Priority Colours ──────────────────────────────────────────────────────────

const PRIORITY_STYLES = {
  critical: { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700' },
  high: { dot: 'bg-orange-500', badge: 'bg-orange-50 text-orange-700' },
  medium: { dot: 'bg-yellow-400', badge: 'bg-yellow-50 text-yellow-700' },
  low: { dot: 'bg-green-500', badge: 'bg-green-50 text-green-700' },
};

// ─── Draggable Task Card ───────────────────────────────────────────────────────

function DraggableTask({ task, columnId, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task, columnId },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: isDragging ? 999 : undefined, opacity: isDragging ? 0.5 : 1 }
    : undefined;

  const priority = task.priority || 'medium';
  const ps = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-3 hover:shadow-[0px_4px_12px_rgba(9,30,66,0.08)] transition-all cursor-grab active:cursor-grabbing group relative touch-none ${isDragging ? 'shadow-lg ring-2 ring-primary border-transparent' : ''
        }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`${ps.badge} font-code-sm text-[10px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-semibold`}>
          {priority}
        </span>
        <button
          onPointerDown={e => e.stopPropagation()}
          onClick={() => onDelete(columnId, task.id)}
          className="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
        </button>
      </div>
      <h4 className="font-body-md text-body-md font-semibold text-on-surface mb-2 leading-snug">{task.title}</h4>
      {task.description && (
        <p className="text-on-surface-variant font-body-sm text-body-sm mb-2 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between mt-3">
        <span className={`w-2 h-2 rounded-full ${ps.dot}`} />
        {task.dueDate && (
          <span className="text-outline font-body-sm text-body-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">calendar_today</span>
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Add Task Form ─────────────────────────────────────────────────────────────
function AddTaskForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiBreakdown = async () => {
    if (!title.trim()) return alert("Please enter a title first!");

    setIsAiLoading(true);
    try {
      const res = await api.post('/api/ai/breakdown', { title });
      setDescription(res.data.breakdown);
    } catch (err) {
      alert("AI Breakdown failed. Check your API key.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), priority, description.trim()); // Pass description too
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  return (
    <div className="bg-surface-container-lowest border border-primary/50 shadow-lg rounded-lg p-3 mt-2 animate-in fade-in zoom-in duration-200">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">edit_note</span>
          New Task
        </span>
        <button
          onClick={handleAiBreakdown}
          disabled={isAiLoading || !title}
          className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1 hover:bg-primary/20 disabled:opacity-50 transition-all"
        >
          {isAiLoading ? (
            <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined text-[14px]">psychology</span>
          )}
          Auto-Generate Steps
        </button>
      </div>

      <textarea
        autoFocus
        className="w-full resize-none border-none focus:ring-0 p-1 text-body-md font-body-md text-on-surface bg-transparent min-h-[40px] outline-none"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      {description && (
        <textarea
          className="w-full resize-none border border-outline-variant/30 rounded p-2 text-body-sm font-body-sm text-on-surface-variant bg-surface-container/30 mt-2 min-h-[80px] outline-none focus:border-primary/50"
          placeholder="Generated steps..."
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      )}

      <div className="flex items-center gap-2 mt-3">
        {['low', 'medium', 'high', 'critical'].map(p => (
          <button
            key={p}
            onClick={() => setPriority(p)}
            className={`text-[9px] font-bold px-2 py-1 rounded-sm uppercase transition-all ${priority === p ? `bg-primary text-on-primary` : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-2 border-t border-outline-variant/20">
        <button
          onClick={handleSubmit}
          className="bg-primary text-on-primary font-label-md text-[12px] py-1.5 px-4 rounded hover:bg-primary/90 transition-colors shadow-sm"
        >
          Save Task
        </button>
        <button onClick={onCancel} className="text-outline hover:text-error transition-colors">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
    </div>
  );
}


// ─── Main Component ────────────────────────────────────────────────────────────

const DEFAULT_COLUMNS = [
  { id: 'backlog', title: 'Backlog', tasks: [] },
  { id: 'in-progress', title: 'In Progress', tasks: [] },
  { id: 'in-review', title: 'In Review', tasks: [] },
  { id: 'done', title: 'Done', tasks: [] },
];

export default function TaskBoard() {
  const navigate = useNavigate();
  const { boardId } = useParams();

  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS.map(c => ({ ...c })));
  const [activeInputColumn, setActiveInputColumn] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [globalError, setGlobalError] = useState(null);

  // ── Fetch board info (if boardId given) ──────────────────────────────────────
  useEffect(() => {
    const fetchBoard = async () => {
      if (!boardId) { setBoard(null); return; }
      try {
        const res = await api.get(`/api/boards/${boardId}`);
        setBoard(res.data);
      } catch {
        setBoard(null);
      }
    };
    fetchBoard();
  }, [boardId]);

  // ── Fetch tasks ──────────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = boardId ? `/api/tasks?boardId=${boardId}` : '/api/tasks';
      const res = await api.get(url);
      const backendTasks = res.data;

      const updated = DEFAULT_COLUMNS.map(col => ({
        ...col,
        tasks: backendTasks
          .filter(t => t.column === col.id)
          .map(t => ({
            id: t._id,
            title: t.title,
            description: t.description || '',
            priority: t.priority || 'medium',
            dueDate: t.dueDate || null,
            labels: t.labels || [],
          })),
      }));
      setColumns(updated);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setGlobalError('Failed to load tasks. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [boardId, navigate]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── Add task ─────────────────────────────────────────────────────────────────
  const handleAddTask = async (columnId, title, priority, description = '') => {
    try {
      const res = await api.post('/api/tasks', {
        title,
        column: columnId,
        priority,
        description,
        ...(boardId ? { boardId } : {}),
      });
      const newTask = {
        id: res.data._id,
        title: res.data.title,
        description: res.data.description || '',
        priority: res.data.priority || 'medium',
        dueDate: res.data.dueDate || null,
        labels: res.data.labels || [],
      };
      setColumns(cols => cols.map(col =>
        col.id === columnId ? { ...col, tasks: [newTask, ...col.tasks] } : col
      ));
      setActiveInputColumn(null);
    } catch {
      setGlobalError('Failed to add task. Please try again.');
    }
  };

  // ── Delete task ──────────────────────────────────────────────────────────────
  const handleDeleteTask = async (columnId, taskId) => {
    try {
      await api.delete(`/api/tasks/${taskId}`);
      setColumns(cols => cols.map(col =>
        col.id === columnId ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) } : col
      ));
    } catch {
      setGlobalError('Failed to delete task.');
    }
  };

  const handleClearColumn = async (columnId, columnTitle) => {
    if (!window.confirm(`Are you sure you want to delete all tasks in "${columnTitle}"?`)) return;
    
    const tasksToClear = columns.find(c => c.id === columnId)?.tasks || [];
    if (tasksToClear.length === 0) return;

    try {
      await Promise.all(tasksToClear.map(t => api.delete(`/api/tasks/${t.id}`)));
      setColumns(cols => cols.map(col => 
        col.id === columnId ? { ...col, tasks: [] } : col
      ));
    } catch {
      setGlobalError('Failed to clear column.');
    }
  };

  // ── Drag end ─────────────────────────────────────────────────────────────────
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const sourceColId = active.data.current?.columnId;
    const targetColId = over.id;

    if (!sourceColId || !targetColId || sourceColId === targetColId) return;

    const activeTask = active.data.current?.task;

    // Optimistic update
    setColumns(prev => {
      const next = [...prev];
      const srcIdx = next.findIndex(c => c.id === sourceColId);
      const tgtIdx = next.findIndex(c => c.id === targetColId);
      next[srcIdx] = { ...next[srcIdx], tasks: next[srcIdx].tasks.filter(t => t.id !== taskId) };
      next[tgtIdx] = { ...next[tgtIdx], tasks: [activeTask, ...next[tgtIdx].tasks] };
      return next;
    });

    try {
      await api.patch(`/api/tasks/${taskId}`, { column: targetColId });
    } catch {
      setGlobalError('Failed to move task.');
      fetchTasks(); // revert
    }
  };

  const totalTasks = columns.reduce((s, c) => s + c.tasks.length, 0);

  return (
    <>
      {/* Error Toast */}
      {globalError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-error-container text-error px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          <span className="font-medium text-sm">{globalError}</span>
          <button onClick={() => setGlobalError(null)} className="ml-2 hover:opacity-70">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-0 bg-surface-container-lowest">
        {/* Board Header */}
        <header className="h-16 border-b border-outline-variant/30 flex items-center justify-between px-lg shrink-0 bg-surface-container-lowest z-10">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="text-outline hover:text-on-surface transition-colors p-1 rounded">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface leading-tight">
                {board ? board.title : boardId ? 'Loading…' : 'All Tasks'}
              </h2>
              {board?.description && (
                <p className="font-body-sm text-body-sm text-on-surface-variant">{board.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-surface-container text-on-surface-variant font-label-md text-label-md px-2 py-1 rounded-full">
              {totalTasks} task{totalTasks !== 1 ? 's' : ''}
            </span>
            <button className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-md hover:bg-surface-container">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </header>

        {/* Board Canvas */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-background">
            <span className="material-symbols-outlined animate-spin text-[40px] text-primary mb-4">progress_activity</span>
            <p className="text-on-surface-variant font-body-lg">Loading tasks…</p>
          </div>
        ) : totalTasks === 0 && !activeInputColumn ? (
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4 max-w-sm text-center">
              <div className="w-16 h-16 bg-primary-container text-primary rounded-full flex items-center justify-center mb-2 shadow-sm">
                <span className="material-symbols-outlined text-[32px]">task</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg text-on-surface">No tasks yet</h3>
              <p className="text-on-surface-variant font-body-md text-body-md mb-4">
                You have a clean slate! Start by adding your first card.
              </p>
              <button
                onClick={() => setActiveInputColumn('backlog')}
                className="bg-primary text-on-primary font-label-md text-label-md py-2.5 px-6 rounded-lg hover:bg-on-primary-fixed-variant transition-colors shadow-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Create First Task
              </button>
            </div>
          </div>
        ) : (
          <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div style={{ display: 'flex', flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '16px', gap: '12px', alignItems: 'flex-start', background: 'var(--md-sys-color-background, #f8f9ff)', height: '100%' }}>
              {columns.map(column => (
                <React.Fragment key={column.id}>
                  <DroppableColumn
                    id={column.id}
                    title={column.title}
                    tasksCount={column.tasks.length}
                    onAddClick={() => setActiveInputColumn(column.id)}
                    onClearClick={handleClearColumn}
                  >
                    {column.tasks.length === 0 ? (
                      <span className="text-outline font-body-sm text-body-sm text-center block mt-4">
                        Drop tasks here
                      </span>
                    ) : (
                      column.tasks.map(task => (
                        <DraggableTask
                          key={task.id}
                          task={task}
                          columnId={column.id}
                          onDelete={handleDeleteTask}
                        />
                      ))
                    )}

                    {activeInputColumn === column.id && (
                      <AddTaskForm
                        onAdd={(title, priority, description) => handleAddTask(column.id, title, priority, description)}
                        onCancel={() => setActiveInputColumn(null)}
                      />
                    )}
                  </DroppableColumn>
                </React.Fragment>
              ))}

              {/* Add Column placeholder */}
              <button className="w-[280px] shrink-0 bg-surface-container-lowest/50 border border-dashed border-outline-variant hover:border-outline hover:bg-surface-container-low text-on-surface-variant font-body-md text-body-md py-3 px-4 rounded-lg transition-all flex items-center gap-2 h-12">
                <span className="material-symbols-outlined text-[20px]">add</span>
                Add another list
              </button>
            </div>
          </DndContext>
        )}
      </div>
    </>
  );
}
