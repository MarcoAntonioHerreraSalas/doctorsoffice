import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Doctor } from 'src/app/interfaces/doctor.interface';
import { DoctorService } from 'src/app/services/doctor.service';

@Component({
    templateUrl: './doctor.component.html',
    providers: [MessageService]
})
export class DoctorComponent implements OnInit {

    doctorDialog: boolean = false;

    deleteDoctorDialog: boolean = false;

    deleteDoctorsDialog: boolean = false;

    doctors: Doctor[] = [];

    doctor: Doctor = {};

    selectedDoctors: Doctor[] = [];

    submitted: boolean = false;

    rowsPerPageOptions = [5, 10, 20];

    constructor( private doctorService: DoctorService, private messageService: MessageService) { }

    ngOnInit() {
        this.doctorService.getDoctors().subscribe((data : Doctor[]) =>  this.doctors = data);
        
    }

    openNew() {
        this.doctor = {};
        this.submitted = false;
        this.doctorDialog = true;
    }

    deleteSelectedDoctors() {
        this.deleteDoctorDialog = true;
    }

    editDoctor(service: Doctor) {
        this.doctor = { ...service };
        this.doctorDialog = true;

    }

    deleteDoctor(service: Doctor) {
        this.deleteDoctorDialog = true;
        this.doctor = { ...service };
    }

    confirmDeleteSelected() {
        this.deleteDoctorDialog = false;
        const deletedDoctors = this.doctors.filter(val =>this.selectedDoctors.includes(val));
        this.doctors = this.doctors.filter(val =>!this.selectedDoctors.includes(val));
        this.doctorService.deleteDoctor(deletedDoctors).subscribe((x) => {
            if(x.deletedCount > 0){
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Doctores ELiminados', life: 3000 });
                this.selectedDoctors = [];
            }
        })
        
    }

    confirmDelete() {
        this.deleteDoctorDialog = false;
        this.doctors = this.doctors.filter(val => val._id !== this.doctor._id);
        this.doctorService.deleteDoctor([this.doctor]).subscribe((x) => {
            if(x.deletedCount > 0){
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Doctor Eliminado', life: 3000 });
                this.selectedDoctors = [];
            }
        })
        this.doctor = {};
    }

    hideDialog() {
        this.doctorDialog = false;
        this.submitted = false;
    }

    saveService() {
        this.submitted = true;
        if (this.doctor.name?.trim()) {
            if (this.doctor._id) {
                // @ts-ignore
                this.doctors[this.findIndexById(this.doctor._id)] = this.doctor;
                this.doctorService.editDoctor(this.doctor,this.doctor._id).subscribe((x: any)=> {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Doctor Actualizado', life: 3000 });
                    this.doctorDialog = false;
                    this.doctor = {};
                },(e) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.error, life: 3000 });
                    this.doctorDialog = false;
                    this.doctor = {};
                })
            } else {

                this.doctorService.addDoctor(this.doctor).subscribe((x: any)=> {
                    this.doctor._id = x._id;

                    // @ts-ignore
                    this.doctors.push(this.doctor);
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Doctor Creado', life: 3000 });
                    this.doctors = [...this.doctors];
                    this.doctorDialog = false;
                    this.doctor = {};
                  },(e) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.error, life: 3000 });
                    this.doctorDialog = false;
                    this.doctor = {};
                  })

                
            }

            
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.doctors.length; i++) {
            if (this.doctors[i]._id === id) {
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
