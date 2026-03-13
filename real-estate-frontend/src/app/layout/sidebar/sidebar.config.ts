export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'AGENT'
  | 'BUYER';

export const SIDEBAR_MENU: Record<UserRole, {label:string,path:string}[]> = {

  SUPER_ADMIN: [
    { label: "Dashboard", path: "/superadmin/dashboard" },
    { label: "Admins", path: "/superadmin/users" },
    { label: "Approve Properties", path: "/superadmin/properties" }
  ],

  ADMIN: [
    { label: "Dashboard", path: "/admin/admin-dashboard" },
    { label: "Create Agent", path: "/admin/create-agent" },
    { label: "Agents", path: "/admin/agents" },
    { label: "Categories", path: "/admin/categories" }
  ],

  AGENT: [
    { label: "Dashboard", path: "/agent/dashboard" },
    { label: "Create Property", path: "/agent/create-property" },
    { label: "My Properties", path: "/agent/properties" }
  ],

  BUYER: [
    { label: "Home", path: "/buyer/dashboard" },
    { label: "Saved Properties", path: "/buyer/saved" },
    { label: "Appointments", path: "/buyer/appointments" }
  ]

};