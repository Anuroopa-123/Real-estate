import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/super-admin/dashboard/dashboard.component';
import {UsersComponent} from './features/super-admin/users/users.component';
import { PropertiesComponent } from './features/super-admin/properties/properties.component';
import { CreateAdminComponent } from './features/super-admin/create-admin/create-admin.component';
import { CreatePropertiesComponent } from './features/admin/create-properties/create-properties.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { AgentDashboard } from './features/agent/agent-dashboard/agent-dashboard.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
export const routes: Routes = [
      {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'superadmin/dashboard',
    component: DashboardComponent
  },
{
  path:'superadmin/users',
  component:UsersComponent
},
{
  path:'superadmin/properties',
  component:PropertiesComponent
},
{
path:'superadmin/create-admin',
component:CreateAdminComponent
},
{
path:'admin/create-properties',
component:CreatePropertiesComponent
},
{
  path:'admin/admin-dashboard',
  component:AdminDashboardComponent
},
{
path:'agent/agent-dashboard',
component:AgentDashboard
},
{
  path:'layout/sidebar',
  component:SidebarComponent
}
];
