import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Document } from 'src/app/models/document.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


//IMPORTACIONES PARA LA FUNCIÓN CREAR PDF
import * as pdfMake from "pdfmake/build/pdfmake";
import "pdfmake/build/vfs_fonts"; // Carga las fuentes predeterminadas automáticamente
import { AlertController } from '@ionic/angular';

// import pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-crud-informes',
  templateUrl: './crud-informes.component.html',
  styleUrls: ['./crud-informes.component.scss'],
})

export class CRUDInformesComponent  implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
   alertController = inject(AlertController);

  user = {} as User;
  resp:User =this.utilsSvc.getFromLocalStorage('user');     //TRAE DE BASE EL USUARIO RESPONSABLE Y NO ES NECESARIO COMPLETARLO

  @Input() document : Document;
  @Input() readonly : boolean = false;
  @Input() edit     : boolean = true;
  @Input() validado : boolean = false     //Ocultar opciones de editado y borrado.
 
  // ------------ DEFINICIÓN DE LOS CAMPOS DE FORMULARIO INFORME ------------  
form_Informe = new FormGroup({
  id:             new FormControl('' ,                       ),             
  instalacion:    new FormControl('' , [Validators.required]),               // INSTALACIÓN
  sistema:        new FormControl('' , [Validators.required]),               // SISTEMA PRINCIPAL DE LA INSTALACIÓN
  nroPT:          new FormControl(null , [Validators.required, 
                                          Validators.min(70000), 
                                          Validators.pattern('^[0-9]{5}$')]),   // N° de PT                                                                
  responsable:    new FormControl(this.resp.email , [Validators.required, 
                                          Validators.email]),                   // RESPONSABLE DE LA ACTIVIDAD
  nroOT:          new FormControl(null , [Validators.required,
                                          Validators.min(50000000), 
                                          Validators.max(50099999),
                                          Validators.pattern('^[0-9]{8}$')]),   // N° DE ORDEN DE TRABAJO
  fechaejecucion: new FormControl(null , [Validators.required]),               // FECHA DE EJECUCIÓN   
  nroAviso:       new FormControl(null , [Validators.min(10000000), 
                                          Validators.max(10099999),
                                          Validators.pattern('^[0-9]{8}$')]),   // N° DE ORDEN DE TRABAJO
  fechainforme:   new FormControl(null , [Validators.required]),               // FECHA DE INFORME
  
  textoContexto:  new FormControl(null , [Validators.required] ), 
  textoRealizado: new FormControl(null , [Validators.required] ), 
  textoObservaciones: new FormControl('Sin Observaciones'),
  checkbox1: new FormControl(false),
  checkbox2: new FormControl(false),
  checkbox3: new FormControl(false),
  checkbox4: new FormControl(false),
  checkbox5: new FormControl(false),
  checkbox6: new FormControl(false),
  checkbox7: new FormControl(false),
  image:     new FormControl(''                   , [Validators.required]),               //REGISTRO DE IMAGEN
  //DATOS ESTADÍSTICA DE REPORTE
  desfase:   new FormControl(null),
  iniReport: new FormControl(null),                // FECHA DE INICIO REPORTE
  finReport: new FormControl(null),                // FECHA DE FIN REPORTE
  edadReport: new FormControl(null),               // FECHA DE FIN REPORTE
  // ESTATUS DEL INFORME
  validado: new FormControl(false)
});

// ------------ DEFINICIÓN DE LOS CAMPOS DE BD INSTALACIÓN ------------  
form_Instalacion: FormGroup;
  instalaciones = [
    { codInstalacion: 'CL01', nombreInstalacion: 'CH Colbún' },
    { codInstalacion: 'CL02', nombreInstalacion: 'CH San Clemente' },
    { codInstalacion: 'CL03', nombreInstalacion: 'CH La Mina' },
    { codInstalacion: 'CL04', nombreInstalacion: 'CH Machicura' },
    { codInstalacion: 'CL05', nombreInstalacion: 'CH Chiburgo' },
    { codInstalacion: 'CL06', nombreInstalacion: 'CH San Ignacio' },
    { codInstalacion: 'CL01', nombreInstalacion: 'Complejo Colbún' },
    { codInstalacion: 'CL01', nombreInstalacion: 'CH Riego' },
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

//------------ OBTENCIÓN DEL USUARIO EN SERVICIO DESDE LOCALSTORAGE ------------
ngOnInit() { 
  this.setiniReport();
  this.user =this.utilsSvc.getFromLocalStorage('user');
  if (this.document) {
    this.form_Informe.patchValue(this.document);   
    }
}


//-----------      TOMAR O CARGAR IMAGEN      ------------//
async tomarImagen() {
  const result = await this.utilsSvc.takePicture('Agregar una Imagen');
  if (result && result.dataUrl) {
    this.form_Informe.controls.image.setValue(result.dataUrl);
    } else {
      this.utilsSvc.presentToast({
        message: 'No se ha seleccionado ninguna imágen.',
        duration: 5000,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline',
         });
      }
    }


//-----------  FUNCIÓN SUBMIT DEL FORMULARIO (CREA O ACTUALIZA DOCUMENTO)  ------------/
submit() {
  if (this.form_Informe.valid) {
    console.log('Paso 1: verificado si formualrio es ok')
      if (this.document) {
        this.actualizarDocumento();
        console.log('iniciar Paso 2a: actualzar documento')   }
      else {
        this.crearDocumento();
        console.log('iniciar Paso 2c: crear documento')    }
  }} 

//------------     FUNCION: CREAR DOCUMENTO     -----------//
async crearDocumento() {
  //  console.log('Paso 2c: crear documento')

    let path = `Documentos`;                                   // DIRECCIÓN PARA ALMACENAMIENTO EN DB
    // console.log(path);

    const loading = await this.utilsSvc.loading();             // LLAMA AL SPINNER
      await loading.present();              

    let dataUrl = this.form_Informe.value.image;               // CONVIERTE LA IMAGEN A DATO
    // console.log(dataUrl)   

    let imagePath = `${this.user.uid}/${Date.now()}`;         
    // console.log(imagePath)
                                                              // DIRECCIÓN PARA ALMACENAMIENTO EN STORAGE
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);  //  LLAMA A LA FUNCIÓN PARA SUBIR IMAGEN Y OBTENER URL DEL STORAGE.
    this.form_Informe.controls.image.setValue(imageUrl);      // AGREGA LA URL DEL STORAGE EN EL FORMCONTROL IMAGE
    // console.log(imageUrl)              

    delete this.form_Informe.value.id;

    this.firebaseSvc.addDocument(path, this.form_Informe.value).then(async res=>{     
      this.utilsSvc.cerrarModal({success: true})
      this.utilsSvc.presentToast({                                          // TOAST DE CREACIÓN EXITOSA DE ELEMENTO
        message: "Creado Exitósamente",
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
  // console.log('Paso 2a: actualzar documento')

    let path = `Documentos/${this.document.id}`;
      const loading = await this.utilsSvc.loading();                        // LLAMA AL SPINNER
      await loading.present();              

//-----REGLAS: SUBIR NUEVA IMAGEN Y OBTENER NUEVA URL ----//
    if (this.form_Informe.value.image !=this.document.image){                 //LA IMAGEN DEL FORMULARIO ES DIFERENTE A LA QUE TENÍA ORIGINALMENTE.
      // console.log('LA IMAGEN DEL FORMULARIO ES DIFERENTE A LA QUE TENIA')
      let dataUrl = this.form_Informe.value.image;                            // CONVIERTE LA IMAGEN A DATO
      let imagePath = await this.firebaseSvc.getFilePath(this.document.image);// DIRECCIÓN PARA ALMACENAMIENTO EN STORAGE
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);  //  LLAMA A LA FUNCIÓN PARA SUBIR IMAGEN Y OBTENER URL DEL STORAGE.
      this.form_Informe.controls.image.setValue(imageUrl);                    // AGREGA LA URL DEL STORAGE EN EL FORMCONTROL IMAGE
    }


    delete this.form_Informe.value.id;
    this.firebaseSvc.updateDocument(path, this.form_Informe.value).then(async res=>{        
      this.utilsSvc.cerrarModal({success: true})

      this.utilsSvc.presentToast({                                          // TOAST DE CREACIÓN EXITOSA DE ELEMENTO
        message: "Actualizado Exitósamente",
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

//-----FUNCION: CONVERTIR IMAGEN A FORMATO BASE64 ----//
async urlToBase64(url: string): Promise<string> {
  const response = await fetch(url); // Descarga la imagen desde la URL
  const blob = await response.blob(); // Convierte la imagen en un objeto Blob
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); // Usa FileReader para leer el Blob
    reader.onloadend = () => resolve(reader.result as string); // Convierte a base64
    reader.onerror = reject; // Maneja errores
    reader.readAsDataURL(blob); // Inicia la conversión
  });
}

  // -----FUNCION: GENDERAR PDF DEL INFORME
  async generarPDF() {

    this.calculoedad();
    const formData = this.form_Informe.value;                   // EXTRAER DATOS DEL FORMULARIO PARA EL PDF    
    // LOGO EN BASE64 CONVERSTIDA EN UNA APP WEB
    let logoBase64 = "data:image/jpeg;base64,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";
    // CONVERTIR LA IMAGEN DEL REPORTE EN BASE64 
    let imageBase64 = null;                                     // CREA UNA VARIABLE PARA ALMACENAR DATOS EN FORMATO BASE64 
    try {
      imageBase64 = await this.urlToBase64(formData.image);   // LLAMA A LA FUNCIÓN DE CONVERSIÓN DE IMAGEN
    }
    catch (error) {
      console.error("Error al convertir la imagen a base64:", error); // MANEJO DE ERROR AL CONVERTIR LA FUNCION
    }

    
    const docDefinition = {
      content: [
        // LOGO Y TÍTULO
        {
          columns: [
            { image: logoBase64, width: 100 }, // Logo
            { text: 'Informe Técnico I&C – Complejo Colbún', style: 'header', alignment: 'right' }, // Título
          ],
          margin: [0, 0, 0, 10],
        },
        // CARD DE DATOS GENERALES
        { text: 'Datos Generales', style: 'subheader', margin: [0, 10, 0, 5] },
        {
          table: {
            widths: [70, 'auto', 120, 100, 'auto', '*'], 
            body: [
              [{text:'Instalación', fontSize: 10 , fillColor: '#f0f0f0'},{text:':', fillColor: '#f0f0f0', fontSize: 10}, {text:formData.instalacion || '', fontSize: 10, color: 'blue'}, {text:'Sistema:', fillColor: '#f0f0f0', fontSize: 10},{text:':', fillColor: '#f0f0f0', fontSize: 10}, {text: formData.sistema || '', fontSize: 10, color: 'blue'}],
              [{text:'N° de PT', fontSize: 10, fillColor: '#f0f0f0'}, {text:':', fillColor: '#f0f0f0', fontSize: 10},{text:formData.nroPT || '', fontSize: 10, color: 'blue'}, {text:'Responsable:', fillColor: '#f0f0f0', fontSize: 10}, {text:':', fillColor: '#f0f0f0', fontSize: 10},{text:formData.responsable || '', fontSize: 10, color: 'blue'}],
              [{text:'N° de OT', fontSize: 10, fillColor: '#f0f0f0'}, {text:':', fillColor: '#f0f0f0', fontSize: 10},{text:formData.nroOT || '', fontSize: 10, color: 'blue'}, {text:'Fecha de Ejecución:', fillColor: '#f0f0f0', fontSize: 10},{text: ':', fillColor: '#f0f0f0', fontSize: 10},{text: formData.fechaejecucion || '', fontSize: 10, color: 'blue'}],
              [{text:'N° de Aviso', fontSize: 10, fillColor: '#f0f0f0'}, {text:':', fillColor: '#f0f0f0', fontSize: 10},{text:formData.nroAviso || '', fontSize: 10, color: 'blue'}, {text:'Fecha de Informe:', fillColor: '#f0f0f0', fontSize: 10},{text:':', fillColor: '#f0f0f0', fontSize: 10}, {text:formData.fechainforme || '', fontSize: 10, color: 'blue'}],
            ],
          },
          layout: 'lightVerticalLines',
          margin: [0, 0, 0, 10],
        },
        // CARD DE CONTEXTO Y ANTECEDENTES
        { text: 'Contexto y Antecedentes', style: 'subheader', margin: [0, 10, 0, 5] },
        { 
          table: {
          widths: ['*'], 
          body: [
              [{text:'Contexto y Antecedentes de lo encontrado. ', fillColor: '#f0f0f0', fontSize: 10 }],
              [{text:formData.textoContexto || 'Sin información.', fontSize: 10, color: 'blue' }],
              [{text:' Antecedentes de lo realizado.  ', fillColor: '#f0f0f0', fontSize: 10 }],
              [{text: formData.textoRealizado || 'Sin información.', fontSize: 10, color: 'blue' }],
            ],
          },
        layout: 'lightVerticalLines',
        margin: [0, 0, 0, 10],
        },

        // Resumen tras Intervención
        { text: 'Resumen tras Intervención', style: 'subheader', margin: [0, 10, 0, 5] },
        {
          table: {
            widths: [400,'*'], 
            body: [
              [{text: 'Sistema(s) o Equipo(s) Normalizado(s)', fontsize: 10, fillColor: '#f0f0f0'}, {text:formData.checkbox1  ? {text:'( X )', color: 'green'}:'( _ )', fontsize: 10, alignment: 'center'} ],
              [{text:'Sistema(s) o Equipo(s) Operativo(s) c/Observaciones', fontsize: 10, fillColor: '#f0f0f0'}, {text:formData.checkbox2  ? {text:'( X )', color: 'orange'}:'( _ )', fontsize: 10, alignment: 'center'} ],
              [{text:'Sistema(s) o Equipo(s) Indisponible(s)', fontsize: 10, fillColor: '#f0f0f0'},{text: formData.checkbox3  ? {text:'( X )', color: 'red'}:'( _ )' , fontsize: 10, alignment: 'center'}],
            ],
          },
          layout: 'lightVerticalLines',
          margin: [0, 0, 0, 10],
        },
        { text: 'Texto de Observaciones.', fillColor: '#f0f0f0', fontSize: 10, margin: [0, 0, 0, 10] },
        { text: formData.textoObservaciones || '', fontsize: 10, margin: [0, 0, 0, 10] , color: 'blue'},
        // CARD DE REPUESTOS Y COMPONENTES
        { text: 'Repuestos y Componentes', style: 'subheader', margin: [0, 10, 0, 5] },
        {
          table: {
            widths: [400,'*'], 
            body: [
              [{text:'Se realizó ajuste(s) de parámetro(s)', fontsize: 10, fillColor: '#f0f0f0'}, {text: formData.checkbox4 ? '( Sí  )':'( No )' , fontsize: 10, alignment: 'center', color: 'blue'}],
              [{text:'Se realizó reparación(es) de componente(s)', fontsize: 10, fillColor: '#f0f0f0'}, {text: formData.checkbox5 ? '( Sí  )':'( No )', fontsize: 10, alignment: 'center', color: 'blue'} ],
              [{text:'Se realizó reemplazo de componente(s)', fontsize: 10, fillColor: '#f0f0f0'},  {text:formData.checkbox6 ? '( Sí  )':'( No )' , fontsize: 10, alignment: 'center', color: 'blue'}],
              [{text:'Se implementó mejoras con nuevo(s) componente(s)', fontsize: 10, fillColor: '#f0f0f0'},  {text:formData.checkbox7 ? '( Sí  )':'( No )', fontsize: 10, alignment: 'center', color: 'blue'} ],
            ],
          },
          layout: 'lightVerticalLines',
          margin: [0, 0, 0, 10],
        },

        // CARD DE REGISTRO FOTOGRAFICO
        { text: 'Registro Fotográfico', style: 'subheader', margin: [0, 10, 0, 5], pageBreak: 'before'},
        ...(imageBase64
          ? [{
              image: imageBase64,
              // width: 400,
              fit: [400,400],
              alignment: 'center',
              margin: [0, 10, 0, 10],
            }]
          : [{ text: 'Sin fotografía disponible.', alignment: 'center', margin: [0, 10, 0, 10] }]),
          {text: '\n\n' },
          {text: '\n\n' },
          {text: '\n\n' },
          // CARD DE KPI
          { text: 'Estadística de Reporte', style: 'subheader', margin: [0, 10, 0, 5] },
          {
            table: {
              widths: ['*'],
              body: [
                [{text: 'Desfase de Informe (Fecha Reporte - Fecha Ejecución) ', fillColor: '#f0f0f0', fontSize: 10 }],
                [{text: formData.desfase || 'Sin información.' + 'días de desfase', fontSize: 10}],
                [{text: 'Edad de Informe (Fecha de Generación PDF - Fecha de Validación)  ', fillColor: '#f0f0f0', fontSize: 10 }],
                [{text:formData.edadReport || 'Sin información.' + 'Tiempo de Vida del Documento', fontSize: 10}]
              ],
            },
            layout: 'lightVerticalLines',
            margin: [0, 0, 0, 10],
          },



        ],
      
      images: {
            
        imageBase64: formData.image,
     
      },

      styles: {
        header: { fontSize: 18, bold: true },
        subheader: { fontSize: 14, bold: true },
        
      },

      
    };
  
    pdfMake.createPdf(docDefinition).download(`${formData.fechaejecucion || ''}_${formData.instalacion || ''}_${formData.sistema || ''}_OT-${formData.nroOT || ''}_Aviso_${formData.nroAviso || ''}.pdf`);
  }


  //------------      CALCULOS PARA KPI DEL PROYECTO: DESFASE -----------------  
//------------ 1.1.- FECHA DE EJECUCIÓN DESDE HTML AL FORMULARIO ------------
seleccionarFechaEjecucion(event: any) {
  this.form_Informe.events;
  // console.log('fechaejecucion', this.form_Informe.controls.fechaejecucion.value)
  this.calculodesfase();
}


//------------ 1.2.- FECHA DE INFORME DESDE HTML AL FORMULARIO ------------
seleccionarFechaInforme(event: any) {
  this.form_Informe.events;
  // console.log(this.form_Informe.controls.fechainforme.value)
  this.calculodesfase();
}


//------------ 1.3.- CALCULO DEL DESFASE DE TIEMPO  ------------
calculodesfase() {
  const fechaEjecucion = this.form_Informe.controls.fechaejecucion.value;
  // console.log(fechaEjecucion)

  const fechaInforme = this.form_Informe.controls.fechainforme.value;
  // console.log(fechaInforme)

  if (fechaEjecucion && fechaInforme) {
    const fecha1 = new Date(fechaEjecucion);
    const fecha2 = new Date(fechaInforme);
    // console.log(fecha1, fecha2)

    if (!isNaN(fecha1.getTime()) && !isNaN(fecha2.getTime())) {
      const desfase_ms = fecha2.getTime() - fecha1.getTime();           // AMBAS FECHAS EN ms
      const desfase_dias = Math.round(desfase_ms / 86400000);           // CONVERSIÓN A DÍAS
      this.form_Informe.controls.desfase.setValue(desfase_dias);        // ALMACENA DESFASE EN FORMULARIO
      // console.log(`Días de desfase: ${desfase_dias}`);
    }
    else {
      console.error('Error Formato fechas');
    }
  }
  else {
    console.warn('Ambas fechas deben estar seleccionadas para calcular el desfase.');
  }
}; 


//------------ CALCULOS PARA KPI DEL PROYECTO: EDAD REPORTE  ------------------- 
//------------ 2.1.- FECHA DE INICIO DE REPORTE AL  ABRIR FORMULARIO ------------
setiniReport(): void {
  const fecha3 = new Date()
  this.form_Informe.controls.iniReport.setValue(fecha3.getTime());
  // console.log(fecha3);
}


//------------     2.2.- FECHA DE FIN DE REPORTE Y CALCULO DE EDAD AL GENERAR PDF    ------------
calculoedad() {
  if(!this.document.validado)
  {
  const fecha5 = this.form_Informe.controls.iniReport.value;
  const fecha4 = new Date();
  this.form_Informe.controls.finReport.setValue(fecha4);
  // console.log(fecha4, this.form_Informe.controls.finReport.value, fecha5)


//------------     2.3.- CÁLCULO DE LA EDAD DEL REPORTE AL GENERAR PDF------------
  if (!isNaN(fecha5) && !isNaN(fecha4.getTime())) {
    const edad_ms = fecha4.getTime() - fecha5;
    const edad_dias = Math.floor(edad_ms / (1000 * 60 * 60 * 24));
    const edad_horas = Math.floor((edad_ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const edad_minutos = Math.floor((edad_ms % (1000 * 60 * 60)) / (1000 * 60));
    const edad_segundos = Math.floor((edad_ms % (1000 * 60)) / 1000);
    this.form_Informe.controls.edadReport.patchValue(`${edad_dias}:Días, ${edad_horas}: horas, ${edad_minutos}: minutos, ${edad_segundos}: segundos`)
    // console.log(`
  //     ${edad_dias}:Días,
  //     ${edad_horas}: horas,
  //     ${edad_minutos}: minutos,
  //     ${edad_segundos}: segundos`);
    }
  else {
    console.error('Error Formato fechas');
  }
}
}


async alertvalidar() {
  const alert = await this.alertController.create({
    header: 'Validar Formulario',
    subHeader: 'Bloqueo a la edición',
    message: '¿Confirma Validar Formulario?',
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
          this.validar() 
          },
        },
      ]
    });
    
    await alert.present();
  }



validar(){
  console.log(this.document.validado);
  console.log(this.form_Informe.controls.validado);
  this.form_Informe.controls.validado.setValue(true);
  this.actualizarDocumento();

  

  // this.document.validado=true;

  
}

}
