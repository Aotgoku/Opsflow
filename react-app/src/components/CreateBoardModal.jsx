import React, { useState } from 'react';
import api from '../api';
import { useApp } from '../context/AppContext';

const BOARD_ICONS = [
  { icon: 'view_kanban', label: 'Kanban' },
  { icon: 'rocket_launch', label: 'Launch' },
  { icon: 'bug_report', label: 'Bug' },
  { icon: 'campaign', label: 'Marketing' },
  { icon: 'code', label: 'Dev' },
  { icon: 'design_services', label: 'Design' },
  { icon: 'flag', label: 'Goal' },
  { icon: 'star', label: 'Feature' },
  { icon: 'bolt', label: 'Sprint' },
  { icon: 'inventory_2', label: 'Product' },
];

export default function CreateBoardModal({ onCreated }) {
  const { setShowCreateBoard, showToast, triggerBoardCreated } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('view_kanban');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Board title is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/boards', {
        title: title.trim(),
        description: description.trim(),
        icon: selectedIcon,
      });
      showToast(`Board "${res.data.title}" created!`, 'success');
      setShowCreateBoard(false);
      triggerBoardCreated(res.data);
      if (onCreated) onCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create board');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) setShowCreateBoard(false); }}
    >
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-2xl w-full max-w-md mx-4 p-6 animate-fade-in-down">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-headline-md text-headline-md text-on-surface">Create New Board</h2>
          <button
            onClick={() => setShowCreateBoard(false)}
            className="text-outline hover:text-on-surface transition-colors p-1 rounded"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Icon picker */}
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant block mb-2">ICON</label>
            <div className="flex gap-2 flex-wrap">
              {BOARD_ICONS.map(({ icon, label }) => (
                <button
                  key={icon}
                  type="button"
                  title={label}
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    selectedIcon === icon
                      ? 'bg-primary text-on-primary shadow-sm ring-2 ring-primary/30'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="board-title">
              Board Title *
            </label>
            <input
              id="board-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Frontend Core Q3"
              autoFocus
              className="h-10 px-3 border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface bg-surface-container-lowest placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="board-desc">
              Description
            </label>
            <textarea
              id="board-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this board for?"
              rows={3}
              className="px-3 py-2 border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface bg-surface-container-lowest placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>

          {error && (
            <p className="text-error text-sm font-medium">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowCreateBoard(false)}
              className="flex-1 h-10 border border-outline-variant rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-10 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                  Creating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Create Board
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
