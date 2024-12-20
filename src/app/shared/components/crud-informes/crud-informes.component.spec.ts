//-----------     IMPORTACIONES NECESARIAS PRA EL TEST          --------
//-----------     IMPORTACIONES BASE                            --------
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular'

//-----------     IMPORTACIONES NECESARIAS PRA EL TEST          --------
//-----------     IMPORTACIONES PARA FUNCIONALIDADES DEL .TS    --------
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CRUDInformesComponent } from './crud-informes.component';
//-----------  IMPORTACIONES PARA FUNCIONALIDADES DE SERVICIOS  --------
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
//-----------  IMPORTACIONES PARA FUNCIONALIDADES DE LOS MOCKS  --------
import { InjectionToken } from '@angular/core';



export const FIREBASE_OPTIONS = new InjectionToken<any>('angularfire2.app.options');

//----------- CODIGO BASE  (F* INDIVIDUALIZA SU EJECIUCIÓN EN TEST) ----
fdescribe('CRUDInformesComponent', () => {
  let component: CRUDInformesComponent;
  let fixture: ComponentFixture<CRUDInformesComponent>;


//----------- CODIGO BASE  (CONFIGURACIÓN PREVIA PARA EL TEST) --------
  beforeEach(async () => {

//-----------      DEFINICIÓN DE LOS MOCKS PARA PRUEBAS        -------- 
    const firebaseServiceMock = jasmine.createSpyObj('FirebaseService', ['addDocument', 'getDocument']);
    const utilsServiceMock = jasmine.createSpyObj('UtilsService', ['showToast', 'getFromLocalStorage']);
    utilsServiceMock.getFromLocalStorage.and.returnValue({});
    utilsServiceMock.showToast.and.stub();
    firebaseServiceMock.addDocument.and.returnValue(Promise.resolve());

//-----------    DEFINICIÓN DEl ENTORNO DE PRUEBAS PARA LOS TEST -------- 
    await TestBed.configureTestingModule({
      declarations: [CRUDInformesComponent],        //COMPONENTE A PROBAR
      imports: [ReactiveFormsModule,FormsModule,    //IMPORTACIONES NECESARIAS
       IonicModule.forRoot()],

      providers: [
        { provide: FirebaseService, useValue: firebaseServiceMock },     
        { provide: UtilsService, useValue: utilsServiceMock },      
        { provide: FIREBASE_OPTIONS, useValue: { apiKey: 'mock-api-key' } }  ],
  
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

//-----------    CREACIÓN DEL COMPONENTE E INSTANCIADO PARA LOS TEST -------- 
    fixture = TestBed.createComponent(CRUDInformesComponent);
    component = fixture.componentInstance;
    component.instalaciones = [
       { codInstalacion: '001', nombreInstalacion: 'Instalación 1' },
       { codInstalacion: '002', nombreInstalacion: 'Instalación 2' }];
     fixture.detectChanges();  });

  fit('Evaluación de input "nroOT" según los validadores asignados', () => {
    const nroOTControl = component.form_Informe.controls['nroOT'];
    nroOTControl.setValue('50000000'); 
    expect(nroOTControl.valid).toBeTrue();
    
    nroOTControl.setValue('500'); 
    expect(nroOTControl.valid).toBeFalse();

    nroOTControl.setValue('49999999'); 
    expect(nroOTControl.valid).toBeFalse();  });

  fit('Evaluación de input "nroPT" según los validadores asignados', () => {
    const nroPTControl = component.form_Informe.controls['nroPT'];
    nroPTControl.setValue('70000'); // Valor válido
    expect(nroPTControl.valid).toBeTrue();

    nroPTControl.setValue('1234'); // Valor inválido
    expect(nroPTControl.valid).toBeFalse();  });

  fit('Evaluación de input "nroAviso" según los validadores asignados', () => {
    const nroAvisoControl = component.form_Informe.controls['nroAviso'];
    nroAvisoControl.setValue('10000000'); // Valor válido
    expect(nroAvisoControl.valid).toBeTrue();

    nroAvisoControl.setValue('999999'); // Valor inválido
    expect(nroAvisoControl.valid).toBeFalse();
  });

});;

