import { FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { HttpClientService } from 'src/app/services.service';
import { IndexDBService } from 'src/app/index-db.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-creer-categorie',
  templateUrl: './creer-categorie.component.html',
  styleUrls: ['./creer-categorie.component.scss']
})

export class CreerCategorieComponent implements OnInit
{
  ajouterCategorie : FormGroup = new FormGroup({});
  currentStore: any;
  showMe !: boolean;
  maCategorie: any;
  body : any = {};
  title !: string;
  link !: any;
  value: any;

  constructor(private formBuilder : FormBuilder, private httpService : HttpClientService, private route : Router,private navigate : ActivatedRoute, private indexDBService : IndexDBService) { }

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
              "id" : this.currentStore
            }
          }
          this.httpService.create(this.httpService.categorieUrl,this.body).subscribe(
            {
              next: (value : any) => this.httpService.openSnackBar('Catégorie enregistrée avec succès', 'categories'),
              error: (error : any) => console.log("Une erreur s'est produite lors de l'ajout du produit"),
              complete: () => console.log('Ajout avec succès')
            });
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
              "id" : this.currentStore
            }
          }
          this.httpService.update(this.httpService.categorieUrl, (+this.link) ,this.body).subscribe(
            {
              next: (value : any) => this.httpService.openSnackBar('Catégorie modifiée avec succès', 'categories'),
              error: (error : any) => console.log("Une erreur s'est produite lors de la modification du produit"),
              complete: () => console.log('Modification avec succès')
            });
        }
      })
  }
  ngOnInit(): void
  {
      this.indexDBService.getData('currentShop').subscribe((data) => this.currentStore = data[0].boutique.id)
      this.navigate.paramMap.subscribe(a =>
        {
          this.link = a.get('id');
          this.title = "Créer une catégorie";
          this.ajouterCategorie = this.formBuilder.group(
            {
              'nom' : new FormControl(""),
              "couleur" : new FormControl(""),
              'description' : new FormControl(""),
            })
          if(this.link === null)
          {
            this.showMe = false;
            return;
          }
          else
          {
            this.showMe = true;
            this.title = "Modifier une catégorie";
            this.httpService.getById(this.httpService.categorieUrl, +this.link).subscribe(
              (reponse) =>
              {
                this.maCategorie = reponse;
                this.value = this.maCategorie.id;
                this.ajouterCategorie.controls['nom'].setValue(this.maCategorie.nom);
                this.ajouterCategorie.controls['couleur'].setValue(this.maCategorie.couleur);
                this.ajouterCategorie.controls['description'].setValue(this.maCategorie.description);
              });
          }
        });
  }
}
