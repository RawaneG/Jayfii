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
export class CreateShopComponent implements OnInit
{
  body : any;
  shopCreation !: FormGroup;
  url !: string | ArrayBuffer | null;
  currentUser: any;
  currentStore: any;
  shops: any;
  currentSeller: any;

  constructor( private httpService : HttpClientService, private serviceAuth : AuthService, private formBuilder : FormBuilder, private route : Router ) { }

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
    this.route.navigate(['/profile']);
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
          this.currentSeller = this.currentUser.id;
        }
        else
        {
          this.currentSeller = value.find((param : any) => param.email === this.currentUser.username)
          this.currentSeller = this.currentSeller.id;
        }
      }
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
