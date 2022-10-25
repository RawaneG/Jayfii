import { Component, Input, OnInit } from '@angular/core';
import { HttpClientService } from '../services.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-poste-de-vente',
  templateUrl: './poste-de-vente.component.html',
  styleUrls: ['./poste-de-vente.component.scss']
})
export class PosteDeVenteComponent implements OnInit
{
  maQuantite : any;
  ajoutee: any;
  monPanier :any[] = [];
  mesProduits : any;
  monTotal !: number;
  show: boolean = false;
  form !: FormGroup;
  montant !: number;
  reste : number = 0;
  confirmer : boolean = false;
  body : any;
  tabCommandes : any = [];
  intermediaire : any = [];
  tabEntier : any = [];
  constructor(private formBuilder: FormBuilder,private route : Router, private httpService : HttpClientService,private serviceAuth : AuthService) {}

  messageRecu(event : any)
  {
    this.monTotal = event;
  }
  getProduct()
  {
    this.httpService.items$.subscribe
    (
      reponse =>
      {
        this.tabCommandes = reponse;
        this.tabCommandes.forEach((element : any) =>
        {
          this.intermediaire =
          {
            "quantite" : element.quantite,
            "prix" : element.prix,
            "produit" :
            {
                "id" : element.id
            }
          }
          this.tabEntier.push(this.intermediaire);
        });
      }
    )
    return this.tabEntier;
  }
  confirmerPaiement()
  {
    this.body =
    {
      "prixCommande": this.monTotal,
      "montant": this.montant,
      "reste": this.reste,
      "methodePaiement":
      {
        "id" : 1
      },
      "client":
      {
        "id" : 3
      },
      "boutiquier":
      {
        "id" : 1
      },
      "ligneDeCommandes": this.getProduct()
    }
    this.httpService.postUrl(this.httpService.commandeUrl,this.body);
    localStorage.removeItem('panier');
    alert("Vente effectué avec succès");
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
  ecriture()
  {
    this.montant = +this.form.controls['montant'].value;
    if(this.montant >= this.monTotal && !isNaN(this.montant))
    {
      this.reste = this.montant - this.monTotal;
      this.confirmer = true;
    }
    else
    {
      this.reste = 0;
      this.confirmer = false;
    }
  }
  logout()
  {
    this.serviceAuth.deconnecter();
  }
  closeAll()
  {
    this.httpService.items$.subscribe(
      value =>
      {
          localStorage.removeItem('panier');
          location.reload();
          this.monTotal = this.httpService.sousTotal();
      }
    );
  }
  panier(produit : any)
  {
    this.httpService.items$.subscribe(
      value =>
      {
        this.ajoutee = value.find(prod => prod.id === produit.id);
        if (this.ajoutee === undefined)
        {
          this.httpService.addToCart(produit);
          this.monTotal = this.httpService.sousTotal();
        }
        else
        {
          this.httpService.incremente(this.ajoutee);
          this.maQuantite = this.ajoutee.quantite;
          this.monTotal = this.httpService.sousTotal();
        }
      }
    );
  }
  paiement()
  {
    this.show = true;
  }
  ferme()
  {
    this.show = false;
  }
  ngOnInit(): void
  {
    this.form = this.formBuilder.group(
    {
      montant: [""]
    });
    this.monTotal = this.httpService.sousTotal();
    this.httpService.items$.subscribe(value =>
      {
        this.monPanier = value;
      });
    this.httpService.getUrl(this.httpService.produitUrl).subscribe
    (
      (reponse) => {this.mesProduits = reponse}
    );
  }
}
