import { Component, Input, OnInit } from '@angular/core';
import { HttpClientService } from '../services.service';

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
  constructor(private httpService : HttpClientService) {}

  closeAll()
  {
    this.httpService.items$.subscribe(
      value =>
      {
          this.monPanier = [];
          localStorage.setItem('panier', JSON.stringify(this.monPanier));
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
