import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useApp } from '../context/AppContext';
import CreateBoardModal from './CreateBoardModal';

export default function Layout() {
  const { showCreateBoard } = useApp();

  return (
    <div className="bg-background text-on-background font-body-md text-body-md h-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full bg-surface relative overflow-hidden">
        <Outlet />
      </div>
      {showCreateBoard && <CreateBoardModal />}
    </div>
  );
}
