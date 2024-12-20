import { Component, inject, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  utilsSvc = inject(UtilsService)

  constructor() { }

  ngOnInit() {
  }

  listado(){
    this.utilsSvc.routerLink('/main/home')
  }
}
