import { Component, Input, OnInit } from '@angular/core';
import { HttpClientService } from '../services.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
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
  mesProduits : any[] = [];
  monTotal !: number;
  form !: FormGroup;
  montant !: number;
  reste : number = 0;
  confirmer : boolean = false;
  body : any;
  tabCommandes : any = [];
  intermediaire : any = [];
  tabEntier : any = [];
  produit !: { quantiteEnStock: any; };
  receipt: any = [];
  currentStore: any;
  currentShop: any;
  currentUser: any;
  currentCashier: any;

  constructor(private formBuilder: FormBuilder, private httpService : HttpClientService,private serviceAuth : AuthService, public location: Location) {}
  open()
  {
    document.querySelector('.first-popup')?.classList.remove('hidden');
  }
  ouvre()
  {
    document.querySelector('.second-popup')?.classList.remove('hidden');
  }
  ferme()
  {
    document.querySelector('.first-popup')?.classList.add('hidden');
  }
  close()
  {
    document.querySelector('.second-popup')?.classList.add('hidden');
  }
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
                "id" : element.id,
                "nom" : element.nom
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
      "ligneDeCommandes": this.getProduct(),
      "shop" :
      {
        "id" : this.currentStore.id
      }
    }
    localStorage.setItem('reçu',JSON.stringify(this.body));
    this.httpService.items$.subscribe((value : any) =>
    {
      this.mesProduits = value;
      this.mesProduits.forEach((element : any) =>
      {
        this.produit =
        {
          "quantiteEnStock" : element.quantiteEnStock
        }
        this.httpService.putUrl(this.httpService.produitUrl + '/' + element.id ,this.produit);
      });
    }
    )
    this.httpService.postUrl(this.httpService.commandeUrl,this.body);
    localStorage.removeItem('panier');
    setTimeout(() =>
    {

    }, 500);
    location.reload();
    this.ouvre();
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
          if(produit.quantiteEnStock == 0)
          {
            return;
          }
          else
          {
            this.httpService.addToCart(produit);
            this.monTotal = this.httpService.sousTotal();
          }
        }
        else
        {
          if(this.ajoutee.quantiteEnStock == 0)
          {
            return;
          }
          else
          {
            this.httpService.incremente(this.ajoutee);
            this.monTotal = this.httpService.sousTotal();
          }
        }
      }
    );
  }
  ngOnInit(): void
  {
    this.form = this.formBuilder.group(
    {
      montant: [""]
    });

    // -- Mise à Jour du Sous total du panier
    this.monTotal = this.httpService.sousTotal();

    // -- Gestion du reçu
    this.receipt = JSON.parse(localStorage.getItem('reçu') || '[]');
    this.httpService.getUrl(this.httpService.commandeUrl).subscribe
    (
      reponse =>
      {
        this.receipt.date = reponse[reponse.length - 1].date;
        this.receipt.methodePaiement = reponse[reponse.length - 1].methodePaiement.valeur;
      }
    )
    this.httpService.items$.subscribe(value =>
    {
      this.monPanier = value;
    });

    // -- Affichage de la boutique affectée au caissier
    this.currentUser = JSON.parse(localStorage.getItem('ACCESS_TOKEN') || '[]');
    if(this.currentUser.roles[0] == 'ROLE_CAISSIER')
    {
      this.httpService.getUrl(this.httpService.cashierUrl).subscribe(
        (caissier) =>
        {
          this.currentCashier = caissier.find((param : any) => param.email === this.currentUser.username)
          this.mesProduits = this?.currentCashier?.shop?.produit;
        }
      )
    }

    // -- Liste des produits de la boutique courrante
    this.currentStore = JSON.parse(localStorage.getItem('boutique') || '[]');
    this.httpService.getUrl(this.httpService.shopUrl).subscribe
    (
      (reponse) =>
      {
        this.currentShop = this.httpService.getElementById(this.currentStore.id, reponse);
        this.currentShop.produit.forEach((element : any) =>
        {
          if(element.etat == false)
          {
            this.mesProduits.push(element);
          }
        });
      }
    );
  }
}
