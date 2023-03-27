import { HttpClientService } from 'src/app/services.service';
import { IndexDBService } from 'src/app/index-db.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  shops: any;

  constructor( private httpService : HttpClientService, private serviceAuth : AuthService, private formBuilder : FormBuilder, private route : Router, private indexDBService : IndexDBService) { }
  retour()
  {
    this.route.navigate(['../profile']);
  }
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
    this.httpService.create(this.httpService.cashierUrl  , this.body).subscribe(
      {
        next : (value : any) =>
        {
          this.httpService.openSnackBar('Caissier inscrit avec succès','/profile');
        },
        error : (error : any) =>
        {
          console.log('Erreur au niveau de la page création de caissier')
        },
        complete : () =>
        {
          console.log('Caissier inscrit avec succès')
        }
      }
    );
  }
  ngOnInit(): void
  {
    this.indexDBService.getData('currentUser').subscribe(
      (data) =>
      {
        this.currentSeller = data[0].user.id
        this.shops = data[0].user.shop
      },
      (error) =>
      {
        console.log("Erreur au niveau du composant création de boutique" + error)
      })

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
