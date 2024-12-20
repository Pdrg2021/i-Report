import { Component, inject, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
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
  utilsSvc = inject(UtilsService);


  document:Document[] =[];
  modtitulo:string = "";

  constructor(private alertController: AlertController) {}


  ngOnInit() {  
    this.getDocuments();   
   }

   //------------ FUNCIÓN PARA OBTENER LOS DATOS DEL USUARIO  ------------ 
  user():User{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getDocuments();
  }   

   //------------ FUNCIÓN PARA OBTENER LISTADO DE DOCUMENTOS ------------ 
   getDocuments(){
    let path = `Documentos`;   //Intento de generar una carpeta común
    let sub =this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res:any) => {
        // console.log('getDocuments:', res);
        this.document=res;
        sub.unsubscribe();
      }
    })
  }


  
  //------------ FUNCION PARA AGREGAR O ACTUALIZAR DOCUMENTOS ------------ 
 async agregar_o_actualizar_Documento(document?:Document){
    let success = await this.utilsSvc.abriModal({
      component: CRUDInformesComponent,
      cssClass: 'add-update-modal',
      componentProps: {
        document,
        readonly: false, // Modo visualizar activado.
        edit:true,     // Modo editar activado.
        modtitulo:"{document ? 'Actualizar datos de Reporte' : 'Generar nuevo Reporte' }",
        // valid:false,    // Modo validado activado.  //-- PERMITE QUE LA MODAL RECIBA EL DOCUMENTO PARA EDITARLO
      }
      })

      if(success)
        this.getDocuments();     // RECARGA LA LISTA DE DOCUMENTOS
        // console.log(document) 
    }
  

  //------------  FUNCION: BORRAR DOCUMENTO Y STORAGE ------------ 
  async borrar_Documento(document: Document) {
    // console.log('FUNCION BORRAR DOCUMENTO')

      //let path = `Usuarios/${this.user().uid}/Documentos/${document.id}`;   // DIRECCIÓN PARA ALMACENAMIENTO EN DB
      let path = `Documentos/${document.id}`;   // DIRECCIÓN PARA ALMACENAMIENTO EN DB
      let imagePath = await this.firebaseSvc.getFilePath(document.image);   // DIRECCIÓN PARA ALMACENAMIENTO EN STORAGE


        const loading = await this.utilsSvc.loading();                      // LLAMA AL SPINNER
        await loading.present();              
  

      await this.firebaseSvc.deleteImage(imagePath);                        // BORRADO DE LA IMAGEN EN STORAGE

      this.firebaseSvc.deleteDocument(path)                                 // BORRADO DE LA IMAGEN EN DB
      .then(async res=>{
          this.utilsSvc.presentToast({                                      // TOAST DE CREACIÓN EXITOSA DE ELEMENTO
          message: "Eliminado Exitosamente",
          duration: 5000,
          color: 'success',
          position: 'middle',
          icon:  'checkmark-circle-outline',
        })

      }).catch(error => {                                                   // CONTROL DE ERRORES 
            this.utilsSvc.presentToast({                                    // MENSAJE SEGÚN CÓDIGO DE ERROR 
              message: error.message,                                     
              duration: 5000,                                         
              color: 'primary',                                       
              position: 'middle',                                     
              icon: 'alert-circle-outline',
            })
      
      }).finally(()=>{
            loading.dismiss();
            this.getDocuments();     // RECARGA LA LISTA DE DOCUMENTOS
            })
    }


    async visualizarDocument(document: Document) {
      const success = await this.utilsSvc.abriModal({
        component: CRUDInformesComponent,
        cssClass: 'view-modal',
        componentProps: {
          document,
          readonly: true, // Modo visualizar activado.
          edit:false,     // Modo editar activado.
          // valid:false,    // Modo validado activado.
        },
      });
      //  console.log(document)
    
      if (success) {
        this.getDocuments();
        // console.log('Modal cerrado');
      }
    }

    async confirmarBorrado(item: any) {
      const alert = await this.alertController.create({
        header: 'Solicitud de Borrado',
        message: '¿Está seguro de borrar el documento?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              // console.log('Borrado cancelado');
            }
          },
          {
            text: 'Borrar',
            role: 'destructive',
            handler: () => {
              this.borrar_Documento(item);
            }
          }
        ]
      });
    
      await alert.present();
    }
    
   
    }
 
