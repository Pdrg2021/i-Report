import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile, } from "firebase/auth"; //API Modular FIREBASE
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore'
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { User } from '../models/user.model';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  auth      = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilSvc   = inject(UtilsService);
  storage   = inject(AngularFireStorage);


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

  //-----AGREGAR DOCUMENTO EN COLECCIÓN-----//
  addDocument(path: string, data: any) {
   return addDoc(collection(getFirestore(), path), data);//MÉTODO ADD, AÑADE ID AL DOCUMENTO// 
  }

  //-----OBTENER DOCUMENTO DESDE COLECCIÓN-----//
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //----- ACTUALIZAR UN DOCUMENTO EN COLECCIÓN-----// (UPDATE)
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //----- ACTUALIZAR UN DOCUMENTO EN COLECCIÓN-----// (UPDATE)
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  //-----BORRAR DOCUMENTO EN COLECCIÓN-----//
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(),path));
  } 

  //-----OBTENER TODOS LOS DOCUMENTOS DE LA COLECCIÓN-----//
  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery),{idField: 'id'})   //COMPLEMENTO PARA QUE DEVUELVA TAMBIÉN EL ID.
  }



  //------------ FUNCIONES PARA STORAGE CON FIREBASE ------------
  
  //------------  SUBIR UNA IMAGEN AL STORAGE  Y OBTENER LA URL  ------------
  async uploadImage(path: string, data_url: string) {
    return uploadString (ref(getStorage(), path), data_url,'data_url')
    .then(()=> {
      return getDownloadURL(ref(getStorage(), path))
    })
  }
  
  //------------ OBTENER RUTA DE IMAGEN  ------------
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath
  }

   //------------  BORRAR IMAGEN DEL STORAGE   ------------
   async deleteImage(path: string) {
    return deleteObject (ref(getStorage(), path));
  }
 

}
 
