import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClientService } from 'src/app/services.service';
import { FormControl } from '@angular/forms';

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

  quantite !: number;
  ajoutee: any;
  monPanier: any[] = [];
  monPrix : any;
  disable : boolean = true;
  monTotal !: number;
  input = new FormControl(1);
  prixCalculee : number = 1;

  constructor(private httpService : HttpClientService) { }

  ajoutQuantite(panier : any)
  {
    if(this.input.value === null  || +this.input.value < 0)
    {
      this.input.setValue(1);
      this.prixCalculee = 1;
    }
    else
    {
      this.prixCalculee = +this.input.value;
    }
  }
  incremente(element : any)
  {
    this.quantite++;
    this.httpService.incremente(element);
    // this.message.emit(this.monTotal);
  }
  decremente(element : any)
  {
    this.quantite--;
    this.httpService.decremente(element);
    // this.message.emit(this.monTotal);
  }
  close(produit : any)
  {
    // this.httpService.items$.subscribe(
    //   value =>
    //   {
    //     this.monPanier = value;
    //     this.ajoutee = value.findIndex(prod => prod.id === produit.id);
    //     this.monPanier.splice(this.ajoutee, 1);
    //     this.message.emit(this.monTotal);
    //   }
    // );
  }
  ngOnInit(): void
  {
  }
}
