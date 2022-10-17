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
  compose !: boolean;
  requiredFile !: string;
  panelOpenState = false;
  mesCategories : any;
  ajouterProduit : any;
  body : any = {};
  url !: string | ArrayBuffer | null;

  constructor(private formBuilder : FormBuilder, private httpService : HttpClientService, private route:Router) { }
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
      "nom": this.ajouterProduit.value.nom,
      "description": this.ajouterProduit.value.description,
      "couleur": this.ajouterProduit.value.couleur
    }
    this.httpService.postUrl(this.httpService.produitUrl,this.body);
    this.route.navigateByUrl('produits');
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
