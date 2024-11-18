import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';




@Component({
  selector: 'app-formulario1',
  templateUrl: './formulario1.page.html',
  styleUrls: ['./formulario1.page.scss'],
})
export class Formulario1Page implements OnInit {

//-----Creamos formulario "form" y las variables de los campos 1 al 4 para este formulario-----//
//-----Creamos formulario "form" y las variables email y password para este formulario-----//
form = new FormGroup({
  central: new FormControl('', [Validators.required]),         // Central
  instalacion: new FormControl('', [Validators.required]),     // Instalación
  nroPT: new FormControl('', [Validators.required, Validators.min(70000),Validators.pattern('^[0-9]{5}$'),]),          // N° de PT
  responsable: new FormControl('', [Validators.required]),    // Responsable
  nroOT: new FormControl('', [Validators.required]),          // N° de OT
  fechaejecucion: new FormControl('', [Validators.required]), // Fecha de Ejecución
  nroAviso: new FormControl('', [Validators.required]),       // N° de Aviso
  fechainforme: new FormControl('', [Validators.required]),   // Fecha de Informe
});



form2: FormGroup;
  centrales = [
    { CodCentral: 'CL01', NombreCentral: 'Colbún' },
    { CodCentral: 'CL02', NombreCentral: 'San Clemente' },
    { CodCentral: 'CL03', NombreCentral: 'La Mina' },
    { CodCentral: 'CL04', NombreCentral: 'Machicura' },
    { CodCentral: 'CL05', NombreCentral: 'Chiburgo' },
    { CodCentral: 'CL06', NombreCentral: 'San Ignacio' },
  ];

  selectedCentral: string;

  constructor(private fb: FormBuilder) {
    this.form2 = this.fb.group({
      central: [''],
    });
  }



submit() {
  // Lógica para manejar el envío del formulario
  if (this.form.valid) {
    console.log('Formulario válido, datos:', this.form.value);
  } else {
    console.log('Formulario inválido');
  }
}

//---------------//

//-----inyectamos los servicios creados como firebaseSvc y utilSvc-----//
firebaseSvc = inject(FirebaseService);
utilsSvc = inject(UtilsService)
//---------------//

ngOnInit() {  }


//-----función 3.- Registro de Usuario en Firbase Auth y preparación de campos para registro en BD Firebase y Localstorage -----//
// async submit() {
// if (this.form.valid) {                                          //"si el formulario es válido"//
//   const loading = await this.utilsSvc.loading();                //"llama al spinner"//
//   await loading.present();                                      //"mientras la constante loading esté presente"//

//   this.firebaseSvc.signUp(this.form.value as User)              //llama a la función de registro de usuario, esta usa sólo email y password y los toma del form desde input "User"//
//   .then(async res => {                                          //recibe la respuesta, el usuario está creado y..."//
//     await this.firebaseSvc.updateUser(this.form.value.name)     //llama a la función updateUser para agregar el dato del parámetro name del User"//
//     let uid= res.user.uid;                                      //crea la variable uid y le asigna el uid de la respuesta de signUp (ahi se usa "user").//
//                       // carga en el uid en el form, el uid de la variable, es decir el uid de la respuesta  de signUp//
//                               // llama a la función setUserInfo con los parámetros rescatados uid para guardar firebase//
//     //console.log(res)                                         //"Borra el formulario"//           
//   })
 
//     //----Control de errores de la función---//
//     .catch(error => {
//       this.utilsSvc.presentToast({                              //Genera mensaje para el Toast Presente // 
//         message: error.message,                                 //Tipo de Toast Presente //    
//         duration: 5000,                                         //Parámetros //
//         color: 'primary',                                       //Parámetros //
//         position: 'middle',                                     //Parámetros //
//         icon: 'alert-circle',                                   //Parámetros //
//       })
//     })
//   //----al término de la función descarta la constante loading---//
//   .finally(()=>{
//     loading.dismiss();
//   })
// }
}





