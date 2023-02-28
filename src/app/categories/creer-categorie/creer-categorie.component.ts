import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientService } from 'src/app/services.service';

@Component({
  selector: 'app-creer-categorie',
  templateUrl: './creer-categorie.component.html',
  styleUrls: ['./creer-categorie.component.scss']
})

export class CreerCategorieComponent implements OnInit
{
  ajouterCategorie : FormGroup = new FormGroup({});
  body : any = {};
  currentStore: any;
  constructor(private formBuilder : FormBuilder, private httpService : HttpClientService, private route:Router) { }

  retour()
  {
    this.route.navigate(['../categories']);
  }
  submit()
  {
    this.body =
    {
      "nom" : this.ajouterCategorie.value.nom,
      "description" : this.ajouterCategorie.value.description,
      "couleur" : this.ajouterCategorie.value.couleur,
      "shop" :
      {
        "id" : this.currentStore.id
      }
    }
    this.httpService.postUrl(this.httpService.categorieUrl,this.body);
    this.httpService.openSnackBar('Catégorie enregistrée avec succès', 'categories');
  }
  ngOnInit(): void
  {
    this.currentStore = JSON.parse(localStorage.getItem('mesProduits') || '[]');
    this.ajouterCategorie = this.formBuilder.group(
      {
        'nom' : new FormControl(""),
        'description' : new FormControl(""),
        "couleur" : new FormControl("")
      })
  }
}
