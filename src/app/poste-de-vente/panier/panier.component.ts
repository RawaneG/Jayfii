import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClientService } from 'src/app/services.service';
import { FormControl } from '@angular/forms';
import { Observable, tap, take } from 'rxjs';
import { IndexDBService } from 'src/app/index-db.service';

@Component(
{
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss']
})
export class PanierComponent implements OnInit
{
  @Output() message = new EventEmitter();
  @Input() selected : any;

  auPanier$ !: Observable<any>;
  input = new FormControl(1);
  prixCalculee : number = 1;
  disable : boolean = true;
  monTotal : number = 0;
  monPanier: any[] = [];
  monPrix : number = 0;
  quantite !: number;
  ajoutee: any;
  id: any = 0;

  constructor(private httpService : HttpClientService, private indexDBService : IndexDBService) { }

  ajoutQuantite(produit : any)
  {
    if(this.input.value === null  || +this.input.value < 0)
    {
      this.input.setValue(1);
      this.prixCalculee = 1;
    }
    else
    {
      this.prixCalculee = +this.input.value;
      this.httpService.increaseQuantity(produit, +this.input.value)
    }
  }
  close(produit : any)
  {
    this.monTotal = 0;
    this.httpService.items$.subscribe(
      value =>
      {
        this.monPanier = value;
        this.ajoutee = value.find(prod => prod.id === produit.id);
        this.monPanier.splice(this.ajoutee, 1);
        this.indexDBService.putData({ id : this.id, panier : this.monPanier } , 'panier').subscribe(
          {
            next : (value : any) =>
            {
              this.httpService.alert('Produit supprimé du panier avec succès')
            },
            complete : () =>
            {
              console.log("Suppression complete")
            }
        });
        this.monPanier.forEach((value) =>
        {
          this.monTotal += value.prix
        })
        this.message.emit(this.monTotal);
      }
    );
  }
  ngOnInit(): void
  {
    this.httpService.items$.subscribe(
      (data) =>
      {
        this.monPanier = data;
        this.monPanier.forEach((value) =>
        {
          this.monTotal += value.prix
        })
        this.message.emit(this.monTotal);
      }
    )
  }
}
