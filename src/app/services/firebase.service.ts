import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile, } from "firebase/auth"; //API Modular FIREBASE
import { User } from '../models/user.model';

import { AngularFirestore } from '@angular/fire/compat/firestore'
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query } from '@angular/fire/firestore'
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilSvc = inject(UtilsService);
  storage = inject(AngularFireStorage);


  //-----FUNCIONES PARA AUTENTICACIÓN CON FIREBASE-----//
  getAuth() {
    return getAuth();
  }

  //-----AUTENTICACIÓN-----//
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //-----CREAR USUARIO-----//
  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //-----ACTUALIZAR USUARIO-----//
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName});
  }

  //-----RESTABLECER CONTRASEÑA DE USUARIO-----//
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }
  //-----CERRAR SESION-----//
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilSvc.routerLink('/auth');
  }





  //--------------------------------CRUD BASE DE DATOS CON FIREBASE--------------------------------//

  //-----CREAR DOCUMENTO EN COLECCIÓN-----//
  addDocument(path: string, data: any) {
    console.log("addDocument");
    console.log(data);
    return addDoc(collection(getFirestore(), path), data);//MÉTODO ADD, AÑADE ID AL DOCUMENTO// 
  }

  //-----LEER DOCUMENTO DESDE COLECCIÓN-----//
  async getDocument(path: string) {
    console.log("getDocument");
    console.log(path);
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //----- ACTUALIZAR UN DOCUMENTO EN COLECCIÓN-----// (UPDATE)
  setDocument(path: string, data: any) {
    console.log("setDocument");
    console.log(path);
    console.log(data);
    return setDoc(doc(getFirestore(), path), data);
  }

  //-----BORRAR DOCUMENTO EN COLECCIÓN-----//
  deleteDocument(path: string, data: any) {
    this.deleteDocument(path, data);
  }

  //-----OBTENER TODOS LOS DOCUMENTOS DE LA COLECCIÓN-----//
  getCollectionData(path: string, collectionQuery?: any) {
    console.log("getCollectionData");
    console.log(path);
    console.log(collectionQuery);
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery))
  }
  //--------------------------------             FIN             --------------------------------//




  //-----FUNCIONES PARA STORAGE CON FIREBASE-----//
  
  //-----subir imagen----//  
  async uploadImage(path: string, dataUrl: string) {
    try {
      const storageRef = ref(getStorage(), path);
      await uploadString(storageRef, dataUrl, 'data_url');  // Aquí asegúrate de que el 'dataUrl' sea válido
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir la imagen: ', error);
      throw error;  // Lanza el error para poder manejarlo en la función submit
    }
  }
  

}
