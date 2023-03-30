import { HttpClientService } from 'src/app/services.service';
import { IndexDBService } from 'src/app/index-db.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-cashier',
  templateUrl: './create-cashier.component.html',
  styleUrls: ['./create-cashier.component.scss']
})
export class CreateCashierComponent implements OnInit
{
  cashierCreation: any;
  currentSeller: any;
  currentUser: any;
  body !: { };
  shops: any;

  constructor( private httpService : HttpClientService, private formBuilder : FormBuilder, private route : Router, private indexDBService : IndexDBService) { }

  retour()
  {
    this.route.navigate(['../profile']);
  }
  creation()
  {
    this.body =
    {
      "email": this.cashierCreation.value.email,
      "adresse": this.cashierCreation.value.adresse,
      "password": this.cashierCreation.value.password,
      "telephone": +this.cashierCreation.value.telephone,
      "nomComplet": this.cashierCreation.value.nomComplet,
      "boutiquier":
      {
          "id" : this.currentSeller
      },
      "shop" :
      {
        "id" : +this.cashierCreation.value.shop
      }
    };
    this.httpService.create(this.httpService.cashierUrl  , this.body).subscribe(
      {
        next : () => this.httpService.openSnackBar('Caissier inscrit avec succès','/profile'),
        error : () => console.log('Erreur au niveau de la page création de caissier'),
        complete : () => console.log('Caissier inscrit avec succès')
      })
  }
  ngOnInit(): void
  {
    this.indexDBService.getData('currentUser').subscribe(
      data =>
      {
        this.currentSeller = data[0].user.id
        this.shops = data[0].user.shop
      },
      error => console.log("Erreur au niveau du composant création de boutique" + error))

    this.cashierCreation  =  this.formBuilder.group(
      {
        shop: ['', Validators.required],
        email: ['', Validators.required],
        adresse: ['', Validators.required],
        password: ['', Validators.required],
        telephone: ['', Validators.required],
        nomComplet: ['', Validators.required],
      });
  }
}
