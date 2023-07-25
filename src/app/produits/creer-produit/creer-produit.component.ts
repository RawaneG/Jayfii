import { HttpClientService } from 'src/app/services.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { IndexDBService } from 'src/app/index-db.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-creer-produit',
  templateUrl: './creer-produit.component.html',
  styleUrls: ['./creer-produit.component.scss']
})
export class CreerProduitComponent implements OnInit {
  mesCategories: any[] = [];
  showMe: boolean = false;
  panelOpenState = false;
  requiredFile !: string;
  durationInSeconds = 5;
  processedImage: any;
  ajouterProduit: any;
  compose !: boolean;
  currentStore: any;
  maCategorie: any;
  currentShop: any;
  imageData !: any;
  resultSrc !: any;
  monProduit: any;
  composee !: any;
  imageSrc !: any;
  body: any = {};
  value: any;
  url !: any;
  link: any;

  constructor(private _snackBar: MatSnackBar, private formBuilder: FormBuilder, private httpService: HttpClientService, private route: Router, private navigate: ActivatedRoute, private indexDBService: IndexDBService) { }

  retour() {
    this.route.navigate(['../produits']);
  }
  openSnackBar() {
    let action = 'Fermer';
    let message = 'Représente la quantité limite pour pouvoir alerter une rupture de stock ou un stock proche de la rupture';
    this._snackBar.open(message, action);
  }
  readUrl(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageData = reader.result?.toString().split(',')[1];
      this.url = reader.result;
      this.httpService.removeBackground(this.imageData).subscribe(response => {
        const reader = new FileReader();
        reader.readAsDataURL(response);
        reader.onloadend = () => {
          const base64data = reader.result?.toString().split(',')[1];
          this.resultSrc = `data:image/png;base64,${base64data}`;
        };
      });
    };
  }
  submit() {
    this.navigate.paramMap.subscribe(a => {
      this.link = a.get('id');
      if (this.link == null) {
        this.ajouterProduit.value.compose == "true" ? this.compose = true : this.compose = false
        this.body =
        {
          "image": this.resultSrc,
          "compose": this.compose,
          "SKU": this.ajouterProduit.value.SKU,
          "prix": +this.ajouterProduit.value.prix,
          "cout": +this.ajouterProduit.value.cout,
          "quantiteEnStock": +this.ajouterProduit.value.quantiteEnStock,
          "categorie":
            [
              {
                "id": +this.ajouterProduit.value.categorie
              }
            ],
          "nom": this.ajouterProduit.value.nom,
          "couleur": this.ajouterProduit.value.couleur,
          "limite": +this.ajouterProduit.value.limite,
          "description": this.ajouterProduit.value.description,
          "shop":
          {
            "id": this.currentStore
          }
        }
        let emptyInput = 0;
        for (const key in this.ajouterProduit.value)
        {
          if(this.ajouterProduit.value[key] === "" || this.ajouterProduit.value.categorie === null || this.ajouterProduit.value.categorie === undefined)
          {
            emptyInput++;
          }
          console.log(emptyInput)
        }
        if(emptyInput > 0)
        {
          this.httpService.openSnackBar("Veuillez remplir tous les champs","/produits/add");
        }
        else
        {
          this.httpService.create(this.httpService.produitUrl, this.body).subscribe(
            {
              next: () => this.httpService.openSnackBar('Article enregistrée avec succès', 'produits'),
              error: (err: any) => console.log("Une erreur s'est produite lors de l'ajout du produit : " + err.error.detail),
              complete: () => console.log('Ajout avec succès')
            })
        }
      }
      else {
        this.ajouterProduit.value.compose == "true" ? this.compose = true : this.compose = false
        this.body =
        {
          "image": this.resultSrc,
          "compose": this.compose,
          "SKU": this.ajouterProduit.value.SKU,
          "cout": +this.ajouterProduit.value.cout,
          "prix": +this.ajouterProduit.value.prix,
          "quantiteEnStock": +this.ajouterProduit.value.quantiteEnStock,
          "categorie":
            [
              {
                "id": +this.ajouterProduit.value.categorie
              }
            ],
          "nom": this.ajouterProduit.value.nom,
          "couleur": this.ajouterProduit.value.couleur,
          "limite": +this.ajouterProduit.value.limite,
          "description": this.ajouterProduit.value.description,
          "shop":
          {
            "id": this.currentStore
          }
        }
        let emptyInput = 0;
        for (const key in this.ajouterProduit.value)
        {
          if(this.ajouterProduit.value[key] === "" || this.ajouterProduit.value.categorie === null || this.ajouterProduit.value.categorie === undefined)
          {
            emptyInput++;
          }
        }
        if(emptyInput > 0)
        {
          this.httpService.openSnackBar("Veuillez remplir tous les champs",`/produits/modifier/${+this.link}`);
        }
        else
        {
          this.httpService.update(this.httpService.produitUrl, (+this.link), this.body).subscribe(
            {
              next: () => this.httpService.openSnackBar('Article modifiée avec succès', 'produits'),
              error: (err: any) => console.log("Une erreur s'est produite lors de l'ajout du produit : " + err.error.detail),
              complete: () => console.log('Ajout avec succès')
            })
        }
      }
    })
  }
  ngOnInit(): void {
    this.indexDBService.getData('currentShop').subscribe(
      data => {
        this.currentStore = data[0].boutique.id;
        this.httpService.getById(this.httpService.shopUrl, this.currentStore).subscribe(
          boutique => {
            this.currentShop = boutique;
            boutique?.categories?.forEach((element: any) => element.etat == false ? this.mesCategories?.push(element) : null)
          })
      },
      error => console.log('Erreur au niveau du composant produit')
    )
    this.navigate.paramMap.subscribe(a => {
      this.link = a.get('id');
      this.ajouterProduit = this.formBuilder.group(
        {
          "SKU": new FormControl(""),
          'nom': new FormControl(""),
          "prix": new FormControl(""),
          "cout": new FormControl(""),
          "limite": new FormControl(""),
          "compose": new FormControl(""),
          "couleur": new FormControl(""),
          "categorie": new FormControl(""),
          'description': new FormControl(""),
          "quantiteEnStock": new FormControl(""),
        })
      if (this.link === null) {
        this.showMe = false;
        return;
      }
      else {
        this.showMe = true;
        this.httpService.getById(this.httpService.produitUrl, +this.link).subscribe(
          data => {
            this.monProduit = data;
            this.value = this.monProduit.categorie[0].id;
            this.ajouterProduit.controls.categorie.setValue(this.value);
            this.url = 'data:image/png;base64,' + this.monProduit.image;
            this.ajouterProduit.controls.SKU.setValue(this.monProduit.SKU);
            this.ajouterProduit.controls.nom.setValue(this.monProduit.nom);
            this.ajouterProduit.controls.prix.setValue(this.monProduit.prix);
            this.ajouterProduit.controls.cout.setValue(this.monProduit.cout);
            this.ajouterProduit.controls.limite.setValue(this.monProduit.limite);
            this.ajouterProduit.controls.compose.setValue(this.monProduit.compose);
            this.ajouterProduit.controls.couleur.setValue(this.monProduit.couleur);
            this.ajouterProduit.controls.description.setValue(this.monProduit.description);
            this.ajouterProduit.controls.quantiteEnStock.setValue(this.monProduit.quantiteEnStock);
          })
      }
    })
  }
}
