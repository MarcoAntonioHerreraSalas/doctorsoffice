import { ChangeDetectorRef, Component,ElementRef,Input,OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventAddArg, FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import Swal from 'sweetalert2';
import { AppointmentService } from '../../../services/appointment.service';
import * as moment from 'moment';
import { ServiceService } from '../../../services/service.service'
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/interfaces/patient.interface';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent; // the #calendar in the template
  calendarVisible = true;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  calendarWeekends = true;
  calendarEvents: EventInput[] = [];
  servicesData = [];

  patientsData: Patient[] = [];

  constructor(private elRef: ElementRef, private changeDetectorRef:ChangeDetectorRef, 
    private appoService: AppointmentService, private serviceService: ServiceService, private patientService: PatientService) { }

  ngOnInit(): void {
    const myDate = new Date();
    this.appoService.getAppointments(myDate).subscribe((x: any) => {
      if(x){
        this.calendarOptions.events = Object.assign([],x);
      }
    })


    this.serviceService.getServices().subscribe((x: any) => {
      if(x){
        this.servicesData = x;
      }
    })

    
    this.patientService.getPatients().subscribe((x: any) => {
      if(x){
        this.patientsData = x;
      }
    })
  }



  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    eventMaxStack: 3,
    slotMinTime: "09:00:00",
    slotMaxTime: "23:00:00",
    allDaySlot: false,
    height: 650,
    locale: "es",
    businessHours: [ {
      daysOfWeek: [ 1, 2, 3, 4,5 ], 
      startTime: '9:00', // a start time (10am in this example)
      endTime: '18:00', // an end time (6pm in this example)
    },
    {
      daysOfWeek: [6], 
      startTime: '9:00', 
      endTime: '16:00', 
    },
    {
      daysOfWeek: [7], 
      startTime: '9:00', 
      endTime: '12:00', 
    }
    ],
    initialDate: Date.now(),
    themeSystem: 'bootstrap',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    plugins: this.calendarPlugins,
    weekends: this.calendarWeekends,
    dateClick: this.handleDateClick.bind(this), // bind is important!
    customButtons: {
      next: {click: this. nextCalendar.bind(this)},
      prev: {click: this.prevCalendar.bind(this)},
      today: { text: "Hoy",click: this.todayCalendar.bind(this)},
      month: {text: "Mes",click: this.otherCalendar.bind(this)},
      week: {text: "Semana",click: this.otherCalendar.bind(this)},
      day: {text: "Día",click: this.otherCalendar.bind(this)},
      
    },
    eventClick: this.handleDropEvent.bind(this), 
    events: this.calendarEvents
  };



  handleDateClick(arg:any) {
    var localLocale = moment(arg.dateStr);
    moment.locale('es');
    localLocale.locale(false);
  
    Swal.fire({
      title: '¿Deseas agregar una cita el: '+ localLocale.format('LL') + ' a las '+localLocale.format(' hh:mm A') + '?',
      text: "Las citas se guardara de acuerdo a disponibilidad!",
      showCancelButton: true,
      icon: 'question',
      confirmButtonText: 'Si',
      confirmButtonColor: '#28a745'
    }).then(async (result)  => {
      if (result.isConfirmed) {
        
        const service = this.servicesData.map((e: any) => '<option value= "'+e._id+'" >'+e.nombre+' </option>')
        const patients = this.patientsData.map((e: any) => '<option  value= "'+e._id+'" >'+e.name+' </option>')

        const { value: formValues } = await Swal.fire({
          title: 'Selecciona los datos para agendar Cita',
          html:
            `<label for="patient" class="swal2-label">Nombre</label>
            <select class="swal2-input" id="patient"> 
              <option value= "" >Seleccionar </option>
              `+patients+`
            </select><br>
            <label for="service" class="swal2-label">Servicio</label>
           
              <select class="swal2-input" id="service"> 
                <option value= "" >Seleccionar </option>
                `+service+`
              </select>
            `,
          focusConfirm: false,
          preConfirm: () => {

            
            const patient = document.getElementById('patient')  as HTMLSelectElement | null;
            const service = document.getElementById('service') as HTMLSelectElement | null;


            if(patient != null  && (service !=null && service.value !="" )){
              return [
                patient.value,
                service.value,
              ]
            }else{
              Swal.showValidationMessage(`Por favor Llevar los datos correctamente`)
            }

            return false;
            
          }
        })

      
        if (formValues) {

          const data = {
            id_patient:formValues[0],
            id_service:formValues[1],
            start: arg.date,
            allDay: arg.allDay
          }

          this.appoService.addAppointment(data).subscribe((x: any) => {
            if(x){
              this.calendarEvents.push(x);

              this.appoService.getAppointments(this.calendarComponent.getApi().getDate()).subscribe((x: any) => {
                if(x){
                  this.calendarOptions.events = Object.assign([],x);
                  this.changeDetectorRef.detectChanges();
                }
              })
            }

          },(e) =>{
            console.log(e)
          })

        } 
      } 
    })

 
  }
  
  handleDropEvent(arg:any){
    Swal.fire({
      title: 'Que te gustaría hacer?',
      icon: 'info',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Ver Detalle',
      denyButtonText: `Eliminar`,
    }).then((result) => {
      const detail = arg.event._def.extendedProps;

      if (result.isConfirmed) {
        Swal.fire({
          title: '<strong>Detalle De La Cita </strong>',
          icon: 'info',
          html:
            '<b>Nombres: </b>' +detail.patient.name + '<br>'+
            '<b>Apellidos: </b>' +detail.patient.lastname  + '<br>' +
            '<b>Servicio: </b>'+detail.service.nombre  + '<br>',
          showCloseButton: true,
          showCancelButton: false,
          focusConfirm: false,
          confirmButtonText:
            'OK!',
          confirmButtonAriaLabel: 'Thumbs up, great!',
        })
      } else if (result.isDenied) {
        const now  = moment().format('DD.MM.YYYY HH:mm');
        const eventDelete = moment(arg.event.start).format('DD.MM.YYYY HH:mm');
        
        if(now <  eventDelete){
          this.appoService.deleteAppointment(detail._id).subscribe((x: any) => {
              if(x){
                Swal.fire('Se elimino correctamente la cita.', '', 'success')
                arg.event.remove();
              }
            })
          
        }else{
          Swal.fire('La cita no se puede eliminar porque ya fue atendida.', '', 'error')
        }

      }
    })
    
  }


  //to getAllEventData
  nextCalendar(arg: any){this.getEventsByDate(arg,'next');}
  prevCalendar(arg: any){this.getEventsByDate(arg,'prev');}
  todayCalendar(arg: any){this.getEventsByDate(arg,'today');}
  otherCalendar(arg: any){this.getEventsByDate(arg,'');}

  getEventsByDate(arg: any,tipo: string = ""){
    const calendarApi = this.calendarComponent.getApi();
    switch ( tipo ) {
      case 'next':
        calendarApi.next();
          break;
      case 'prev':
        calendarApi.prev();
          break;
      case 'today':
        calendarApi.today();
          break;
      default: 
          // 
          break;
    }

    this.appoService.getAppointments(calendarApi.getDate()).subscribe((x: any) => {
      console.log(x);
    })

  }

}
