import { Component, inject, Input, OnInit } from '@angular/core';
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

  constructor() { }


  ngOnInit() {}


  cerrarModal() {
    this.utilsSvc.cerrarModal();
    }

  signOut(){
    this.firebaseSvc.signOut();
    }

    public alertSingOut = [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          // console.log('Alert canceled');
          },
      },
      {
        text: 'OK',
        role: 'confirm',
        handler: () => {
          this.firebaseSvc.signOut();
          // console.log('Alert confirmed');
          },
        },
      ];
  
    setResult(ev) {
      // console.log(`Dismissed with role: ${ev.detail.role}`);
      }

      
    public alertCloseModal = [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          // console.log('Alert canceled');
          },
      },
      {
        text: 'OK',
        role: 'confirm',
        handler: () => {
          this.utilsSvc.cerrarModal();
          // console.log('Alert confirmed');
          },
        },
      ];
  
    setResult2(ev) {
      // console.log(`Dismissed with role: ${ev.detail.role}`);
      }
  
  }
