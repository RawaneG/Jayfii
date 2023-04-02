import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClientService } from 'src/app/services.service';
import { IndexDBService } from 'src/app/index-db.service';
import { FormControl } from '@angular/forms';
import { Observable, map } from 'rxjs';

@Component(
  {
    selector: 'app-panier',
    templateUrl: './panier.component.html',
    styleUrls: ['./panier.component.scss']
  })
export class PanierComponent implements OnInit {
  @Output() message = new EventEmitter();
  @Input() selected: any;

  auPanier$ !: Observable<any>;
  input = new FormControl(1);
  prixCalculee: number = 1;
  disable: boolean = true;
  monTotal: number = 0;
  monPanier: any[] = [];
  monPrix: number = 0;
  quantite !: number;
  ajoutee: any;
  id: any = 0;

  constructor(private httpService: HttpClientService, private indexDBService: IndexDBService) { }

  ajoutQuantite(produit: any) {
    if (this.input.value === null || +this.input.value <= 0) {
      this.monTotal = 0
      this.input.setValue(1);
      this.prixCalculee = 1;
      this.httpService.items$.subscribe(
        data => {
          this.monPanier = data;
          this.monPanier.forEach((value) => this.monTotal += value.prix * value.quantite)
          this.message.emit(this.monTotal);
        }
      )
    }
    else {
      this.monTotal = 0;
      this.prixCalculee = +this.input.value;
      this.httpService.items$
        .pipe(
          map(productsParam => {
            let selectedProduct = productsParam.filter(ceProduit => ceProduit === produit);
            if (selectedProduct[0].quantiteEnStock >= this.prixCalculee) {
              let resteEnStock = selectedProduct[0].quantiteEnStock - this.prixCalculee;
              resteEnStock === 0 ? this.httpService.openSnackBar(`Le stock de ce produit est épuisé`, "poc") : resteEnStock <= selectedProduct[0].limite ? this.httpService.openSnackBar(`Attention il reste ${resteEnStock} en stock`, "poc") : null;
              selectedProduct[0].quantiteStockTemp = resteEnStock;
              selectedProduct[0].quantite = this.prixCalculee;
            }
            else {
              this.httpService.openSnackBar(`Vous avez dépassé la quantité en stock`, "poc")
            }
          }),
        )
        .subscribe(
          {
            next: () => null,
            complete: () => console.log('complete')
          }
        );
      this.httpService.items$.subscribe(
        data => {
          this.monPanier = data;
          this.monPanier.forEach((value) => this.monTotal += value.prix * value.quantite)
          this.message.emit(this.monTotal);
        }
      )
    }
  }
  close(produit: any) {
    this.monTotal = 0;
    this.httpService.items$
      .pipe(
        map(mesProduits => {
          this.monPanier = mesProduits;
          let selectedProduct = this.monPanier.findIndex(monProduit => monProduit === produit);
          this.monPanier.splice(selectedProduct, 1);
          this.indexDBService.putData({ id: this.id, panier: this.monPanier }, 'panier').subscribe(
            {
              next: () => this.httpService.alert('Produit supprimé du panier avec succès'),
              complete: () => console.log("Suppression complete")
            });
          this.monPanier.forEach((value) => this.monTotal += value.prix)
          this.message.emit(this.monTotal);
        })
      ).subscribe()
  }
  ngOnInit(): void {
    this.httpService.items$.subscribe(
      (data) => {
        this.monPanier = data;
        this.monPanier.forEach((value) => this.monTotal += value.prix * value.quantite)
        this.message.emit(this.monTotal);
      }
    )
  }
}
