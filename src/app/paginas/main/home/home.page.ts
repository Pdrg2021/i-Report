import { Component, inject, OnInit } from '@angular/core';
import { Document } from 'src/app/models/document.model';
import { User } from 'src/app/models/user.model';
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

  document:Document[] =[];

  constructor() { }

  ngOnInit() {     
    this.getDocuments();
   }

   //------------ FUNCIÓN PARA OBTENER LOS DATOS DEL USUARIO -------------//
  user():User{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getDocuments();
  }   

   //------------ FUNCIÓN PARA OBTENER LISTADO DE DOCUMENTOS -------------//
   getDocuments(){
    let path = `Usuarios/${this.user().uid}/Documentos`;
    // console.log(path); 

    let sub =this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res:any) => {
        // console.log(res);
        this.document=res;
        sub.unsubscribe();
      }
    })
  }


  
  //------------ FUNCION PARA AGREGAR O ACTUALIZAR DOCUMENTOS ------------ 
  agregar_o_actualizar_documento(document?:Document){
    this.utilsSvc.abriModal({
      component: CRUDInformesComponent,
      cssClass: 'add-update-modal',
      componentProps: {document},  //-- PERMITE QUE LA MODAL RECIBA EL DOCUMENTO PARA EDITARLO
      })
      console.log(document) 
    }
  
    //------------ FUNICON CERRAR MODAL ------------ (NO USADA)
    // cerrarModal(){
    //   this.utilsSvc.cerrarModal().then(()=>{
    //     this.getDocuments();
    //     console.log('Función getDocument')
    //   }); 
    //   console.log('Función CerrarModal') 
    // }
}
 