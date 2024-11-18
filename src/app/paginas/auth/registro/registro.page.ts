import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  

//------------ FORMULARIO PARA REGISTRO DE USUARIO ------------//
    form_registro = new FormGroup({
      uid: new FormControl(''),
      firstname: new FormControl('', [Validators.required, Validators.minLength(4)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      }) 

      displayName: string = ''; // Variable para almacenar la concatenación

      constructor() {
        this.initializeDisplayName();
      }
    
      initializeDisplayName() {
        // Escuchar cambios en firstname y lastname
        this.form_registro.valueChanges.subscribe((formValues) => {
          const { firstname, lastname } = formValues;
          this.displayName = `${firstname || ''} ${lastname || ''}`.trim();
        });
      }
    
//------------ INYECCIÓN DE SERVICIOS ------------//
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)

 //------------ EJECUCIÓN AL INICIO ------------//
 ngOnInit() {  }

  
 //------------ FUNCIÓN PARA SUSCRIBIR EL FORMULARIO ------------//
  async submit() {
    if (this.form_registro.valid) {                                 //  FORMULARIO VÁLIDO?

      const loading = await this.utilsSvc.loading();                // LLAMA AL SPINNER
      await loading.present();                                           


      this.form_registro.valueChanges.subscribe((formValues) => {   //------------ CODIGO PARA GENERAR EL NOMBRE APELLIDO COMO DISPLAYNAME 
        const { firstname, lastname } = formValues;
        this.displayName = `${firstname || ''} ${lastname || ''}`.trim();
      });
      
      
      this.firebaseSvc.signUp(this.form_registro.value as User)     // PROMESA DE AUTENTICACIÓN CON LOS DATOS DE FORM_LOGIN COMO MODELO USER
      .then(async res => {                                          
        await this.firebaseSvc.updateUser(this.displayName)         // ACTUALIZA LA PROPIEDAD DISPLAYNAME DEL USER EN AUTH
            
        let uid= res.user.uid;                                      // CREA UID Y LE ASIGNA EL UID DEL USUARIO DE LA RESPUESTA
        this.form_registro.controls.uid.setValue(uid);              // METE EL UID QUE FUE DEVUELTO POR AUTH EN EL FORMULARIO DE REGISTRO
        this.setUserInfo(uid);                                      // LLAMA A setUserInfo CON EL UID DE FIREBASE//           
      })
     
      .catch(error => {                                             // CONTROL DE ERRORES  
        this.utilsSvc.presentToast({                                // MENSAJE SEGÚN CÓDIGO DE ERROR
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



 //------------ FUNCIÓN PARA REGISTRAR USAURIO EN FIREBASE DATABASE Y LOCALSTORAGE ------------//
 
    async setUserInfo(uid: string) {
      if (this.form_registro.valid) {                                 //  FORMULARIO VÁLIDO?
  
        const loading = await this.utilsSvc.loading();                // LLAMA AL SPINNER
        await loading.present();                                           
  
  

        let path = `Usuarios/${uid}`;                                 // DEFINE RUTA PARA ALMACENAR LA COLECCIÓN
        
        delete this.form_registro.value.password;                     // ELIMINA EL CAMPO PASSWORD DEL FORMULARIO

        this.firebaseSvc.setDocument(path, this.form_registro.value)  // CREA LA COLECCIÓN EN LA RUTA  (MANTIENE SETDOCUMENT MANTIENE ID NO ASINGA NUEVO)
          .then( res => {                                          
            this.utilsSvc.saveInLocalStorage('user', this.form_registro.value); // GUARDA LO MISMO EN LOCAL STORAGE 
            this.utilsSvc.routerLink('/main/home');
            this.form_registro.reset();
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
