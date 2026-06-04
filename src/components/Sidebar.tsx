import React from 'react';
import { 
  Home, 
  FileText, 
  Users, 
  Package, 
  MessageSquare, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount?: number;
}

export default function Sidebar({ activeTab, setActiveTab, unreadCount = 2 }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadCount },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="w-[240px] flex-shrink-0 bg-white border-r border-[#f1f3f7] flex flex-col justify-between p-6 select-none h-auto md:h-screen md:sticky md:top-0 md:overflow-y-auto">
      <div className="flex flex-col gap-8">
        {/* Logo - Matching Invo style perfectly */}
        <div className="flex items-center gap-3 px-2">
          {/* Hexagon with white internal parts */}
          <div className="relative w-8 h-8 flex items-center justify-center bg-[#1d4ed8] rounded-xl shadow-sm overflow-hidden flex-shrink-0 animate-pulse">
            <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px] text-white" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
              <path d="M22 17L12 22L2 17" />
              <path d="M22 12L12 17L2 12" />
            </svg>
          </div>
          <span className="font-bold text-2xl tracking-tight text-[#111827]">Invo.</span>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer text-[15px] font-medium group text-left ${
                  isActive
                    ? 'bg-[#1a56db] text-white shadow-sm shadow-blue-100'
                    : 'text-[#6b7280] hover:text-[#111827] hover:bg-[#f8fafc]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent 
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${
                      isActive ? 'text-white' : 'text-[#9ca3af] group-hover:text-[#111827]'
                    }`} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[18px] h-[18px] transition-colors duration-200 ${
                    isActive ? 'bg-white text-[#1a56db]' : 'bg-[#1a56db] text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Log Out */}
      <button 
        onClick={() => {
          if (confirm('Are you sure you want to log out from Invo?')) {
            alert('Logged completed!');
          }
        }}
        className="flex items-center gap-3 px-4 py-3.5 mt-8 rounded-xl text-[#6b7280] hover:text-red-600 hover:bg-red-50/50 transition-all duration-300 font-medium text-[15px] group cursor-pointer"
      >
        <LogOut className="w-5 h-5 text-[#9ca3af] group-hover:text-red-500 transition-colors" />
        <span>Log Out</span>
      </button>
    </div>
  );
}
