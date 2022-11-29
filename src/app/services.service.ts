import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, take } from 'rxjs';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService
{
  loginUrl = 'https://127.0.0.1:8000/api/login';
  cashierUrl = 'https://127.0.0.1:8000/api/caissiers';
  produitUrl = 'https://127.0.0.1:8000/api/produits';
  categorieUrl = 'https://127.0.0.1:8000/api/categories';
  commandeUrl = 'https://127.0.0.1:8000/api/commandes';
  shopUrl = 'https://127.0.0.1:8000/api/shops';
  boutiquierUrl = 'https://127.0.0.1:8000/api/boutiquiers';

  monTotalService: any = 0;
  quantite: number = 1;
  itemsSubject = new BehaviorSubject<any[]>([]);
  items$ = this.itemsSubject.asObservable();
  tab!: any[];
  myUser: any;
  user: any;
  produit: any;

  constructor(private http: HttpClient, private route: Router, private _snackBar: MatSnackBar)
  {
    let existingCartItems = JSON.parse(localStorage.getItem('panier') || '[]');
    if (!existingCartItems) {
      existingCartItems = [];
    }
    this.itemsSubject.next(existingCartItems);
  }
  openSnackBar(message : any, navigation : string = '')
  {
    let t = 2000;
    this._snackBar.open(message, '',
    {
      duration : t
    });
    if(navigation == '')
    {
      setTimeout(() => {
        location.reload()
      }, 2200)
    }
    else
    {
      setTimeout(() =>
      {
        this.route.navigateByUrl(navigation);
      }, 2200);
    }
  }
  /**************************************** Authentification ******** **************************/
  login(body: any) {
    this.http.post(this.loginUrl, body).subscribe((token) => {
      this.myUser = this.getDecodedAccessToken(JSON.stringify(token));
      if (this.myUser != undefined) {
        localStorage.setItem('ACCESS_TOKEN', JSON.stringify(this.myUser));
        this.route.navigateByUrl('poc');
      }
    });
  }
  /**************************************** Obtenir le token d'authentification **************************/
  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
  /**************************************** Récupération des Observables ******** **************************/
  putUrl(url: any, body: any) {
    this.http.put(url, body).subscribe();
  }
  /**************************************** Récupération des Observables ******** **************************/
  postUrl(url: any, body: any) {
    this.http.post(url, body).subscribe();
  }
  /**************************************** Récupération des Observables ******** **************************/
  getUrl(url: any): Observable<any> {
    return this.http.get<any[]>(url);
  }
  /**************************************** Transition Observable en tableau *****************************/
  obsToTab(observable: any) {
    this.getUrl(observable).subscribe((value) => {
      this.tab = value;
    });
    return this.tab;
  }
  /**************************************** Recherche d'un produit par Id ****** **************************/
  getElementById(id: number, tableau: any) {
    return tableau.find((param: any) => param.id === id);
  }
  /**************************************** Ajouter au panier ****** **********************************/
  addToCart(productParam: any) {
    this.items$
      .pipe(
        take(1),
        map((productsParam) => {
          productParam.quantite = 1;
          productParam.quantiteEnStock--;
          productsParam.push(productParam);
          this.monTotalService = this.sousTotal();
          localStorage.setItem('panier', JSON.stringify(productsParam));
        })
      )
      .subscribe();
  }
  /**************************************** Incrémentation *************************************************/
  incremente(element: any) {
    this.items$
      .pipe(
        take(1),
        map((productsParam) => {
          this.produit = productsParam.findIndex(
            (param: any) => param.id === element.id
          );
          productsParam[this.produit].quantite++;
          productsParam[this.produit].quantiteEnStock--;
          this.monTotalService = this.sousTotal();
          localStorage.setItem('panier', JSON.stringify(productsParam));
        })
      )
      .subscribe();
  }
  /**************************************** Décrementation *************************************************/
  decremente(element: any) {
    this.items$
      .pipe(
        take(1),
        map((productsParam) => {
          this.produit = productsParam.findIndex(
            (param: any) => param.id === element.id
          );
          productsParam[this.produit].quantite--;
          productsParam[this.produit].quantiteEnStock++;
          this.monTotalService = this.sousTotal();
          localStorage.setItem('panier', JSON.stringify(productsParam));
        })
      )
      .subscribe();
  }
  /****************************************** Sous-Total *************************************************/
  sousTotal() {
    let total = 0;
    this.items$.subscribe((valeur) =>
      valeur.forEach((element) => (total += element.quantite * element.prix))
    );
    return total;
  }
}
