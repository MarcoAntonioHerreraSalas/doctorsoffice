import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient } from 'src/app/interfaces/patient.interface';


@Injectable({
  providedIn: 'root'
})


export class PatientService {

  defaultBack = 'http://localhost:3001/api/patient/';
  headers = { 
    'Content-Type': 'application/json'
  }


  constructor(private http: HttpClient) { }

  
  

  getPatients(): Observable<Patient[]>{
    return this.http.get<Patient[]>(this.defaultBack+'patients',{headers: this.headers})
  }

  getPatient(id: string): Observable<Patient>{
    return this.http.get(this.defaultBack+'patient/'+id,{headers: this.headers})
  }


  addPatient(data: any){
    return this.http.post(this.defaultBack + 'add-patient', JSON.stringify(data),{headers: this.headers})
  }

  editPatient(data: Patient,id: string){
    return this.http.put(this.defaultBack+'edit-patient/'+ id, JSON.stringify(data),{headers: this.headers})
  }

  // deletePatient(id: string): Observable<any>{
  //   return this.http.delete(this.defaultBack+'patient/'+id,{headers: this.headers})
  // }
  
  deletePatient(data: Patient[]): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(data)
    };
    return this.http.delete(this.defaultBack+'patient/', httpOptions)
  }

}
