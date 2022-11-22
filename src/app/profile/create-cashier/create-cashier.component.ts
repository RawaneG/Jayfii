import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { HttpClientService } from 'src/app/services.service';

@Component({
  selector: 'app-create-cashier',
  templateUrl: './create-cashier.component.html',
  styleUrls: ['./create-cashier.component.scss']
})
export class CreateCashierComponent implements OnInit
{
  body !: { };
  cashierCreation: any;
  currentSeller: any;
  currentUser: any;
  currentStore: any;

  constructor( private httpService : HttpClientService, private serviceAuth : AuthService, private formBuilder : FormBuilder, private route : Router ) { }

  creation()
  {
    this.body =
    {
      "email": this.cashierCreation.value.email,
      "password": this.cashierCreation.value.password,
      "nomComplet": this.cashierCreation.value.nomComplet,
      "telephone": +this.cashierCreation.value.telephone,
      "adresse": this.cashierCreation.value.adresse,
      "boutiquier":
      {
          "id" : this.currentSeller
      },
      "shop" :
      {
        "id" : +this.cashierCreation.value.shop
      }
    };
    this.httpService.postUrl(this.httpService.cashierUrl  , this.body);
    this.route.navigate(['/profile']);
  }
  ngOnInit(): void
  {
    this.currentUser = JSON.parse(localStorage.getItem('ACCESS_TOKEN') || '[]');
    this.httpService.getUrl(this.httpService.boutiquierUrl).subscribe(
      value =>
      {
        if(this.currentUser.shop)
        {
          this.currentSeller = this.currentUser.id;
        }
        else
        {
          this.currentSeller = value.find((param : any) => param.email === this.currentUser.username)
          this.currentSeller = this.currentSeller.id;
        }
      }
    );

    this.cashierCreation  =  this.formBuilder.group(
      {
        email: ['', Validators.required],
        password: ['', Validators.required],
        nomComplet: ['', Validators.required],
        telephone: ['', Validators.required],
        adresse: ['', Validators.required],
        shop: ['', Validators.required]
      });
  }
}
