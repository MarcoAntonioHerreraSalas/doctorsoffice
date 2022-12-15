import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from 'src/app/interfaces/doctor.interface';


@Injectable({
  providedIn: 'root'
})


export class DoctorService {

  defaultBack = 'http://localhost:3001/api/doctor/';
  headers = { 
    'Content-Type': 'application/json'
  }


  constructor(private http: HttpClient) { }

  
  

  getDoctors(): Observable<Doctor[]>{
    return this.http.get<Doctor[]>(this.defaultBack+'doctors',{headers: this.headers})
  }

  getDoctor(id: string): Observable<Doctor>{
    return this.http.get(this.defaultBack+'doctor/'+id,{headers: this.headers})
  }


  addDoctor(data: any){
    return this.http.post(this.defaultBack + 'add-doctor', JSON.stringify(data),{headers: this.headers})
  }

  editDoctor(data: Doctor,id: string){
    return this.http.put(this.defaultBack+'edit-doctor/'+ id, JSON.stringify(data),{headers: this.headers})
  }

  
  deleteDoctor(data: Doctor[]): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data)
    };
    return this.http.delete(this.defaultBack+'doctor/', httpOptions)
  }

}
