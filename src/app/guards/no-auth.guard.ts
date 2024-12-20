import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilsService } from '../services/utils.service';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  firebaseSvc= inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  canActivate(
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree > |boolean | UrlTree {
          
    return new Promise((resolve)=> {

      this.firebaseSvc.getAuth().onAuthStateChanged((auth)=> {

        if(!auth) { 
            resolve(true);
            // console.log('NoAuth resolve true');   
        }
        else{
          this.utilsSvc.routerLink('/main/home');
            resolve(false);   
            // console.log('NoAuth resolve false');  
        }
      })
    })
   
  }
}
