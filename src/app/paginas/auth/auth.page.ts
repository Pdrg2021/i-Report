import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  })

export class AuthPage implements OnInit {

//------------ FORMULARIO PARA LOGIN ------------//
  form_login = new FormGroup ({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  }) 

  
//------------ INYECCIÓN DE SERVICIOS ------------//
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)

 //------------ EJECUCIÓN AL INICIO ------------//
  ngOnInit() {  }


 //------------ FUNCIÓN PARA SUSCRIBIR EL FORMULARIO ------------//
  async submit() {
    if (this.form_login.valid) {                                    //  FORMULARIO VÁLIDO?

      const loading = await this.utilsSvc.loading();                // LLAMA AL SPINNER
      await loading.present();                                      

      this.firebaseSvc.signIn(this.form_login.value as User)        // PROMESA DE AUTENTICACIÓN CON LOS DATOS DE FORM_LOGIN COMO MODELO USER
        .then(async res => {
          await this.getUserInfo(res.user.uid);                     // CONSUME LA PROMESA,  SOLICITA LA DEVOLUCIÓN DE LOS DATOS DEL USUARIO + UID 
        })                 
          .catch(error => {                                         // CONTROL DE ERRORES  
            this.utilsSvc.presentToast({                            // MENSAJE SEGÚN CÓDIGO DE ERROR
              message: error.message,                               
              duration: 5000,                                         
              color: 'primary',                                       
              position: 'middle',                                     
              icon: 'alert-circle',                                   
            })
          })
        
          .finally(()=>{
            loading.dismiss();
        })
      }
    }


//------------ FUNCIÓN PARA RECIBIR LA INFORMACIÓN DEL USUARIO ------------//
  async getUserInfo(uid: string) {
    if (this.form_login.valid) {                                    //  FORMULARIO VÁLIDO?

      const loading = await this.utilsSvc.loading();                // LLAMA AL SPINNER
      await loading.present();                                      

      let path = `Usuarios/${uid}`;                                 // DEFINE RUTA PARA ALMACENAR LA COLECCIÓN

        this.firebaseSvc.getDocument(path)                          // OBTIENE LOS DATOS DEL USUARIO
        
        .then((user: User) => {   

          this.utilsSvc.saveInLocalStorage('user', user);           // GUARDA LOS DATOS DEL USUARIO EN LOCALSTORAGE
          this.utilsSvc.routerLink('/main/home');                   // REDIRECCIONA A HOME
          this.form_login.reset();                                  // BORRA EL FORMULARIO DE LOGIN

          this.utilsSvc.presentToast({                              // TOAST DE BIENVENIDA AL USUARIO
            message: `Bienvenid@ ${user.firstname}`,         
            duration: 5000,
            color: 'primary',
            position: 'middle',
            icon: 'person-circle-outline',
            })
        })        
          .catch(error => {                                         // CONTROL DE ERRORES  
            this.utilsSvc.presentToast({                            // MENSAJE SEGÚN CÓDIGO DE ERROR
              message: error.message,                                   
              duration: 5000,                                         
              color: 'primary',                                       
              position: 'middle',                                     
              icon: 'alert-circle',                                   
            })        
          })

          .finally(()=>{
            loading.dismiss();
          })
    }
  }  
}