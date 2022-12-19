import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [
    ScheduleComponent
  ],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    ToolbarModule,
    InputNumberModule,
    InputTextModule,
    InputTextareaModule
  ],
  exports:[
    ScheduleComponent
  ]
})
export class ScheduleModule { }
