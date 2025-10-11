import React from 'react';
import { Home, Users, Briefcase, UserSquare2, Users2, Package, Handshake, FileText, Target, Settings } from 'lucide-react';

type TabKey = "home" | "clients" | "projects" | "teams" | "management" | "services" | "equipment" | "partners" | "applications" | "jobs" | "settings" | "access-requests";

interface SideBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const NAV: { key: TabKey; label: string; icon: React.ComponentType<any> }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "clients", label: "Clients", icon: Users },
  { key: "projects", label: "Projects", icon: Briefcase },
  { key: "teams", label: "Teams", icon: UserSquare2 },
  { key: "management", label: "Management", icon: Users2 },
  { key: "services", label: "Services", icon: Briefcase },
  { key: "equipment", label: "Equipment", icon: Package },
  { key: "partners", label: "Partners", icon: Handshake },
  { key: "applications", label: "Applications", icon: FileText },
  { key: "jobs", label: "Job Postings", icon: Target },
  { key: "settings", label: "Settings", icon: Settings },
];

const SideBar: React.FC<SideBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
        <nav className="space-y-2">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => onTabChange(item.key)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default SideBar;