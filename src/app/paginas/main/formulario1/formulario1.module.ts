import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Formulario1PageRoutingModule } from './formulario1-routing.module';

import { Formulario1Page } from './formulario1.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Formulario1PageRoutingModule,
    SharedModule,

  ],
  declarations: [Formulario1Page]
})
export class Formulario1PageModule {}
