// This file is also long. Find the `NAV` array and add a new entry for "Services".

const NAV: { key: TabKey; label: string; icon: React.ComponentType<any> }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "clients", label: "Clients", icon: Users },
  { key: "projects", label: "Projects", icon: Briefcase },
  { key: "teams", label: "Teams", icon: UserSquare2 },
  { key: "management", label: "Management", icon: Users2 },
  { key: "services", label: "Services", icon: Briefcase }, // ADD THIS LINE
  { key: "equipment", label: "Equipment", icon: Package },
  { key: "partners", label: "Partners", icon: Handshake },
  { key: "applications", label: "Applications", icon: FileText },
  { key: "jobs", label: "Job Postings", icon: Target },
  { key: "settings", label: "Settings", icon: Settings },
];
// ... the rest of the file remains the same.