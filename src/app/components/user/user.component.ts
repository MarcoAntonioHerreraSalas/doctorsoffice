import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Options } from 'src/app/interfaces/default.interface';
import { UserInterface } from 'src/app/interfaces/user.interface';
import { Permission } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    providers: [MessageService]
})
export class UserComponent implements OnInit {

    userDialog: boolean = false;

    deleteUserDialog: boolean = false;

    deleteUsersDialog: boolean = false;

    users: UserInterface[] = [];

    user: UserInterface = {};

    selectedUsers: UserInterface[] = [];

    submitted: boolean = false;

    rowsPerPageOptions = [5, 10, 20];

    @ViewChild('imgAvatar') imgAvatar! : ElementRef<HTMLImageElement>;
    randomAvatar = Math.random();
    urlAvatar = "https://avatars.dicebear.com/api/adventurer/"+this.randomAvatar+".svg";

    roles: Options[] = [];
    permisos: Permission[] = [];

    constructor( private userService: UserService, private messageService: MessageService) {
        this.roles = this.userService.getRoles();
        this.permisos = this.userService.getPermissions();
     }

    ngOnInit() {
        this.userService.getUsers().subscribe((data : UserInterface[]) =>{
            
            this.users = data
            this.users.map((e) => {
                e.password = '';
                e.permissions =  e.permissions?.map((p) => {
                  var perm = this.userService.permisos.find((f) => f.value == p);
                  p =  perm?perm.label:'';
                  return p
                })
            })
        });

        
       
    }
   
    refreshAvatar(){
        this.randomAvatar = Math.random();
        this.urlAvatar = "https://avatars.dicebear.com/api/adventurer/"+this.randomAvatar+".svg";
        this.user.avatar = this.urlAvatar;
      }
    

    openNew() {
        this.user = {};
        this.submitted = false;
        this.userDialog = true;
        this.user.avatar = this.urlAvatar;


    }

    deleteSelectedUsers() {
        this.deleteUsersDialog = true;
    }

    editUser(user: UserInterface) {
        this.user = { ...user };
        this.user.permissions =  this.user.permissions?.map((p) => {
            var perm = this.userService.permisos.find((f) => f.label == p);
            p =  perm?perm.value:'';
            return p
          })
        this.userDialog = true;

    }

    deleteUser(user: UserInterface) {
        this.deleteUserDialog = true;
        this.user = { ...user };
    }

    confirmDeleteSelected() {
        this.deleteUsersDialog = false;
        const deleteUser = this.users.filter(val =>this.selectedUsers.includes(val));
        this.users = this.users.filter(val =>!this.selectedUsers.includes(val));
        this.userService.deleteUser(deleteUser).subscribe((x) => {
            if(x.deletedCount > 0){
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'users Deleted', life: 3000 });
                this.selectedUsers = [];
            }
        })
        
    }

    confirmDelete() {
        this.deleteUserDialog = false;
        this.users = this.users.filter(val => val._id !== this.user._id);
        this.userService.deleteUser([this.user]).subscribe((x) => {
            if(x.deletedCount > 0){
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'users Deleted', life: 3000 });
                this.selectedUsers = [];
            }
        })
        this.user = {};
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    saveUser() {
        this.submitted = true;
        if (this.user.name?.trim()) {
            console.log(this.user)
            if (this.user._id) {
                // @ts-ignore
                    this.userService.editUser(this.user,this.user._id).subscribe((x: any)=> {
                    this.user.permissions =  this.user.permissions?.map((p) => {
                        var perm = this.userService.permisos.find((f) => f.value == p);
                        p =  perm?perm.label:'';
                        return p
                    })
                    this.users[this.findIndexById(this.user._id?this.user._id:'')] = this.user;
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'service Updated', life: 3000 });
                    this.userDialog = false;
                    this.user = {};
                },(e) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.error, life: 3000 });
                    this.userDialog = false;
                    this.user = {};
                })
            } else {

                this.userService.addUser(this.user).subscribe((x: any)=> {
                    const userAdded:UserInterface = x.data;
                    this.user._id = userAdded._id;

                    this.user.permissions =  this.user.permissions?.map((p) => {
                        var perm = this.userService.permisos.find((f) => f.value == p);
                        p =  perm?perm.label:'';
                        return p
                    })
                   
                    // @ts-ignore
                    this.users.push(this.user);
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'service Created', life: 3000 });
                    this.users = [...this.users];
                    
                    this.userDialog = false;
                    this.user = {};
                  },(e) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.error, life: 3000 });
                    this.userDialog = false;
                    this.user = {};
                  })

                
            }

            
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i]._id === id) {
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
