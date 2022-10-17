import { Component, Input, OnInit } from '@angular/core';
import { HttpClientService } from '../services.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poste-de-vente',
  templateUrl: './poste-de-vente.component.html',
  styleUrls: ['./poste-de-vente.component.scss']
})
export class PosteDeVenteComponent implements OnInit
{
  ajoutee: any;
  monPanier :any[] = [];
  mesProduits : any;
  monTotal : number = 0;
  constructor(private route : Router, private httpService : HttpClientService,private serviceAuth : AuthService) {}

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
          localStorage.setItem('panier', JSON.stringify(this.httpService.items$));
        }
      }
    );
  }
  ngOnInit(): void
  {
    this.monTotal = this.httpService.sousTotal();
    this.httpService.items$.subscribe(value => this.monPanier = value);
    this.httpService.getUrl(this.httpService.produitUrl).subscribe
    (
      (reponse) => {this.mesProduits = reponse}
    );
  }
}
