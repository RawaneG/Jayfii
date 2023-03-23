import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { IndexDBService } from '../index-db.service';
import { HttpClientService } from '../services.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit
{
  spin : boolean = true;
  shopCreation !: FormGroup;
  currentUser: any;
  currentSeller: any;
  shops: any;
  currentStore: any;

  constructor( private httpService : HttpClientService, private serviceAuth : AuthService, private formBuilder : FormBuilder, private route : Router, private indexDBService : IndexDBService ) { }

  ngOnInit(): void
  {
    this.spin = false;
    this.indexDBService.getData('currentUser').subscribe(
      (data) =>
      {
        this.currentSeller = data[0].user
        this.shops = data[0].user.shop
      },
      (error) =>
      {
        console.log("Erreur au niveau du composant profil" + error)
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
