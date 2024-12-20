//-----------     IMPORTACIONES NECESARIAS PRA EL TEST          --------
//-----------     IMPORTACIONES BASE                            --------
import { TestBed } from '@angular/core/testing';
import { RegistroPage } from './registro.page';

//-----------     IMPORTACIONES NECESARIAS PRA EL TEST          --------
//-----------     IMPORTACIONES PARA FUNCIONALIDADES DEL .TS    --------
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';

//----------- CODIGO BASE  (F* INDIVIDUALIZA SU EJECIUCIÓN EN TEST) ----
fdescribe('RegistroPage', () => {
  let component: RegistroPage;
  let firebaseSvcMock: any;
  let utilsSvcMock: any;

  //----------- CODIGO BASE  (CONFIGURACIÓN PREVIA PARA EL TEST) --------
  beforeEach(() => {
    // Mock de FirebaseService
    firebaseSvcMock = {
      signUp: jasmine.createSpy('signUp').and.callFake((userData) => {
        // Asegurar que el objeto no incluye `uid`
        if ('uid' in userData) throw new Error('uid should not be included in signUp');
        return Promise.resolve({ user: { uid: 'random-uid-123' } });
      }),
      updateUser: jasmine.createSpy('updateUser').and.returnValue(Promise.resolve()),
    };

//-----------      DEFINICIÓN DE LOS MOCKS PARA PRUEBAS        -------- 
    utilsSvcMock = {
      loading: jasmine.createSpy('loading').and.returnValue({
        present: jasmine.createSpy('present'),
        dismiss: jasmine.createSpy('dismiss'),
      }),
    };

//-----------    DEFINICIÓN DEl ENTORNO DE PRUEBAS PARA LOS TEST -------- 
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule], //PARTE DEL COMPONENTE A PROBAR
      providers: [
        RegistroPage,
        FormBuilder,
        { provide: UtilsService, useValue: utilsSvcMock },
        { provide: FirebaseService, useValue: firebaseSvcMock },
      ],
    });

//-----------    CREACIÓN DEL COMPONENTE E INSTANCIADO PARA LOS TEST -------- 
    component = TestBed.inject(RegistroPage);
    component.form_registro = TestBed.inject(FormBuilder).group({
      uid: [''], 
      firstname: ['PNombre'],
      lastname: ['SNombre'],
      email: ['correo@fakecolbun.cl'],
      password: ['Qwerty.,1234'],
    });
  });

  fit('Evaluación de registro de usuario según los validadores asignados', async () => {
    await component.submit();
    expect(firebaseSvcMock.updateUser).toHaveBeenCalledWith('PNombre SNombre');     //
    expect(firebaseSvcMock.signUp).toHaveBeenCalledWith({
      firstname: 'PNombre', // Valor válido
      lastname: 'SNombre', // Valor válido
      email: 'correo@fakecolbun.cl', // Valor válido
      password: 'Qwerty.,1234', // Valor válido
    });
  
  });

  fit('Evaluación de registro de usuario sin cumplir los validadores asignados', async () => {
    await component.submit();
    expect(firebaseSvcMock.updateUser).toHaveBeenCalledWith('PNombre SNombre');     
    expect(firebaseSvcMock.signUp).not.toHaveBeenCalledWith({
      firstname: 'PNombre', // Valor válido
      lastname: 'SNombre',// Valor válido
      email: 'correo@fakecolbun.cl',// Valor válido
      password: 'Qwerty1234',// Valor no cumple con caractéres especiales
    });  
  
  });

})
  