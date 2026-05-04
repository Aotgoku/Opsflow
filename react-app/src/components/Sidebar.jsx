import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setShowCreateBoard } = useApp();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'My Tasks', path: '/tasks', icon: 'assignment_turned_in' },
    { name: 'Project Boards', path: '/board', icon: 'view_kanban' },
    { name: 'Team Directory', path: '/team', icon: 'group' },
    { name: 'Settings', path: '/settings', icon: 'settings' },
  ];

  const bottomItems = [
    { name: 'Docs', path: '/docs', icon: 'description' },
    { name: 'Support', path: '/support', icon: 'contact_support' },
  ];

  const isActive = (path) => {
    if (path === '/board') {
      return location.pathname === '/board' || location.pathname.startsWith('/board/');
    }
    return location.pathname === path;
  };

  return (
    <nav className="hidden md:flex flex-col gap-1 p-4 bg-slate-50/50 dark:bg-slate-950/50 h-screen w-64 border-r border-slate-200 dark:border-slate-800 shrink-0 font-['Inter'] text-sm font-medium tracking-wide relative z-40">
      <div className="flex items-center gap-3 mb-6 px-2 pt-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">
          <span className="material-symbols-outlined text-[20px] fill" style={{ fontVariationSettings: "'FILL' 1" }}>view_kanban</span>
        </div>
        <div>
          <h1 className="text-blue-600 dark:text-blue-400 font-black text-body-md font-headline-md tracking-tight leading-tight">DevFlow Ops</h1>
          <p className="text-secondary text-body-sm font-body-sm leading-none mt-1 opacity-80">Engineering Team</p>
        </div>
      </div>

      <button
        onClick={() => setShowCreateBoard(true)}
        id="sidebar-create-board"
        className="mb-6 bg-primary text-on-primary font-label-md text-label-md py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:bg-on-primary-fixed-variant shadow-sm w-full"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        Create Board
      </button>

      <div className="flex flex-col gap-1 flex-grow">
        {navItems.map(item => {
          const active = isActive(item.path);
          return (
            <a
              key={item.name}
              id={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-all duration-150 rounded-lg ${
                active
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-800'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${active ? 'fill' : ''}`}>{item.icon}</span>
              <span>{item.name}</span>
            </a>
          );
        })}
      </div>

      <div className="mt-auto border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-col gap-1">
        {bottomItems.map(item => (
          <a
            key={item.name}
            id={`nav-${item.name.toLowerCase()}`}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-all duration-150 rounded-lg ${
              isActive(item.path)
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-800'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span>{item.name}</span>
          </a>
        ))}
        <a
          id="nav-logout"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer transition-all duration-150 hover:bg-error-container/20 text-error rounded-lg mt-2"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
