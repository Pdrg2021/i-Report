import { Component, inject, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent  implements OnInit {

  //CREAMOS LA VARIABLE QUE RECIBE EL TEXTO PARA EL HEADER//
  @Input() title!: string;  
  @Input() backButton!: string;
  @Input() isModal!: boolean;
  @Input() isHome!: boolean;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)
  user:User=null;
       //TRAE DE BASE EL USUARIO 

  constructor(private alertController: AlertController) {}


  ngOnInit() {
    if(this.utilsSvc.getFromLocalStorage('user'))
      this.user =this.utilsSvc.getFromLocalStorage('user'); 
    }

  cerrarModal() {
    this.utilsSvc.cerrarModal();
    }

  signOut(){
    this.firebaseSvc.signOut();
    }

    async alertSingOut() {
      const alert = await this.alertController.create({
        header: 'Confirmar Cierre de Sesión',
        message: '¿Estás seguro de que deseas cerrar la sesión?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              }
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              this.firebaseSvc.signOut();
              },
            },
          ]
        });

        await alert.present();
      }
  
     
     async alertCloseModal() {
      const alert = await this.alertController.create({
        header: 'Confirmar Cierre de Formulario',
        message: 'Se perderán los cambios no guardados',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              }
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              this.cerrarModal() 
              },
            },
          ]
        });
        
        await alert.present();
      }
    
  }
