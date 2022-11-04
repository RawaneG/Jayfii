import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { HttpClientService } from 'src/app/services.service';

@Component({
  selector: 'app-create-shop',
  templateUrl: './create-shop.component.html',
  styleUrls: ['./create-shop.component.scss']
})
export class CreateShopComponent implements OnInit {

  shopCreation !: FormGroup;

  constructor( private httpService : HttpClientService, private serviceAuth : AuthService, private formBuilder : FormBuilder, private route : Router ) { }

  creation()
  {

  }

  ngOnInit(): void
  {
    this.shopCreation  =  this.formBuilder.group(
      {
        nom: ['', Validators.required],
        link: ['', Validators.required],
        adresse: ['', Validators.required],
        image: ['', Validators.required],
      });
  }

}
