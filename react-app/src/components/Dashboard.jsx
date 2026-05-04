import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useApp } from '../context/AppContext';

const ICON_BG_MAP = {
  view_kanban:    { bg: 'bg-blue-50',   color: 'text-blue-600' },
  rocket_launch:  { bg: 'bg-purple-50', color: 'text-purple-600' },
  bug_report:     { bg: 'bg-red-50',    color: 'text-red-600' },
  campaign:       { bg: 'bg-orange-50', color: 'text-orange-600' },
  code:           { bg: 'bg-cyan-50',   color: 'text-cyan-700' },
  design_services:{ bg: 'bg-pink-50',   color: 'text-pink-600' },
  flag:           { bg: 'bg-green-50',  color: 'text-green-600' },
  star:           { bg: 'bg-yellow-50', color: 'text-yellow-600' },
  bolt:           { bg: 'bg-indigo-50', color: 'text-indigo-600' },
  inventory_2:    { bg: 'bg-teal-50',   color: 'text-teal-600' },
};

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function AvatarStack({ members }) {
  if (!members || members.length === 0) return null;
  const visible = members.slice(0, 3);
  const extra = members.length - 3;
  return (
    <div className="flex -space-x-2">
      {visible.map((m, i) => (
        <div
          key={m._id || i}
          title={m.name}
          className="w-6 h-6 rounded-full border-2 border-surface-container-lowest bg-primary-container text-primary text-[9px] font-bold flex items-center justify-center"
          style={{ zIndex: visible.length - i }}
        >
          {getInitials(m.name)}
        </div>
      ))}
      {extra > 0 && (
        <div className="w-6 h-6 rounded-full bg-surface-container-high border-2 border-surface-container-lowest flex items-center justify-center text-[10px] text-on-surface-variant font-medium">
          +{extra}
        </div>
      )}
    </div>
  );
}

function BoardCard({ board, onDelete, onClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const iconStyle = ICON_BG_MAP[board.icon] || ICON_BG_MAP['view_kanban'];

  return (
    <div
      onClick={onClick}
      className="bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-md hover:shadow-[0px_4px_12px_rgba(9,30,66,0.10)] transition-shadow duration-200 group cursor-pointer flex flex-col h-full relative"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-lg ${iconStyle.bg} flex items-center justify-center ${iconStyle.color}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{board.icon}</span>
        </div>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
            className="text-outline hover:text-on-surface opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
            id={`board-menu-${board._id}`}
          >
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-7 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xl z-20 py-1 min-w-[140px]">
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(board._id, board.title); }}
                className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error-container/20 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                Delete Board
              </button>
            </div>
          )}
        </div>
      </div>
      <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{board.title}</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 flex-grow line-clamp-2">
        {board.description || 'No description yet.'}
      </p>
      <div className="flex justify-between items-center mt-auto border-t border-outline-variant/30 pt-3">
        <AvatarStack members={board.members} />
        <div className="flex items-center gap-1 text-on-surface-variant font-body-sm">
          <span className="material-symbols-outlined text-[16px]">task_alt</span>
          <span>{board.taskCount ?? 0} task{board.taskCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}

function BoardSkeleton() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-md animate-pulse h-[200px] flex flex-col gap-3">
      <div className="w-10 h-10 rounded-lg bg-surface-container" />
      <div className="h-4 bg-surface-container rounded w-2/3" />
      <div className="h-3 bg-surface-container rounded w-full" />
      <div className="h-3 bg-surface-container rounded w-4/5" />
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { setShowCreateBoard, registerBoardCreatedCallback } = useApp();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleBoardCreated = useCallback((newBoard) => {
    setBoards(prev => [newBoard, ...prev]);
    navigate(`/board/${newBoard._id}`);
  }, [navigate]);

  // Register so sidebar's Create Board → modal → also refreshes this page
  useEffect(() => {
    registerBoardCreatedCallback(handleBoardCreated);
  }, [registerBoardCreatedCallback, handleBoardCreated]);

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/boards');
      setBoards(res.data);
    } catch {
      setError('Failed to load boards. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBoards(); }, [fetchBoards]);

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await api.delete(`/api/boards/${deleteConfirm.id}`);
      setBoards(prev => prev.filter(b => b._id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (err) {
      alert('Failed to delete board. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = boards.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    (b.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Topbar */}
      <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-50 flex justify-between items-center px-6 h-16 w-full md:hidden">
        <h1 className="text-lg font-bold tracking-tight">DevFlow Ops</h1>
      </header>

      {/* Page Header */}
      <div className="px-margin-page py-xl flex justify-between items-end border-b border-outline-variant/30 bg-surface-container-lowest shrink-0">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface mb-2">Project Boards</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage and track your active workflows.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input
              id="board-search"
              className="pl-10 pr-4 py-2 border border-outline-variant rounded-lg font-body-sm text-body-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-64 bg-surface-container-lowest text-on-surface placeholder:text-outline"
              placeholder="Search boards..."
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            id="header-create-board"
            onClick={() => setShowCreateBoard(true)}
            className="bg-primary text-on-primary font-label-md text-label-md py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-on-primary-fixed-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Board
          </button>
        </div>
      </div>

      {/* Board Grid */}
      <div className="p-margin-page overflow-y-auto flex-1 bg-surface">
        {error && (
          <div className="mb-6 p-4 bg-error-container text-error rounded-lg flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            {error}
            <button onClick={fetchBoards} className="ml-auto underline text-sm">Retry</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <BoardSkeleton key={i} />)
          ) : (
            <>
              {filtered.map(board => (
                <BoardCard
                  key={board._id}
                  board={board}
                  onClick={() => navigate(`/board/${board._id}`)}
                  onDelete={(id, title) => setDeleteConfirm({ id, title })}
                />
              ))}

              {/* Create New Board Card */}
              <button
                id="create-board-card"
                onClick={() => setShowCreateBoard(true)}
                className="bg-transparent border-2 border-dashed border-outline-variant/50 rounded-lg p-md hover:border-primary hover:bg-surface-container-low transition-colors duration-200 flex flex-col items-center justify-center min-h-[200px] text-outline hover:text-primary group"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container-high group-hover:bg-primary-container/10 flex items-center justify-center mb-4 transition-colors">
                  <span className="material-symbols-outlined text-[24px]">add</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-1">Create New Board</h3>
                <p className="font-body-sm text-body-sm text-center px-4">Start a new workflow or project</p>
              </button>
            </>
          )}
        </div>

        {!loading && filtered.length === 0 && boards.length > 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-[48px] text-outline mb-3">search_off</span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">No boards found</h3>
            <p className="text-on-surface-variant font-body-sm">Try a different search term</p>
          </div>
        )}

        {!loading && boards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-primary-container text-primary rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px]">view_kanban</span>
            </div>
            <h3 className="font-headline-lg text-headline-lg text-on-surface mb-2">No boards yet</h3>
            <p className="text-on-surface-variant font-body-md mb-6">Create your first board to start organizing your work.</p>
            <button
              onClick={() => setShowCreateBoard(true)}
              className="bg-primary text-on-primary font-label-md text-label-md py-2.5 px-6 rounded-lg hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create First Board
            </button>
          </div>
        )}
      </div>

      {/* CreateBoardModal via Layout — pass onCreated callback through context if needed */}
      {/* Delete Confirm Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-2xl max-w-sm w-full mx-4 p-6">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Delete Board?</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>? This will also delete all tasks in this board. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 h-10 border border-outline-variant rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 h-10 bg-error text-on-error rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
