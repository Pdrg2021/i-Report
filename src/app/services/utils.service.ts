import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
//Requerimiento de Capacitor Cámera
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl =inject(ModalController);
  router = inject(Router)

  //-----Loading------//
  loading() {
    return this.loadingCtrl.create({ spinner: 'dots'})
  }

  //-----Toastcontroller------//
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //-----Enrutar a Páginas------//
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  //-----Guardar en Localstorage------//
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //-----Rescatar de Localstorage------//
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }


  //----Servicio de Crear una Modal-----//
  async abriModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);  
    await modal.present();

    const{data} = await modal.onWillDismiss();
    if(data) return data;
    }

    cerrarModal(data?:any){
      return this.modalCtrl.dismiss(data);
    }


//----Servicio para utilizar cámara y galería----//
async takePicture(promptLabelHeader?: string) {
  return await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Prompt,          //Promt pregunta si la imagen es desde la cámara o galería
      promptLabelHeader,
      promptLabelPhoto:'Selecciona una Imágen',
      promptLabelPicture: 'Captura una Imágen',
  });};

  constructor() { }
}
