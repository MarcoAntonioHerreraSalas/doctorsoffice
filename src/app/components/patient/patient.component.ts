import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Patient } from 'src/app/interfaces/patient.interface';
import { PatientService } from 'src/app/services/patient.service';

@Component({
    templateUrl: './patient.component.html',
    providers: [MessageService]
})
export class PatientComponent implements OnInit {

    patientDialog: boolean = false;

    deletePatientDialog: boolean = false;

    deletePatientsDialog: boolean = false;

    patients: Patient[] = [];

    patient: Patient = {};

    selectedPatients: Patient[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor( private patientService: PatientService, private messageService: MessageService) { }

    ngOnInit() {
        this.patientService.getPatients().subscribe((data : Patient[]) =>  this.patients = data);
        this.cols = [
            { field: 'service', header: 'service' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];
    }

    openNew() {
        this.patient = {};
        this.submitted = false;
        this.patientDialog = true;
    }

    deleteSelectedPatients() {
        this.deletePatientDialog = true;
    }

    editPatient(service: Patient) {
        this.patient = { ...service };
        this.patientDialog = true;

    }

    deletePatient(service: Patient) {
        this.deletePatientDialog = true;
        this.patient = { ...service };
    }

    confirmDeleteSelected() {
        this.deletePatientDialog = false;
        const deletedPatients = this.patients.filter(val =>this.selectedPatients.includes(val));
        this.patients = this.patients.filter(val =>!this.selectedPatients.includes(val));
        this.patientService.deletePatient(deletedPatients).subscribe((x) => {
            if(x.deletedCount > 0){
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pacientes ELiminados', life: 3000 });
                this.selectedPatients = [];
            }
        })
        
    }

    confirmDelete() {
        this.deletePatientDialog = false;
        this.patients = this.patients.filter(val => val._id !== this.patient._id);
        this.patientService.deletePatient([this.patient]).subscribe((x) => {
            if(x.deletedCount > 0){
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Paciente Eliminado', life: 3000 });
                this.selectedPatients = [];
            }
        })
        this.patient = {};
    }

    hideDialog() {
        this.patientDialog = false;
        this.submitted = false;
    }

    saveService() {
        this.submitted = true;
        if (this.patient.name?.trim()) {
            if (this.patient._id) {
                // @ts-ignore
                this.patients[this.findIndexById(this.patient._id)] = this.patient;
                this.patientService.editPatient(this.patient,this.patient._id).subscribe((x: any)=> {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Paciente Actualizado', life: 3000 });
                    this.patientDialog = false;
                    this.patient = {};
                },(e) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.error, life: 3000 });
                    this.patientDialog = false;
                    this.patient = {};
                })
            } else {

                this.patientService.addPatient(this.patient).subscribe((x: any)=> {
                    this.patient._id = x._id;

                    // @ts-ignore
                    this.patients.push(this.patient);
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Paciente Creado', life: 3000 });
                    this.patients = [...this.patients];
                    this.patientDialog = false;
                    this.patient = {};
                  },(e) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.error, life: 3000 });
                    this.patientDialog = false;
                    this.patient = {};
                  })

                
            }

            
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.patients.length; i++) {
            if (this.patients[i]._id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

  

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
