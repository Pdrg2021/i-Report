import { Component, inject, OnInit } from '@angular/core';
import { clearAppScopedEarlyEventContract } from '@angular/core/primitives/event-dispatch';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';

import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-crud-informes',
  templateUrl: './crud-informes.component.html',
  styleUrls: ['./crud-informes.component.scss'],
})
export class CRUDInformesComponent  implements OnInit {

form = new FormGroup({
  instalacion: new FormControl('', [Validators.required]),          // INSTALACIÓN
  sistema: new FormControl('', [Validators.required]),              // SISTEMA PRINCIPAL DE LA INSTALACIÓN
  nroPT: new FormControl('', [Validators.required, Validators.min(70000),Validators.pattern('^[0-9]{5}$'),]),          // N° de PT
  responsable: new FormControl('', [Validators.required]),          // RESPONSABLE DE LA ACTIVIDAD
  nroOT: new FormControl('', [Validators.required]),                // N° DE ORDEN DE TRABAJO
  fechaejecucion: new FormControl('', [Validators.required]),       // FECHA DE EJECUCIÓN
  nroAviso: new FormControl('', [Validators.required]),             // N° DE AVISO
  fechainforme: new FormControl('', [Validators.required]),         // FECHA DE INFORME
  image: new FormControl('', [Validators.required]),                //REGISTRO DE IMAGEN
  // id: new FormControl('', [Validators.required]),   // Fecha de Informe
});



form_Instalacion: FormGroup;
  instalaciones = [
    { CodInstalacion: 'CL01', nombreInstalacion: 'Colbún' },
    { CodInstalacion: 'CL02', nombreInstalacion: 'San Clemente' },
    { CodInstalacion: 'CL03', nombreInstalacion: 'La Mina' },
    { CodInstalacion: 'CL04', nombreInstalacion: 'Machicura' },
    { CodInstalacion: 'CL05', nombreInstalacion: 'Chiburgo' },
    { CodInstalacion: 'CL06', nombreInstalacion: 'San Ignacio' },
    { CodInstalacion: 'CL01', nombreInstalacion: 'Complejo Colbún' },
    { CodInstalacion: 'CL01', nombreInstalacion: 'Riego' },
  ];

  form_Sistema: FormGroup;
  sistemas = [
    { codSistema: '01', nombreSistema: 'OOHH-Captación-Addución' },
    { codSistema: '0201', nombreSistema: 'Turbina U1' },
    { codSistema: '0202', nombreSistema: 'Turbina U2' },
    { codSistema: '0301', nombreSistema: 'Generador U1' },
    { codSistema: '0302', nombreSistema: 'Generador U2' },
    { codSistema: '0401', nombreSistema: 'Transformador U1' },
    { codSistema: '0402', nombreSistema: 'Transformador U2' },
    { codSistema: '040x', nombreSistema: 'Transformador' },
    { codSistema: '0501', nombreSistema: 'Refrigeración U1' },
    { codSistema: '0502', nombreSistema: 'Refrigeración U2' },
    { codSistema: '050x', nombreSistema: 'Refrigeración' },
    { codSistema: '0601-0602', nombreSistema: 'Drenaje y vaciado' },
    { codSistema: '070x', nombreSistema: 'Det. y Combate Incendios' },
    { codSistema: '080x', nombreSistema: 'Sistemas de Izaje' },
    { codSistema: '090x', nombreSistema: 'Control y Telecontrol' },
    { codSistema: '1101', nombreSistema: 'SSAA CA' },
    { codSistema: '1102', nombreSistema: 'SSAA CC' },
  ];

  selectedCentral: string;

  constructor(private fb: FormBuilder) {
    this.form_Instalacion = this.fb.group({
      instalaciones: [''],
    });
  }

firebaseSvc = inject(FirebaseService);
utilsSvc = inject(UtilsService)

user = {} as User;
//---------------//

ngOnInit() { 
  this.user =this.utilsSvc.getFromLocalStorage('user');
  console.log(this.user)
 }

 updateFechaEjecucion(event: any) {
  const fecha = event.detail.value; // Obtiene la fecha seleccionada
  this.form.controls.fechaejecucion.setValue(fecha); // Actualiza el campo en el formulario
}

updateFechaInforme(event: any) {
  const fecha = event.detail.value; // Obtiene la fecha seleccionada
  this.form.controls.fechainforme.setValue(fecha); // Actualiza el campo en el formulario
}


//-----Función: Tomar o seleccinar imagen-----//
async tomarImagen() {
  const result = await this.utilsSvc.takePicture('Agregar una Imagen');
  if (result && result.dataUrl) {
    this.form.controls.image.setValue(result.dataUrl);
    } else {
      this.utilsSvc.presentToast({
        message: 'No se ha seleccionado ninguna imagen.',
        duration: 5000,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline',
         });
      }
    }


//-----FUNCION: CARGAR DOCUMENTO ----//
  async submit() {
    if (this.form.valid) {
      let path = `Usuarios/${this.user.uid}/Informe1`;
      // console.log(path);

      const loading = await this.utilsSvc.loading();                //"llama al spinner"//
      await loading.present();                                      //"mientras la constante loading esté presente"//

      //-----FUNCION: subir y obtener la url----//
      let dataUrl = this.form.value.image;
      // console.log(dataUrl)
      let imagePath = `${this.user.uid}/${Date.now()}`;
      // console.log(imagePath)
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      // console.log(imageUrl)

      this.form.controls.image.setValue(imageUrl);
      console.log("paso2")

      // delete this.form.value.id;
      this.firebaseSvc.addDocument(path, this.form.value).then(async res=>{
        
       
        this.utilsSvc.cerrarModal({success: true})

        this.utilsSvc.presentToast({
          message: "Creado Exitosamente",
          duration: 5000,
          color: 'primary',
          position: 'middle',
          icon: 'checkmark-cirlce-outline',
        })

          //----Control de errores de la función---//
      }).catch(error => {
            console.log(error);
            
            this.utilsSvc.presentToast({                              //Genera mensaje para el Toast Presente // 
              message: error.message,                                 //Tipo de Toast Presente //    
              duration: 5000,                                         //Parámetros //
              color: 'success',                                       //Parámetros //
              position: 'middle',                                     //Parámetros //
              icon: 'alert-circle-outline',
            })
      
      }).finally(()=>{
            loading.dismiss();
            })
    }
  }


  formconsolelog(){
    console.log(this.form.value);
  }
}


