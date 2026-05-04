import React, { useState } from 'react';

const SECTIONS = [
  { id: 'getting-started', label: 'Getting Started',    icon: 'rocket_launch' },
  { id: 'boards',          label: 'Project Boards',     icon: 'view_kanban' },
  { id: 'tasks',           label: 'Tasks & Cards',      icon: 'task_alt' },
  { id: 'team',            label: 'Team & Collaboration',icon: 'group' },
  { id: 'shortcuts',       label: 'Keyboard Shortcuts', icon: 'keyboard' },
  { id: 'api',             label: 'API Reference',      icon: 'api' },
];

const SHORTCUTS = [
  { keys: ['N'],          action: 'Create new board' },
  { keys: ['/', 'Ctrl+K'],action: 'Search' },
  { keys: ['Esc'],        action: 'Close modal / Cancel' },
  { keys: ['Enter'],      action: 'Submit card / form' },
  { keys: ['Shift+Enter'],action: 'New line in card' },
  { keys: ['?'],          action: 'Open keyboard shortcuts' },
];

const API_ENDPOINTS = [
  { method: 'POST',   path: '/api/auth/register', desc: 'Register a new user account' },
  { method: 'POST',   path: '/api/auth/login',    desc: 'Login and receive a JWT token' },
  { method: 'GET',    path: '/api/boards',        desc: 'Get all boards for current user' },
  { method: 'POST',   path: '/api/boards',        desc: 'Create a new board' },
  { method: 'GET',    path: '/api/boards/:id',    desc: 'Get a single board by ID' },
  { method: 'PUT',    path: '/api/boards/:id',    desc: 'Update board title / description' },
  { method: 'DELETE', path: '/api/boards/:id',    desc: 'Delete board and all its tasks' },
  { method: 'GET',    path: '/api/tasks',         desc: 'Get tasks (use ?boardId= to filter)' },
  { method: 'POST',   path: '/api/tasks',         desc: 'Create a new task card' },
  { method: 'PATCH',  path: '/api/tasks/:id',     desc: 'Update task (move column, priority…)' },
  { method: 'DELETE', path: '/api/tasks/:id',     desc: 'Delete a task card' },
  { method: 'GET',    path: '/api/users/me',      desc: 'Get current user profile' },
  { method: 'PUT',    path: '/api/users/me',      desc: 'Update name, email or password' },
  { method: 'GET',    path: '/api/users/team',    desc: 'Get all workspace members' },
  { method: 'GET',    path: '/api/health',        desc: 'Backend health check' },
];

const METHOD_COLORS = {
  GET:    'bg-green-50 text-green-700 border-green-200',
  POST:   'bg-blue-50 text-blue-700 border-blue-200',
  PUT:    'bg-yellow-50 text-yellow-700 border-yellow-200',
  PATCH:  'bg-orange-50 text-orange-700 border-orange-200',
  DELETE: 'bg-red-50 text-red-700 border-red-200',
};

function Kbd({ children }) {
  return (
    <kbd className="inline-flex items-center px-2 py-0.5 rounded border border-outline-variant bg-surface-container font-code-sm text-code-sm text-on-surface-variant shadow-sm">
      {children}
    </kbd>
  );
}

function DocSection({ id, title, icon, children }) {
  return (
    <div id={id} className="mb-10 scroll-mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Callout({ type = 'info', children }) {
  const styles = {
    info:    { bg: 'bg-blue-50 border-blue-200',   icon: 'info',    text: 'text-blue-800' },
    tip:     { bg: 'bg-green-50 border-green-200', icon: 'lightbulb', text: 'text-green-800' },
    warning: { bg: 'bg-yellow-50 border-yellow-200', icon: 'warning', text: 'text-yellow-800' },
  };
  const s = styles[type];
  return (
    <div className={`flex gap-3 p-4 rounded-lg border ${s.bg} mb-4`}>
      <span className={`material-symbols-outlined text-[20px] shrink-0 ${s.text}`}>{s.icon}</span>
      <p className={`font-body-sm text-body-sm ${s.text}`}>{children}</p>
    </div>
  );
}

export default function Docs() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-surface">
      {/* Sidebar TOC */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-outline-variant/30 p-4 gap-1 overflow-y-auto bg-surface-container-lowest">
        <p className="font-label-md text-label-md text-on-surface-variant mb-3 px-2">ON THIS PAGE</p>
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => scrollTo(s.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors font-body-sm text-body-sm ${
              activeSection === s.id
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-margin-page">
        <div className="max-w-3xl">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">Documentation</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Everything you need to use DevFlow Ops effectively.
            </p>
          </div>

          {/* Getting Started */}
          <DocSection id="getting-started" title="Getting Started" icon="rocket_launch">
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              DevFlow Ops is a full-stack project management tool built for engineering teams. It combines Kanban-style boards with real-time task tracking and team collaboration.
            </p>
            <ol className="list-none flex flex-col gap-3">
              {[
                { step: '1', title: 'Create an account', desc: 'Register with your name, email and a password. Your session is secured with a JWT token.' },
                { step: '2', title: 'Create your first board', desc: 'Click "+ Create Board" in the sidebar. Give it a title and icon — you\'ll be navigated directly to your new board.' },
                { step: '3', title: 'Add tasks', desc: 'Click "Add a card" in any column. Press Enter to save, or Shift+Enter for a new line.' },
                { step: '4', title: 'Drag & drop', desc: 'Move cards between Backlog → In Progress → In Review → Done by dragging and dropping.' },
                { step: '5', title: 'Invite your team', desc: 'Share the app URL with your colleagues. They can register and appear in Team Directory.' },
              ].map(item => (
                <li key={item.step} className="flex gap-3 p-4 bg-surface-container-low rounded-lg border border-outline-variant/30">
                  <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-bold text-sm flex items-center justify-center shrink-0">{item.step}</span>
                  <div>
                    <p className="font-body-md text-body-md font-semibold text-on-surface">{item.title}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </DocSection>

          {/* Boards */}
          <DocSection id="boards" title="Project Boards" icon="view_kanban">
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              Boards are containers for your work. Each board has four Kanban columns: <strong>Backlog</strong>, <strong>In Progress</strong>, <strong>In Review</strong>, and <strong>Done</strong>.
            </p>
            <Callout type="tip">
              You can have unlimited boards. Use separate boards for different projects, sprints, or teams.
            </Callout>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Create', desc: 'Click "+ Create Board" in the sidebar or the dashed card on the Dashboard.' },
                { title: 'Open', desc: 'Click any board card on the Dashboard to open it.' },
                { title: 'Delete', desc: 'Hover a board card → three-dot menu → Delete Board. All tasks are removed too.' },
                { title: 'Search', desc: 'Use the search bar on the Dashboard to filter boards by title or description.' },
              ].map(item => (
                <div key={item.title} className="p-4 bg-surface-container-low border border-outline-variant/30 rounded-lg">
                  <p className="font-body-md text-body-md font-semibold text-on-surface mb-1">{item.title}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
                </div>
              ))}
            </div>
          </DocSection>

          {/* Tasks */}
          <DocSection id="tasks" title="Tasks & Cards" icon="task_alt">
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              Tasks are the core unit of work. Each card has a title, priority level, optional description and due date.
            </p>
            <div className="mb-4">
              <p className="font-body-md text-body-md font-semibold text-on-surface mb-2">Priority levels</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { p: 'Critical', c: 'bg-red-50 text-red-700 border-red-200' },
                  { p: 'High',     c: 'bg-orange-50 text-orange-700 border-orange-200' },
                  { p: 'Medium',   c: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
                  { p: 'Low',      c: 'bg-green-50 text-green-700 border-green-200' },
                ].map(({ p, c }) => (
                  <span key={p} className={`px-3 py-1 rounded-full text-sm font-semibold border ${c}`}>{p}</span>
                ))}
              </div>
            </div>
            <Callout type="info">
              All tasks are visible on "My Tasks" page where you can filter by status, priority and search by keyword.
            </Callout>
          </DocSection>

          {/* Team */}
          <DocSection id="team" title="Team & Collaboration" icon="group">
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              The Team Directory shows all registered users in your workspace. Anyone who registers on DevFlow Ops becomes a team member.
            </p>
            <Callout type="warning">
              There is currently no invite-only access control. This is suitable for internal or private deployments.
            </Callout>
          </DocSection>

          {/* Shortcuts */}
          <DocSection id="shortcuts" title="Keyboard Shortcuts" icon="keyboard">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg overflow-hidden">
              {SHORTCUTS.map((s, i) => (
                <div key={i} className={`flex items-center justify-between px-4 py-3 ${i < SHORTCUTS.length - 1 ? 'border-b border-outline-variant/20' : ''}`}>
                  <span className="font-body-md text-body-md text-on-surface">{s.action}</span>
                  <div className="flex gap-1.5">
                    {s.keys.map((k, j) => (
                      <React.Fragment key={j}>
                        <Kbd>{k}</Kbd>
                        {j < s.keys.length - 1 && <span className="text-on-surface-variant text-sm self-center">or</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </DocSection>

          {/* API Reference */}
          <DocSection id="api" title="API Reference" icon="api">
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              The backend runs on <code className="bg-surface-container px-1.5 py-0.5 rounded text-sm font-mono">http://localhost:5000</code>. All protected routes require an <code className="bg-surface-container px-1.5 py-0.5 rounded text-sm font-mono">Authorization: Bearer &lt;token&gt;</code> header.
            </p>
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg overflow-hidden">
              {API_ENDPOINTS.map((ep, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < API_ENDPOINTS.length - 1 ? 'border-b border-outline-variant/20' : ''}`}>
                  <span className={`font-code-sm text-code-sm px-2 py-0.5 rounded border font-bold shrink-0 w-16 text-center ${METHOD_COLORS[ep.method]}`}>
                    {ep.method}
                  </span>
                  <code className="font-code-sm text-code-sm text-on-surface bg-surface-container px-2 py-0.5 rounded shrink-0">
                    {ep.path}
                  </code>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{ep.desc}</span>
                </div>
              ))}
            </div>
          </DocSection>
        </div>
      </div>
    </div>
  );
}
