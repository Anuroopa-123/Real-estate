import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/super-admin/dashboard/dashboard.component';
import {UsersComponent} from './features/super-admin/users/users.component';
import { PropertiesComponent } from './features/super-admin/properties/properties.component';
import { CreateAdminComponent } from './features/super-admin/create-admin/create-admin.component';
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
}
];
