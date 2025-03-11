import { Routes } from '@angular/router';
import { LoginComponent } from './auth';
import { GenerateRequestsComponent } from './public';

export const routes: Routes = [
  { path: '', title: 'Login', component: LoginComponent },
  { path: 'request', title: 'Solicitar', component: GenerateRequestsComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
  },
];
