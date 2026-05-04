import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
  'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
];

function getColor(name = '') {
  const sum = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function MemberCard({ member, isCurrentUser }) {
  const initials = getInitials(member.name);
  const color = getColor(member.name);
  const joined = new Date(member.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-5 hover:shadow-[0px_4px_12px_rgba(9,30,66,0.08)] transition-shadow flex flex-col items-center text-center gap-3 relative">
      {isCurrentUser && (
        <span className="absolute top-3 right-3 bg-primary/10 text-primary font-label-md text-[10px] px-2 py-0.5 rounded-full border border-primary/20">
          You
        </span>
      )}
      <div className={`w-16 h-16 rounded-full ${color} text-white text-xl font-bold flex items-center justify-center shadow-sm`}>
        {initials}
      </div>
      <div>
        <h3 className="font-headline-md text-headline-md text-on-surface">{member.name}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{member.email}</p>
      </div>
      <div className="w-full border-t border-outline-variant/30 pt-3">
        <div className="flex items-center justify-center gap-1.5 text-on-surface-variant">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          <span className="font-body-sm text-body-sm">Joined {joined}</span>
        </div>
      </div>
    </div>
  );
}

function MemberSkeleton() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-5 animate-pulse flex flex-col items-center gap-3">
      <div className="w-16 h-16 rounded-full bg-surface-container" />
      <div className="h-4 bg-surface-container rounded w-28" />
      <div className="h-3 bg-surface-container rounded w-36" />
    </div>
  );
}

export default function Team() {
  const [members, setMembers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState('');

  // Get current user id
  const rawToken = localStorage.getItem('token');
  let currentUserId = null;
  try {
    if (rawToken) {
      const payload = JSON.parse(atob(rawToken.split('.')[1]));
      currentUserId = payload.id;
    }
  } catch {}

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/users/team');
      setMembers(res.data);
    } catch {
      setError('Failed to load team members.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface">
      {/* Header */}
      <div className="px-margin-page py-xl border-b border-outline-variant/30 bg-surface-container-lowest shrink-0">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface mb-1">Team Directory</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {loading ? 'Loading…' : `${members.length} member${members.length !== 1 ? 's' : ''} in your workspace`}
            </p>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input
              className="pl-9 pr-4 py-2 border border-outline-variant rounded-lg font-body-sm text-body-sm bg-surface-container-lowest text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-56"
              placeholder="Search members…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-margin-page">
        {error && (
          <div className="mb-6 p-4 bg-error-container text-error rounded-lg flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            {error}
            <button onClick={fetchMembers} className="ml-auto underline text-sm">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
            {Array.from({ length: 4 }).map((_, i) => <MemberSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-[48px] text-outline mb-3">group_off</span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
              {members.length === 0 ? 'No team members yet' : 'No members found'}
            </h3>
            <p className="text-on-surface-variant font-body-sm">
              {members.length === 0 ? 'Invite colleagues to your workspace.' : 'Try a different search term.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
              {filtered.map(member => (
                <MemberCard
                  key={member._id}
                  member={member}
                  isCurrentUser={member._id === currentUserId}
                />
              ))}
            </div>

            {/* Invite CTA */}
            <div className="mt-8 border-2 border-dashed border-outline-variant/40 rounded-lg p-8 flex flex-col items-center text-center text-outline hover:border-primary hover:text-primary transition-colors group cursor-pointer">
              <span className="material-symbols-outlined text-[36px] mb-2 group-hover:scale-110 transition-transform">person_add</span>
              <h3 className="font-headline-md text-headline-md mb-1">Invite a Team Member</h3>
              <p className="font-body-sm text-body-sm">Share the register link with your colleague to add them to the workspace.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
