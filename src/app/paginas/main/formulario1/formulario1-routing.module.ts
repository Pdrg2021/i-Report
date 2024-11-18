import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Formulario1Page } from './formulario1.page';

const routes: Routes = [
  {
    path: '',
    component: Formulario1Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Formulario1PageRoutingModule {}
