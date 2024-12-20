import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilsService } from '../services/utils.service';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  firebaseSvc= inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree > |boolean | UrlTree {
    
    let user = localStorage.getItem('user');
      
    return new Promise((resolve)=> {

      this.firebaseSvc.getAuth().onAuthStateChanged((auth)=> {

        if(auth) { 
          if(user)
            resolve(true);
            // console.log('Auth resolve true');  
        }
        else{
          this.utilsSvc.routerLink('/auth');
            resolve(false);   
            // console.log('Auth resolve false');   
        }
      })
    })
  
  }
}
