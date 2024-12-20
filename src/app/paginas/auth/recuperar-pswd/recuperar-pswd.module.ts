import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperarPswdPageRoutingModule } from './recuperar-pswd-routing.module';

import { RecuperarPswdPage } from './recuperar-pswd.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperarPswdPageRoutingModule,
    SharedModule //IMPORTAMOS NUESTRO MÓDULO PERSONALIZADO LLAMADO SHARED//
  ],
  declarations: [RecuperarPswdPage]
})
export class RecuperarPswdPageModule {}
