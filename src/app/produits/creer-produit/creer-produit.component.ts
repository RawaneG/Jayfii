import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router , ActivatedRoute } from '@angular/router';
import { IndexDBService } from 'src/app/index-db.service';
import { HttpClientService } from 'src/app/services.service';

@Component({
  selector: 'app-creer-produit',
  templateUrl: './creer-produit.component.html',
  styleUrls: ['./creer-produit.component.scss']
})
export class CreerProduitComponent implements OnInit
{
  showMe : boolean = false;
  compose !: boolean;
  requiredFile !: string;
  panelOpenState = false;
  mesCategories : any[] = [];
  ajouterProduit : any;
  body : any = {};
  url !: string | ArrayBuffer | null;
  link : any;
  monProduit: any;
  maCategorie: any;
  value: any;
  composee !: any;
  currentStore: any;
  durationInSeconds = 5;
  currentShop: any;

  constructor(private _snackBar: MatSnackBar, private formBuilder : FormBuilder, private httpService : HttpClientService, private route:Router, private navigate : ActivatedRoute, private indexDBService : IndexDBService) { }

  retour()
  {
    this.route.navigate(['../produits']);
  }
  openSnackBar()
  {
    let message = 'Représente la quantité limite pour pouvoir alerter une rupture de stock ou un stock proche de la rupture';
    let action = 'Fermer';
    this._snackBar.open(message, action);
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
  submit()
  {
    this.navigate.paramMap.subscribe(a =>
      {
        this.link = a.get('id');
        if(this.link == null)
        {
          if (this.ajouterProduit.value.compose == "true")
          {
            this.compose = true;
          }
          else
          {
            this.compose = false;
          }
          this.body =
          {
            "prix": +this.ajouterProduit.value.prix,
            "cout": +this.ajouterProduit.value.cout,
            "quantiteEnStock": +this.ajouterProduit.value.quantiteEnStock,
            "image": this.url,
            "compose": this.compose,
            "SKU": this.ajouterProduit.value.SKU,
            "categorie":
            [
              {
                  "id" : +this.ajouterProduit.value.categorie
              }
            ],
            "limite" : +this.ajouterProduit.value.limite,
            "nom": this.ajouterProduit.value.nom,
            "description": this.ajouterProduit.value.description,
            "couleur": this.ajouterProduit.value.couleur,
            "shop" :
            {
              "id" : this.currentStore
            }
          }
          this.httpService.create(this.httpService.produitUrl,this.body).subscribe(
            {
              next: (value : any) =>
              {
                this.httpService.openSnackBar('Article enregistrée avec succès','produits');
              },
              error: (error : any) =>
              {
                console.log("Une erreur s'est produite lors de l'ajout du produit");
              },
              complete: () =>
              {
                console.log('Ajout avec succès')
              }
            }
          )
        }
        else
        {
          if (this.ajouterProduit.value.compose == "true")
          {
            this.compose = true;
          }
          else
          {
            this.compose = false;
          }
          this.body =
          {
            "prix": +this.ajouterProduit.value.prix,
            "cout": +this.ajouterProduit.value.cout,
            "quantiteEnStock": +this.ajouterProduit.value.quantiteEnStock,
            "image": this.url,
            "compose": this.compose,
            "SKU": this.ajouterProduit.value.SKU,
            "categorie":
            [
              {
                  "id" : +this.ajouterProduit.value.categorie
              }
            ],
            "limite" : +this.ajouterProduit.value.limite,
            "nom": this.ajouterProduit.value.nom,
            "description": this.ajouterProduit.value.description,
            "couleur": this.ajouterProduit.value.couleur,
            "shop" :
            {
              "id" : this.currentStore
            }
          }
          this.httpService.update(this.httpService.produitUrl, (+this.link), this.body).subscribe(
            {
              next: (value : any) =>
              {
                this.httpService.openSnackBar('Article modifiée avec succès','produits');
              },
              error: (error : any) =>
              {
                console.log("Une erreur s'est produite lors de l'ajout du produit");
              },
              complete: () =>
              {
                console.log('Ajout avec succès')
              }
            }
          );
        }
      }
    )
  }
  ngOnInit(): void
  {
    this.indexDBService.getData('currentShop').subscribe(
      (data) =>
      {
        this.currentStore = data[0].boutique.id;
        this.httpService.getById(this.httpService.shopUrl, this.currentStore).subscribe(
          boutique =>
          {
            this.currentShop = boutique;
            boutique?.categories?.forEach((element: any) =>
            {
              element.etat == false ? this.mesCategories?.push(element) : null;
            });
          }
        )
      },
      (error) =>
      {
        console.log('Erreur au niveau du composant produit')
      }
    )
    this.navigate.paramMap.subscribe(a =>
      {
        this.link = a.get('id');
        this.ajouterProduit = this.formBuilder.group(
          {
            'nom' : new FormControl(""),
            'description' : new FormControl(""),
            "couleur" : new FormControl(""),
            "prix": new FormControl(""),
            "cout": new FormControl(""),
            "quantiteEnStock": new FormControl(""),
            "compose": new FormControl(""),
            "SKU": new FormControl(""),
            "categorie": new FormControl(""),
            "limite" : new FormControl("")
          })
        if(this.link === null)
        {
          this.showMe = false;
          return;
        }
        else
        {
          this.showMe = true;
          this.httpService.getById(this.httpService.produitUrl, +this.link).subscribe(
            data =>
            {
              this.monProduit = data;
              this.url = 'data:image/png;base64,' + this.monProduit.image;
              this.value = this.monProduit.categorie[0].id;
              this.ajouterProduit.controls.nom.setValue(this.monProduit.nom);
              this.ajouterProduit.controls.description.setValue(this.monProduit.description);
              this.ajouterProduit.controls.couleur.setValue(this.monProduit.couleur);
              this.ajouterProduit.controls.prix.setValue(this.monProduit.prix);
              this.ajouterProduit.controls.cout.setValue(this.monProduit.cout);
              this.ajouterProduit.controls.quantiteEnStock.setValue(this.monProduit.quantiteEnStock);
              this.ajouterProduit.controls.compose.setValue(this.monProduit.compose);
              this.ajouterProduit.controls.SKU.setValue(this.monProduit.SKU);
              this.ajouterProduit.controls.categorie.setValue(this.value);
              this.ajouterProduit.controls.limite.setValue(this.monProduit.limite);
            }
          );
        }
      });
  }
}
