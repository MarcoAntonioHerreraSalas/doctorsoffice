import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root'
})


export class UserService {

  defaultBack = 'http://localhost:3001/api/user/';
  defaultServerBack= 'http://localhost:3001/api/';
  headers = { 
    'Content-Type': 'application/json'
  }

  public roles = [
    {label: 'Administrador', value:'Administrador'},
    {label: 'Doctor', value:'Doctor'},
    {label: 'Asistente', value:'Asistente'},
    {label: 'Farmacia', value:'Farmacia'},
  ];
  public permisos = [
    {label: 'Dashboard', value:'home'},
    {label: 'Citas', value:'appointments'},
    {label: 'Servicios', value:'services'},
    {label: 'Horario', value:'schedule'},
    {label: 'Usuarios', value:'users'},
    {label: 'Pacientes', value:'patients'},
    {label: 'Ventas', value:'sales'},
    {label: 'Productos', value:'products'},
    {label: 'Doctores', value:'doctors'},
  ];

  constructor(private http: HttpClient) { }

  
  

  getUsers(): Observable<UserInterface[]>{
    return this.http.get<UserInterface[]>(this.defaultBack+'users',{headers: this.headers})
  }

  getUser(id: string): Observable<any>{
    return this.http.get(this.defaultBack+'user/'+id,{headers: this.headers})
  }

  getRoles(){
    return this.roles;
  }

  getPermissions(){
    return this.permisos;
  }

  addUser(data: any){
    return this.http.post(this.defaultServerBack + 'auth/register', JSON.stringify(data),{headers: this.headers})
  }

  editUser(data: UserInterface,id: string){

    return this.http.put(this.defaultServerBack+'auth/edit-register/'+ id, JSON.stringify(data),{headers: this.headers})
  }

  deleteUser(data: UserInterface[]): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data)
  };
    return this.http.delete(this.defaultBack+'user/', httpOptions)
  }
}
