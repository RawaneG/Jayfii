import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientService } from 'src/app/services.service';

@Component({
  selector: 'app-creer-produit',
  templateUrl: './creer-produit.component.html',
  styleUrls: ['./creer-produit.component.scss']
})
export class CreerProduitComponent implements OnInit
{
  panelOpenState = false;
  mesCategories : any;
  ajouterProduit : any;
  body : any = {};
  constructor(private formBuilder : FormBuilder, private httpService : HttpClientService, private route:Router) { }
  submit()
  {
    this.body =
    {
      "prix": this.ajouterProduit.value.prix,
      "cout": this.ajouterProduit.value.cout,
      "quantiteEnStock": this.ajouterProduit.value.quantiteEnStock,
      "compose": this.ajouterProduit.value.compose,
      "SKU": this.ajouterProduit.value.SKU,
      "categorie":
      [
        {
            "id" : 3
        }
      ],
      "nom": this.ajouterProduit.value.nom,
      "description": this.ajouterProduit.value.description,
      "couleur": this.ajouterProduit.value.couleur
    }
    console.log(this.ajouterProduit);
    // this.httpService.postUrl(this.httpService.categorieUrl,this.body);
    // this.route.navigateByUrl('produits');
  }
  ngOnInit(): void
  {
    this.httpService.getUrl(this.httpService.categorieUrl).subscribe
    (
      (reponse) => {this.mesCategories = reponse}
    );

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
      })
  }
}
