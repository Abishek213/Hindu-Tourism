import { createContext, useContext, useState, useMemo } from 'react';

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Memoize so context value is stable unless isSidebarOpen changes
  const value = useMemo(() => ({
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar: () => setIsSidebarOpen((prev) => !prev),
  }), [isSidebarOpen]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarContext;
