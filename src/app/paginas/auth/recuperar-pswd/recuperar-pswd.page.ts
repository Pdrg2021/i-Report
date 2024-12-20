import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-recuperar-pswd',
  templateUrl: './recuperar-pswd.page.html',
  styleUrls: ['./recuperar-pswd.page.scss'],
})
export class RecuperarPswdPage implements OnInit {  


  form_recuperar = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  }) 


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService)

  ngOnInit() {
  }

  async submit() {
    if (this.form_recuperar.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.sendRecoveryEmail(this.form_recuperar.value.email).then(res => {
        
        this.utilsSvc.presentToast({
          message: 'Correo de Recuperación enviado con éxito',
          duration: 5000,
          color: 'primary',
          position: 'middle',
          icon: 'mail-outline',
        })

        this.utilsSvc.routerLink('/auth');
        
      }).catch(error=> {
        // (console.log(error));
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 5000,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle',
        })

        
      }).finally(()=>{
        loading.dismiss();
      })
    }
  }

}
