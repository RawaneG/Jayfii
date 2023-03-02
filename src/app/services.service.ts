import { BehaviorSubject, map, Observable, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService
{
  // loginUrl = 'http://77.241.86.134/Jayfii_API/public/index.php/api/login';
  // cashierUrl = 'http://77.241.86.134/Jayfii_API/public/index.php/api/caissiers';
  // produitUrl = 'http://77.241.86.134/Jayfii_API/public/index.php/api/produits';
  // categorieUrl = 'http://77.241.86.134/Jayfii_API/public/index.php/api/categories';
  // commandeUrl = 'http://77.241.86.134/Jayfii_API/public/index.php/api/commandes';
  // shopUrl = 'http://77.241.86.134/Jayfii_API/public/index.php/api/shops';
  // boutiquierUrl = 'http://77.241.86.134/Jayfii_API/public/index.php/api/boutiquiers';

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
  shops: any;
  currentSeller: any;
  currentUser: any;

  constructor(private http: HttpClient, private route: Router, private _snackBar: MatSnackBar)
  {
    let existingCartItems = JSON.parse(localStorage.getItem('panier') || '[]');
    if (!existingCartItems) {
      existingCartItems = [];
    }
    this.itemsSubject.next(existingCartItems);
  }

  alert(message : any)
  {
    let t = 2000;
    this._snackBar.open(message, '',
    {
      duration : t
    });
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
    this.http.post(this.loginUrl, body).subscribe((token) =>
    {
      this.myUser = this.getDecodedAccessToken(JSON.stringify(token));
      if (this.myUser != undefined)
      {
        if(this.myUser?.roles[0] == 'ROLE_BOUTIQUIER' || this.myUser?.roles[0] == 'ROLE_ADMIN')
        {
          this.getUrl(this.boutiquierUrl)
          .pipe
          (take(1))
          .subscribe(
            boutiquier =>
            {
              let monBoutiquier = boutiquier.find((user : any) => user.email === this.myUser.username);
              if(monBoutiquier != undefined)
              {
                if(monBoutiquier.status == "Actif")
                {
                  localStorage.setItem('ACCESS_TOKEN', JSON.stringify(monBoutiquier));
                  this.openSnackBar('Connexion réussie','poc');
                }
                else
                {
                  this.openSnackBar('Connexion non autorisée');
                }
              }
            })
        }
        else
        {
          this.getUrl(this.cashierUrl)
          .pipe
          (take(1))
          .subscribe(
            boutiquier =>
            {
              let monBoutiquier = boutiquier.find((user : any) => user.email === this.myUser.username);
              if(monBoutiquier != undefined)
              {
                localStorage.setItem('ACCESS_TOKEN', JSON.stringify(monBoutiquier));
                this.openSnackBar('Connexion réussie','poc');
              }
              else
              {
                this.openSnackBar('Connexion non autorisée');
              }
            })
        }
      }
      else
      {
        this.openSnackBar('Connexion non autorisée');
      }
    },
    (error) =>
    {
      if(error.status === 401)
      {
        this.openSnackBar('Votre email ou mot de passe est incorrect');
      }
    })
    ;
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
  patchUrl(url: any, body: any)
  {
      this.http.patch(url, body).subscribe();
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
          if(productsParam[this.produit].quantiteEnStock <= productsParam[this.produit].limite)
          {
            if(productsParam[this.produit].quantiteEnStock - 1 == 0)
            {
              this.alert('Le stock du produit est épuisé');
            }
            else
            {
              this.alert('Attention : Il reste ' + (productsParam[this.produit].quantiteEnStock - 1) + ' en stock')
            }
          }
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
