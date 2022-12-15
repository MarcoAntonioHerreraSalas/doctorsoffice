import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PatientComponent } from './patient.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PatientComponent }
	])],
	exports: [RouterModule]
})
export class PatientRoutingModule { }
