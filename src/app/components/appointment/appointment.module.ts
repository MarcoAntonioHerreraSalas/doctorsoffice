import { FullCalendarModule } from '@fullcalendar/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsComponent } from './appointments/appointments.component';
import {  RouterModule, Routes } from '@angular/router';
//import { SelectAppointmentComponent } from './select-appointment/select-appointment.component';



const routes: Routes = [
  {
    path:"",
    component: AppointmentsComponent
  },
  // {
  //   path:"select-appointment",
  //   component: SelectAppointmentComponent
  // },
]

@NgModule({
  declarations: [
    AppointmentsComponent,
    // SelectAppointmentComponent
  ],
  imports: [
    FullCalendarModule,
    CommonModule,
    RouterModule.forChild(routes),
    
  ]
})
export class AppointmentModule { }
