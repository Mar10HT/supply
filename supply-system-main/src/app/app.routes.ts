import { Routes } from '@angular/router';
import { LoginComponent } from './auth';
import { CreateRequisitionComponent } from './public';

export const routes: Routes = [
  { path: '', title: 'Login', component: LoginComponent },
  {
    path: 'create-requisition',
    title: 'Solicitud de Requisición',
    component: CreateRequisitionComponent
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
  },
];
