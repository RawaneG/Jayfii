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
  @Output() event = new EventEmitter<number>();
  @Input() selected : any;
  ajoutee: any;
  monPanier: any[] = [];
  quantite : number = 1;
  monPrix : any;
  disable : boolean = true;
  monTotal : number = 0;
  constructor(private httpService : HttpClientService) { }
  incremente()
  {
    this.quantite++;
    this.httpService.incremente();
  }
  decremente()
  {
    this.quantite--;
    this.httpService.decremente();
  }
  close(produit : any)
  {
    this.httpService.items$.subscribe(
      value =>
      {
        this.monPanier = value;
        this.ajoutee = value.find(prod => prod.id === produit.id);
        this.monPanier.splice(this.ajoutee, 1);
        localStorage.setItem('panier', JSON.stringify(this.monPanier));
      }
    );
  }
  ngOnInit(): void
  {
    this.httpService.items$.subscribe(
      value =>
      {
        this.quantite = value[0].quantite
      }
    );
  }

}
