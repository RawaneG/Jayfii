import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, take } from 'rxjs';
import { HttpClientService } from 'src/app/services.service';

@Component({
  selector: 'app-panier',
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.scss']
})
export class PanierComponent implements OnInit
{
  @Output() message = new EventEmitter();
  @Input() selected : any;
  @Input() quantite !: number;
  ajoutee: any;
  monPanier: any[] = [];
  monPrix : any;
  disable : boolean = true;
  monTotal !: number;
  constructor(private httpService : HttpClientService) { }
  incremente(element : any)
  {
    this.quantite++;
    this.httpService.incremente(element);
    this.monTotal = this.httpService.sousTotal();
    this.message.emit(this.monTotal);
  }
  decremente(element : any)
  {
    this.quantite--;
    this.httpService.decremente(element);
    this.monTotal = this.httpService.sousTotal();
    this.message.emit(this.monTotal);
  }
  close(produit : any)
  {
    this.httpService.items$.subscribe(
      value =>
      {
        this.monPanier = value;
        this.ajoutee = value.findIndex(prod => prod.id === produit.id);
        this.monPanier.splice(this.ajoutee, 1);
        this.monTotal = this.httpService.sousTotal();
        this.message.emit(this.monTotal);
        localStorage.setItem('panier', JSON.stringify(this.monPanier));
      }
    );
  }
  ngOnInit(): void
  {
    this.monTotal = this.httpService.sousTotal();
    this.quantite = this.selected.quantite;
  }
}
