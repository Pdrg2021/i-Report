import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-inputs',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss'],
})
export class InputsComponent  implements OnInit {

  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() label!: string;
  @Input() autocomplete!: string;
  @Input() icon!: string;
  
    //dos nuevas variables para la password//
    isPassword!: boolean;
    hide: boolean = true;

  constructor() { }

  ngOnInit() {
    //--------- DETECCIÓN SI EL INPUT CORRESPONDE A TYPE PASSWORD ---------//
    if (this.type=='password') this.isPassword = true
  }

 

 //--------- DESPROTEGE/PROTEGE LOS CARACTERES DEL FORM TIPO PASSWORD ---------//
  showOrHidePassword() {
    this.hide = !this.hide; 
    if(this.hide) this.type ='password'; 
    else this.type = 'text';
    }
  }

