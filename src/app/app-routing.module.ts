import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./paginas/auth/auth.module').then( m => m.AuthPageModule), canActivate:[NoAuthGuard]
  },
  {
    path: 'main',
    loadChildren: () => import('./paginas/main/main.module').then( m => m.MainPageModule), canActivate:[AuthGuard]
  },
  // {
  //   path: 'main/home',
  //   loadChildren: () => import('./paginas/main/home/home.module').then( m => m.HomePageModule) 
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
