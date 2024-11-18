import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CRUDInformesComponent } from 'src/app/shared/components/crud-informes/crud-informes.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)

  constructor() { }

  ngOnInit() {
  }

  // //----- Función para cerrar sesión ------//

  // singOut(){
  //   this.firebaseSvc.signOut();
  // }

  
  //----- Función para agregar o actualizar informe ------//
  agregarInforme(){
    this.utilsSvc.abriModal({
      component: CRUDInformesComponent
      })
    }

    cerrarModal(){
      this.utilsSvc.cerrarModal();        
    }
}
