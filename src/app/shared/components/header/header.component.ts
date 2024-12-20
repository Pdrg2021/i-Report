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
  alertController = inject(AlertController);

       //TRAE DE BASE EL USUARIO 

  constructor() {}


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
        header: 'Cierre de Sesión',
        message: '¿Confirma Cierre de Sesión?',
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
        header: 'Cierre de Formulario',
        message: '¿Confirma Cierre de Formulario?',
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
