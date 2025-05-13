import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout = ({ children, activeTab, setActiveTab, searchTerm, setSearchTerm, notifications }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          notifications={notifications} 
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};