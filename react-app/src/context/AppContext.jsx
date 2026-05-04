import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }
  // Dashboard registers its refresh callback here so CreateBoardModal can trigger it
  const onBoardCreatedRef = useRef(null);
  const registerBoardCreatedCallback = useCallback((fn) => { onBoardCreatedRef.current = fn; }, []);
  const triggerBoardCreated = useCallback((board) => { onBoardCreatedRef.current?.(board); }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  return (
    <AppContext.Provider
      value={{
        showCreateBoard,
        setShowCreateBoard,
        toast,
        showToast,
        registerBoardCreatedCallback,
        triggerBoardCreated,
      }}
    >
      {children}

      {/* Global Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-sm font-medium transition-all duration-300 animate-fade-in-down
            ${toast.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-error-container text-error border border-red-200'
            }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {toast.message}
          <button onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
