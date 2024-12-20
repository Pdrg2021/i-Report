import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { InputsComponent } from './components/inputs/inputs.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CRUDInformesComponent } from './components/crud-informes/crud-informes.component';



@NgModule({
  declarations: [
  // AGREGAMOS NUESTROS COMPONENTES
    HeaderComponent,
    InputsComponent,
    LogoComponent,
    CRUDInformesComponent,
  ],


  // AGREGAMOS NUEVO ARREGLO DE EXPORTS//
  exports: [
      // AGREGAMOS NUESTROS COMPONENTES PARA SER UTILZIADOS POR OTROS MODULOS
      HeaderComponent,
      InputsComponent,
      LogoComponent,
      ReactiveFormsModule,
      CRUDInformesComponent,

      
  ],
  imports: [
    CommonModule,
    IonicModule, // IMPORTAMOS COMPONENTES NECESARIOS //
    ReactiveFormsModule,// IMPORTAMOS COMPONENTES NECESARIOS //
    FormsModule,// IMPORTAMOS COMPONENTES NECESARIOS PARA ACEPTAR INPUT DE USUARIOS //
    
  ]
})
export class SharedModule { }
