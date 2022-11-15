import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClientService } from '../services.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit
{

  shopCreation !: FormGroup;
  currentUser: any;
  currentSeller: any;
  shops: any;
  currentStore: any;

  constructor( private httpService : HttpClientService, private serviceAuth : AuthService, private formBuilder : FormBuilder, private route : Router ) { }

  switch(shop : any)
  {
    localStorage.setItem('boutique', JSON.stringify(shop));
    alert("Vous êtes positionné sur " + shop.nomBoutique + ".");
  }

  ngOnInit(): void
  {
    this.currentStore = JSON.parse(localStorage.getItem('boutique') || '[]');
    this.currentUser = JSON.parse(localStorage.getItem('ACCESS_TOKEN') || '[]');

    this.httpService.getUrl(this.httpService.boutiquierUrl).subscribe(
      value =>
      {
        if(this.currentUser.shop)
        {
          this.currentSeller = this.currentUser;
          this.shops = this.currentUser.shop;
        }
        else
        {
          this.currentSeller = value.find((param : any) => param.email === this.currentUser.username)
          this.shops = this.currentSeller.shop;
        }
      }
    );

    this.httpService.getUrl(this.httpService.shopUrl).subscribe(
      value => value
    );
    this.shopCreation  =  this.formBuilder.group(
      {
        nom: ['', Validators.required],
        link: ['', Validators.required],
        adresse: ['', Validators.required],
        image: ['', Validators.required],
      });
  }

}
