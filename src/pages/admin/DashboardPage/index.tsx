import React, { useState, useEffect } from "react";
import SideBar from "./components/SideBar";

import Topbar from "./components/Topbar";

import HomeTab from "./tabs/HomeTab";
import ClientsTab from "./tabs/ClientsTab";
import ProjectsTab from "./tabs/ProjectsTab";
import TeamsTab from "./tabs/TeamsTab";
import EquipmentTab from "./tabs/EquipmentTab";
import PartnersTab from "./tabs/PartnersTab";
import SettingsTab from "./tabs/SettingsTab";
import ApplicationsTab from "./tabs/ApplicationsTab";
import JobsTab from "./tabs/JobsTab";
import ManagementTab from "./tabs/ManagementTab";
import ServicesTab from "./tabs/ServicesTab"; // ADD THIS

export type TabKey =
  | "home"
  | "clients"
  | "projects"
  | "teams"
  | "management"
  | "services" // ADD THIS
  | "equipment"
  | "partners"
  | "applications"
  | "jobs" 
  | "settings";

const DashboardPage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("home");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  // ... rest of the file is unchanged, just add the new tab to the JSX

  return (
    // ... inside the main div
        <main className="flex-1 overflow-auto p-4 sm:p-5">
          {tab === "home" && <HomeTab />}
          {tab === "clients" && <ClientsTab />}
          {tab === "projects" && <ProjectsTab />}
          {tab === "teams" && <TeamsTab />}
          {tab === "management" && <ManagementTab />}
          {tab === "services" && <ServicesTab />} {/* ADD THIS LINE */}
          {tab === "equipment" && <EquipmentTab />}
          {tab === "partners" && <PartnersTab />}
          {tab === "applications" && <ApplicationsTab />}
          {tab === "jobs" && <JobsTab />}
          {tab === "settings" && <SettingsTab />}
        </main>
    // ... rest of the file
  );
};

export default DashboardPage;