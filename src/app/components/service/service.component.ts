import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ServiceService } from 'src/app/services/service.service';
import { Service } from 'src/app/interfaces/service.interface';

@Component({
    templateUrl: './service.component.html',
    providers: [MessageService]
})
export class ServiceComponent implements OnInit {

    serviceDialog: boolean = false;

    deleteServiceDialog: boolean = false;

    deleteServicesDialog: boolean = false;

    services: Service[] = [];

    service: Service = {};

    selectedServices: Service[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor( private serviceService: ServiceService, private messageService: MessageService) { }

    ngOnInit() {
        this.serviceService.getServices().subscribe((data : Service[]) =>  this.services = data);
        this.cols = [
            { field: 'service', header: 'service' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];
    }

    openNew() {
        this.service = {};
        this.submitted = false;
        this.serviceDialog = true;
    }

    deleteSelectedServices() {
        this.deleteServicesDialog = true;
    }

    editService(service: Service) {
        this.service = { ...service };
        this.serviceDialog = true;

    }

    deleteService(service: Service) {
        this.deleteServiceDialog = true;
        this.service = { ...service };
    }

    confirmDeleteSelected() {
        this.deleteServicesDialog = false;
        const deletedservices = this.services.filter(val =>this.selectedServices.includes(val));
        this.services = this.services.filter(val =>!this.selectedServices.includes(val));
        this.serviceService.deleteService(deletedservices).subscribe((x) => {
            if(x.deletedCount > 0){
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'services Deleted', life: 3000 });
                this.selectedServices = [];
            }
        })
        
    }

    confirmDelete() {
        this.deleteServiceDialog = false;
        this.services = this.services.filter(val => val._id !== this.service._id);
        this.serviceService.deleteService([this.service]).subscribe((x) => {
            if(x.deletedCount > 0){
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'services Deleted', life: 3000 });
                this.selectedServices = [];
            }
        })
        this.service = {};
    }

    hideDialog() {
        this.serviceDialog = false;
        this.submitted = false;
    }

    saveService() {
        this.submitted = true;
        if (this.service.nombre?.trim()) {
            if (this.service._id) {
                // @ts-ignore
                this.services[this.findIndexById(this.service._id)] = this.service;
                this.serviceService.editService(this.service,this.service._id).subscribe((x: any)=> {
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'service Updated', life: 3000 });
                    this.serviceDialog = false;
                    this.service = {};
                },(e) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.error, life: 3000 });
                    this.serviceDialog = false;
                    this.service = {};
                })
            } else {

                this.serviceService.addService(this.service).subscribe((x: any)=> {
                    this.service._id = x._id;

                    // @ts-ignore
                    this.services.push(this.service);
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'service Created', life: 3000 });
                    this.services = [...this.services];
                    this.serviceDialog = false;
                    this.service = {};
                  },(e) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.error, life: 3000 });
                    this.serviceDialog = false;
                    this.service = {};
                  })

                
            }

            
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.services.length; i++) {
            if (this.services[i]._id === id) {
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
