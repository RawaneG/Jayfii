import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from 'src/app/services.service';
import { IndexDBService } from 'src/app/index-db.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-shop',
  templateUrl: './create-shop.component.html',
  styleUrls: ['./create-shop.component.scss']
})
export class CreateShopComponent implements OnInit
{
  url !: string | ArrayBuffer | null;
  shopCreation !: FormGroup;
  currentSeller: any;
  currentStore: any;
  currentUser: any;
  body : any;
  shops: any;

  constructor( private httpService : HttpClientService, private formBuilder : FormBuilder, private route : Router, private indexDBService : IndexDBService ) { }

  retour()
  {
    this.route.navigate(['../profile']);
  }

  readUrl(event:any)
  {
    if (event.target.files && event.target.files[0])
    {
      var reader = new FileReader();
      reader.onload = (event: ProgressEvent) => this.url = (<FileReader>event.target).result
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
    this.httpService.create(this.httpService.shopUrl  , this.body).subscribe(
      {
        next : (value : any) => this.httpService.openSnackBar('Boutique créee avec succès','/profile'),
        error : (error : any) => console.log('Erreur au niveau de la page de création de boutique'),
        complete : () => console.log('Boutique créee avec succès')
      }
    );
  }

  ngOnInit(): void
  {
    this.indexDBService.getData('currentUser').subscribe(
      (data) => this.currentSeller = data[0].user.id,
      (error) => console.log("Erreur au niveau du composant création de boutique" + error))

    this.shopCreation  =  this.formBuilder.group(
      {
        nom: ['', Validators.required],
        link: ['', Validators.required],
        image: ['', Validators.required],
        adresse: ['', Validators.required],
      });
  }
}
