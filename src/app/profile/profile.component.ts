import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IndexDBService } from '../index-db.service';
import { Component, OnInit } from '@angular/core';

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

  constructor(private formBuilder : FormBuilder, private indexDBService : IndexDBService ) { }

  ngOnInit(): void
  {
    this.indexDBService.getData('currentUser').subscribe(
      data =>
      {
        this.currentSeller = data[0].user
        this.shops = data[0].user.shop
        this.spin = false
      },
      error => console.log("Erreur au niveau du composant profil" + error))

    this.shopCreation  =  this.formBuilder.group(
      {
        adresse: ['', Validators.required],
        image: ['', Validators.required],
        link: ['', Validators.required],
        nom: ['', Validators.required],
      });
  }
}
