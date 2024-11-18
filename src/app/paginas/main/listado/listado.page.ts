import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
})
export class ListadoPage implements OnInit {

     //-----inyectamos los servicios creados como firebaseSvc y utilSvc-----//
     firebaseSvc = inject(FirebaseService);
     utilsSvc = inject(UtilsService)
      //---------------//

  constructor() { }

  ngOnInit() {
  }

}
