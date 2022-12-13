import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";


//guards

import {LoginGuard} from './guards/login.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
 
    {
      path:"login",
      loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule),
    },
    {
      path:"",
      component: AppLayoutComponent,
      canActivate: [ LoginGuard],
      children: [
        {path:"", redirectTo:"/dashboard", pathMatch:"full"},
        {
            path:"dashboard",
            loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
        {
          path:"services",
          loadChildren: () => import('./components/service/service.module').then((m) => m.ServiceModule),
          canActivate: [RoleGuard]
        },
        {
          path:"users",
          loadChildren: () => import('./components/user/user.module').then((m) => m.UserModule),
          canActivate: [RoleGuard]
        },
        /*{
          path:"schedule",
          loadChildren: () => import('./components/schedule/schedule.module').then((m) => m.ScheduleModule),
          canActivate: [RoleGuard]
        },
        {
          path:"appointments",
          loadChildren: () => import('./components/appointment/appointment.module').then((m) => m.AppointmentModule),
          canActivate: [RoleGuard]
        },
        {
          path:"users",
          loadChildren: () => import('./components/user/user.module').then((m) => m.UserModule),
          canActivate: [RoleGuard]
        },
        {
          path:"sales",
          loadChildren: () => import('./components/sale/sale.module').then((m) => m.SaleModule),
          canActivate: [RoleGuard]
        },
        {
          path:"products",
          loadChildren: () => import('./components/product/product.module').then((m) => m.ProductModule),
          canActivate: [RoleGuard]
        },
        {
          path:"patients",
          loadChildren: () => import('./components/patient/patient.module').then((m) => m.PatientModule),
          canActivate: [RoleGuard]
        }*/
      ]
      
    },
    { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
    {path:"**", redirectTo:"/notfound", pathMatch:"full"},
    
  ];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

/*
[
    {
        path: '', component: AppLayoutComponent,
        children: [
            { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
            { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
            { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
            { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
            { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) }
        ]
    },
    { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
    { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
    { path: 'notfound', component: NotfoundComponent },

    { path: '**', redirectTo: '/notfound' },
], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' }

*/