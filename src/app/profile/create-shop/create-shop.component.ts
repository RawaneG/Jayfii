import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { IndexDBService } from 'src/app/index-db.service';
import { HttpClientService } from 'src/app/services.service';

@Component({
  selector: 'app-create-shop',
  templateUrl: './create-shop.component.html',
  styleUrls: ['./create-shop.component.scss']
})
export class CreateShopComponent implements OnInit
{
  body : any;
  shopCreation !: FormGroup;
  url !: string | ArrayBuffer | null;
  currentUser: any;
  currentStore: any;
  shops: any;
  currentSeller: any;

  constructor( private httpService : HttpClientService, private serviceAuth : AuthService, private formBuilder : FormBuilder, private route : Router, private indexDBService : IndexDBService ) { }

  retour()
  {
    this.route.navigate(['../profile']);
  }


  readUrl(event:any)
  {
    if (event.target.files && event.target.files[0])
    {
      var reader = new FileReader();
      reader.onload = (event: ProgressEvent) =>
      {
        this.url = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  creation()
  {
    this.body =
    {
      "nomBoutique": this.shopCreation.value.nom,
      "lienBoutique": this.shopCreation.value.link,
      "adresse": this.shopCreation.value.adresse,
      "imageBoutique": this.url,
      "boutiquier":
      {
          "id" : this.currentSeller
      }
    };
    this.httpService.postUrl(this.httpService.shopUrl  , this.body);
    this.httpService.openSnackBar('Boutique créee avec succès','/profile');
  }

  ngOnInit(): void
  {
    this.indexDBService.getData('currentUser').subscribe(
      (data) =>
      {
        this.currentSeller = data[0].user.id
      },
      (error) =>
      {
        console.log("Erreur au niveau du composant création de boutique" + error)
      })

    this.shopCreation  =  this.formBuilder.group(
      {
        nom: ['', Validators.required],
        link: ['', Validators.required],
        adresse: ['', Validators.required],
        image: ['', Validators.required],
      });
  }

}
