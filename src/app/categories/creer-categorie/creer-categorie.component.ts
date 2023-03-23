import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  link !: any;
  showMe !: boolean;
  maCategorie: any;
  value: any;
  title !: string;

  constructor(private formBuilder : FormBuilder, private httpService : HttpClientService, private route:Router,private navigate : ActivatedRoute) { }

  retour()
  {
    this.route.navigate(['../categories']);
  }
  submit()
  {
    this.navigate.paramMap.subscribe(a =>
      {
        this.link = a.get('id');
        if(this.link == null)
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
        else
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
          this.httpService.putUrl(this.httpService.categorieUrl + '/' + (+this.link),this.body);
          this.httpService.openSnackBar('Catégorie modifiée avec succès', 'categories');
        }
      })
  }
  ngOnInit(): void
  {
    this.currentStore = JSON.parse(localStorage.getItem('boutique') || '[]');
      this.navigate.paramMap.subscribe(a =>
        {
          this.link = a.get('id');
          this.title = "Créer une catégorie";
          this.ajouterCategorie = this.formBuilder.group(
            {
              'nom' : new FormControl(""),
              'description' : new FormControl(""),
              "couleur" : new FormControl("")
            })
          if(this.link === null)
          {
            this.showMe = false;
            return;
          }
          else
          {
            this.title = "Modifier une catégorie";
            this.showMe = true;
            this.httpService.getUrl(this.httpService.categorieUrl).subscribe(
              (reponse) =>
              {
                this.maCategorie = reponse;
                this.maCategorie = this.httpService.getElementById(+this.link, this.maCategorie);
                this.value = this.maCategorie.id;
                this.ajouterCategorie.controls['nom'].setValue(this.maCategorie.nom);
                this.ajouterCategorie.controls['description'].setValue(this.maCategorie.description);
                this.ajouterCategorie.controls['couleur'].setValue(this.maCategorie.couleur);
              });
          }
        });
  }
}
