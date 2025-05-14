import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  User, 
  Calendar, 
  Package, 
  CreditCard, 
  BarChart2, 
  Settings,
  ChevronRight,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const SidebarItem = ({ icon, title, path, active, onClick, hasSubmenu, submenuOpen, children }) => {
  return (
    <div className="mb-1">
      <Link 
        to={path} 
        className={`flex items-center px-4 py-3 text-sm rounded-lg ${
          active 
            ? 'bg-orange-600 text-white' 
            : 'text-gray-700 hover:bg-orange-100'
        }`}
        onClick={onClick}
      >
        <div className="mr-3">{icon}</div>
        <span className={`flex-1 ${active ? 'font-medium' : ''}`}>{title}</span>
        {hasSubmenu && (
          <div className="ml-auto">
            {submenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
        )}
      </Link>
      {hasSubmenu && submenuOpen && (
        <div className="pl-10 mt-1">
          {children}
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const [submenuOpen, setSubmenuOpen] = useState({
    leads: false,
    customers: false,
    bookings: false
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSubmenu = (submenu) => {
    setSubmenuOpen({
      ...submenuOpen,
      [submenu]: !submenuOpen[submenu]
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isPathActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <div className="fixed z-20 top-4 left-4 lg:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-orange-500 text-white rounded-md"
        >
          <Menu size={24} />
        </button>
      </div>
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-30 
          ${sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center">
            <img 
              src="/assets/logo.png" 
              alt="TheHinduTourism" 
              className="h-8 w-auto mr-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/32x32?text=THT";
              }}
            />
            <h1 className="text-lg font-bold text-orange-600">TheHinduTourism</h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 text-gray-500 rounded-md lg:hidden"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          <SidebarItem 
            icon={<Home size={18} />} 
            title="Dashboard" 
            path="/dashboard/sales" 
            active={isPathActive("/dashboard/sales")} 
          />
          
          <SidebarItem 
            icon={<Users size={18} />} 
            title="Leads" 
            path="/leads"
            active={isPathActive("/leads")}
            hasSubmenu={true}
            submenuOpen={submenuOpen.leads}
            onClick={(e) => {
              e.preventDefault();
              toggleSubmenu('leads');
            }}
          >
            <SidebarItem 
              title="All Leads" 
              path="/leads" 
              active={isPathActive("/leads")} 
            />
            <SidebarItem 
              title="New Leads" 
              path="/leads/new" 
              active={isPathActive("/leads/new")} 
            />
            <SidebarItem 
              title="Add Lead" 
              path="/leads/add" 
              active={isPathActive("/leads/add")} 
            />
          </SidebarItem>
          
          <SidebarItem 
            icon={<User size={18} />} 
            title="Customers" 
            path="/customers"
            active={isPathActive("/customers")}
            hasSubmenu={true}
            submenuOpen={submenuOpen.customers}
            onClick={(e) => {
              e.preventDefault();
              toggleSubmenu('customers');
            }}
          >
            <SidebarItem 
              title="All Customers" 
              path="/customers" 
              active={isPathActive("/customers")} 
            />
            <SidebarItem 
              title="VIP Customers" 
              path="/customers/vip" 
              active={isPathActive("/customers/vip")} 
            />
          </SidebarItem>
          
          <SidebarItem 
            icon={<Calendar size={18} />} 
            title="Bookings" 
            path="/bookings"
            active={isPathActive("/bookings")}
            hasSubmenu={true}
            submenuOpen={submenuOpen.bookings}
            onClick={(e) => {
              e.preventDefault();
              toggleSubmenu('bookings');
            }}
          >
            <SidebarItem 
              title="All Bookings" 
              path="/bookings" 
              active={isPathActive("/bookings")} 
            />
            <SidebarItem 
              title="New Booking" 
              path="/bookings/new" 
              active={isPathActive("/bookings/new")} 
            />
          </SidebarItem>
          
          <SidebarItem 
            icon={<Package size={18} />} 
            title="Packages" 
            path="/packages" 
            active={isPathActive("/packages")} 
          />
          
          <SidebarItem 
            icon={<CreditCard size={18} />} 
            title="Payments" 
            path="/payments" 
            active={isPathActive("/payments")} 
          />
          
          <SidebarItem 
            icon={<BarChart2 size={18} />} 
            title="Reports" 
            path="/reports" 
            active={isPathActive("/reports")} 
          />
          
          <SidebarItem 
            icon={<Settings size={18} />} 
            title="Settings" 
            path="/settings" 
            active={isPathActive("/settings")} 
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar;