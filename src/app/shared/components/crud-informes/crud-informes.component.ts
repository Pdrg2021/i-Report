import { Component, inject, Input, input, OnInit } from '@angular/core';
import { clearAppScopedEarlyEventContract } from '@angular/core/primitives/event-dispatch';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { Document } from 'src/app/models/document.model';
import { User } from 'src/app/models/user.model';
import { HomePage } from 'src/app/paginas/main/home/home.page';
import { FirebaseService } from 'src/app/services/firebase.service';

import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-crud-informes',
  templateUrl: './crud-informes.component.html',
  styleUrls: ['./crud-informes.component.scss'],
})
export class CRUDInformesComponent  implements OnInit {

  @Input() document: Document;
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user = {} as User;
  resp:User =this.utilsSvc.getFromLocalStorage('user');     //TRAE DE BASE EL USUARIO RESPONSABLE Y NO ES NECESARIO COMPLETARLO


// ------------ DEFINICIÓN DE LOS CAMPOS DE FORMULARIO INFORME ------------  
  form_Informe = new FormGroup({
    instalacion:    new FormControl(''              , [Validators.required]),               // INSTALACIÓN
    sistema:        new FormControl(''              , [Validators.required]),               // SISTEMA PRINCIPAL DE LA INSTALACIÓN
    nroPT:          new FormControl(null            , [Validators.required, 
                                                      Validators.min(70000), 
                                                      Validators.pattern('^[0-9]{5}$'),
                                                                          ]),               // N° de PT
    responsable:    new FormControl(this.resp.email , [Validators.required]),               // RESPONSABLE DE LA ACTIVIDAD
    nroOT:          new FormControl(null            , [Validators.required]),               // N° DE ORDEN DE TRABAJO
    fechaejecucion: new FormControl(null            , [Validators.required]),               // FECHA DE EJECUCIÓN
    nroAviso:       new FormControl(null            ,                       ),              // N° DE AVISO
    fechainforme:   new FormControl(null            , [Validators.required]),               // FECHA DE INFORME
    image:          new FormControl(''              , [Validators.required]),               //REGISTRO DE IMAGEN
    id:             new FormControl(''              ,                       ),             
    desfase:        new FormControl(null            ,                       ),
    textoContexto:  new FormControl(null            ,                       ), 
    textoRealizado: new FormControl(null            ,                       ), 

    textoObservaciones: new FormControl('Sin Observaciones'),
    checkbox1: new FormControl(false),
    checkbox2: new FormControl(false),
    checkbox3: new FormControl(false),
    checkbox4: new FormControl(false),
    checkbox5: new FormControl(false),
    checkbox6: new FormControl(false),
    checkbox7: new FormControl(false),


  });

//------------ FECHA DE EJECUCIÓN AL FORMULARIO ------------
  seleccionarFechaEjecucion(event: any) {
    this.form_Informe.controls.fechaejecucion.setValue(event.detail.value);
    console.log(this.form_Informe.controls.fechaejecucion.value)
    this.calculodesfase(); 
  }

  //------------ FECHA DE INFORME AL FORMULARIO ------------
  seleccionarFechaInforme(event: any) {
    this.form_Informe.controls.fechainforme.setValue(event.detail.value); 
    console.log(this.form_Informe.controls.fechainforme.value)
    this.calculodesfase(); 
  }

  //------------ CALCULO DEL DESFASE DE TIEMPO (PARAMETRO DE CALIDAD) ------------
  calculodesfase(){
    const fechaEjecucion = this.form_Informe.controls.fechaejecucion.value;
    console.log(fechaEjecucion)

    const fechaInforme = this.form_Informe.controls.fechainforme.value;
    console.log(fechaInforme)
    if (fechaEjecucion && fechaInforme) {
      const fecha1 = new Date(fechaEjecucion); 
      const fecha2 = new Date(fechaInforme);   

      const desfase_ms = fecha2.getTime() - fecha1.getTime(); // Diferencia en milisegundos
      const desfase_dias = Math.round(desfase_ms / 86400000);  // Convertir a días

      this.form_Informe.controls.desfase.setValue(desfase_dias); // Almacenar resultado en el formulario
      console.log(`Días de desfase: ${desfase_dias}`); // Mostrar en consola
    } else {
      console.warn('Ambas fechas deben estar seleccionadas para calcular el desfase.');
    }
  }; 



// ------------ DEFINICIÓN DE LOS CAMPOS DE BD INSTALACIÓN ------------  
form_Instalacion: FormGroup;
  instalaciones = [
    { CodInstalacion: 'CL01', nombreInstalacion: 'CH Colbún' },
    { CodInstalacion: 'CL02', nombreInstalacion: 'CH San Clemente' },
    { CodInstalacion: 'CL03', nombreInstalacion: 'CH La Mina' },
    { CodInstalacion: 'CL04', nombreInstalacion: 'CH Machicura' },
    { CodInstalacion: 'CL05', nombreInstalacion: 'CH Chiburgo' },
    { CodInstalacion: 'CL06', nombreInstalacion: 'CH San Ignacio' },
    { CodInstalacion: 'CL01', nombreInstalacion: 'Complejo Colbún' },
    { CodInstalacion: 'CL01', nombreInstalacion: 'CH Riego' },
  ];
  

  // ------------ DEFINICIÓN DE LOS CAMPOS DE BD Sistema ------------  
  form_Sistema: FormGroup
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


  // constructor(private fb: FormBuilder) 
  // {this.form_Instalacion = this.fb.group({ instalaciones: [''],});
  // this.form_Sistema = this.fb.group({ sistemas: [''],});
  // }


//---------------//

//------------ OBTENCIÓN DEL USUARIO EN SERVICIO DESDE LOCALSTORAGE ------------
ngOnInit() { 
  this.user =this.utilsSvc.getFromLocalStorage('user');
  if (this.document) {this.form_Informe.patchValue(this.document);   // los datos del documento se inserten en el formulario
  console.log(this.user)
  }
//  if (this.document){
//   this.form_Informe.controls.instalacion.patchValue(this.document.instalacion)
//  }
}


//-----Función: Tomar o seleccinar imagen-----//
async tomarImagen() {
  const result = await this.utilsSvc.takePicture('Agregar una Imagen');
  if (result && result.dataUrl) {
    this.form_Informe.controls.image.setValue(result.dataUrl);
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


//-----------  NUEVA FUNCIÓN SUBMIT  ------------/
submit(){ 
  if (this.form_Informe.valid) {   
    console.log('Paso 1: submit')   
                                         //  FORMULARIO VÁLIDO?
    if (this.document) this.actualizarDocumento();
    else this.crearDocumento();
  }
} 

//-----FUNCION: CREAR DOCUMENTO (EX SUBMIT)----//
  async crearDocumento() {

    console.log('FUNCIÓN CREAR DOCUMENTO')
      let path = `Usuarios/${this.user.uid}/Documentos`;
      console.log(path);
      console.log('path')

        const loading = await this.utilsSvc.loading();                        // LLAMA AL SPINNER
        await loading.present();              

      let dataUrl = this.form_Informe.value.image;    
      console.log(dataUrl)                        // CONVIERTE LA IMAGEN A DATO
      let imagePath = `${this.user.uid}/${Date.now()}`;   
      console.log(imagePath)                          // DIRECCIÓN PARA ALMACENAMIENTO EN STORAGE
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);  //  LLAMA A LA FUNCIÓN PARA SUBIR IMAGEN Y OBTENER URL DEL STORAGE.
      this.form_Informe.controls.image.setValue(imageUrl);      
      console.log(imageUrl)              // AGREGA LA URL DEL STORAGE EN EL FORMCONTROL IMAGE


      delete this.form_Informe.value.id;
      console.log('delete')
      this.firebaseSvc.addDocument(path, this.form_Informe.value).then(async res=>{
      
       
        this.utilsSvc.cerrarModal({success: true})
       


        this.utilsSvc.presentToast({                                          // TOAST DE CREACIÓN EXITOSA DE ELEMENTO
          message: "Creado Exitosamente",
          duration: 5000,
          color: 'success',
          position: 'middle',
          icon:  'alert-circle-outline',
        })

      }).catch(error => {                                                     // CONTROL DE ERRORES 
            this.utilsSvc.presentToast({                                      // MENSAJE SEGÚN CÓDIGO DE ERROR 
              message: error.message,                                     
              duration: 5000,                                         
              color: 'primary',                                       
              position: 'middle',                                     
              icon: 'alert-circle-outline',
            })
      
      }).finally(()=>{
            loading.dismiss();
          })
    }
  

            



  //-----FUNCION: ACTUALIZAR DOCUMENTO ----//
  async actualizarDocumento() {
    console.log('FUNCION ACTUALIZAR DOCUMENTO')

      let path = `Usuarios/${this.user.uid}/Documentos/${this.document.id}`;

        const loading = await this.utilsSvc.loading();                        // LLAMA AL SPINNER
        await loading.present();              
  
        //-----REGLAS: SUBIR NUEVA IMAGEN Y OBTENER NUEVA URL ----//
      if (this.form_Informe.value.image !=this.document.image){                 //LA IMAGEN DEL FORMULARIO ES DIFERENTE A LA QUE TENÍA ORIGINALMENTE.
        console.log('LA IMAGEN DEL FORMULARIO ES DIFERENTE A LA QUE TENIA')
        let dataUrl = this.form_Informe.value.image;                            // CONVIERTE LA IMAGEN A DATO
        let imagePath = await this.firebaseSvc.getFilePath(this.document.image);// DIRECCIÓN PARA ALMACENAMIENTO EN STORAGE
        let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);  //  LLAMA A LA FUNCIÓN PARA SUBIR IMAGEN Y OBTENER URL DEL STORAGE.
        this.form_Informe.controls.image.setValue(imageUrl);                    // AGREGA LA URL DEL STORAGE EN EL FORMCONTROL IMAGE
      }
 
 
      delete this.form_Informe.value.id;
      this.firebaseSvc.updateDocument(path, this.form_Informe.value).then(async res=>{
        
       
        this.utilsSvc.cerrarModal({success: true})

        this.utilsSvc.presentToast({                                          // TOAST DE CREACIÓN EXITOSA DE ELEMENTO
          message: "Actualizado Exitosamente",
          duration: 5000,
          color: 'success',
          position: 'middle',
          icon:  'checkmark-circle-outline',
        })

      }).catch(error => {                                                     // CONTROL DE ERRORES 
            this.utilsSvc.presentToast({                                      // MENSAJE SEGÚN CÓDIGO DE ERROR 
              message: error.message,                                     
              duration: 5000,                                         
              color: 'primary',                                       
              position: 'middle',                                     
              icon: 'alert-circle-outline',
            })
      
      }).finally(()=>{
            loading.dismiss();
            })
    }
 
 
    formconsolelog(){
      console.log(this.form_Informe.value);
    }
 
  }





