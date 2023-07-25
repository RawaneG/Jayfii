import { BehaviorSubject, map, Observable, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IndexDBService } from './index-db.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable(
  {
    providedIn: 'root',
  })
export class HttpClientService {
  /* Mes APIS **************************************************************************************************/
  removeBgKey = 'jBWxNa19KS49dmpcL38ibg6x';
  removeBgUrl = 'https://api.remove.bg/v1.0/removebg';
  // shopUrl = 'https://jayfii.app/public/index.php/api/shops';
  // loginUrl = 'https://jayfii.app/public/index.php/api/login';
  // produitUrl = 'https://jayfii.app/public/index.php/api/produits';
  // cashierUrl = 'https://jayfii.app/public/index.php/api/caissiers';
  // commandeUrl = 'https://jayfii.app/public/index.php/api/commandes';
  // categorieUrl = 'https://jayfii.app/public/index.php/api/categories';
  // boutiquierUrl = 'https://jayfii.app/public/index.php/api/boutiquiers';
  shopUrl = 'https://127.0.0.1:8000/api/shops';
  loginUrl = 'https://127.0.0.1:8000/api/login';
  produitUrl = 'https://127.0.0.1:8000/api/produits';
  cashierUrl = 'https://127.0.0.1:8000/api/caissiers';
  commandeUrl = 'https://127.0.0.1:8000/api/commandes';
  categorieUrl = 'https://127.0.0.1:8000/api/categories';
  boutiquierUrl = 'https://127.0.0.1:8000/api/boutiquiers';
  /* Mes attributs *********************************************************************************************/
  itemsSubject = new BehaviorSubject<any[]>([]);
  items$ = this.itemsSubject.asObservable();
  mesCommandes: any[] = [];
  monTotalService: any = 0;
  quantite: number = 1;
  indexProd !: number;
  currentSeller: any;
  currentUser: any;
  myUser: any;
  tab!: any[];
  shops: any;
  user: any;
  data: any;
  id = 0;
  /* Mon Constructeur ******************************************************************************************/
  constructor(
    private route: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private indexDBService: IndexDBService) { }
  /* Mes Fonctions ********************************************************************************************/
  getAll(url: string): Observable<any> {
    return this.http.get(`${url}`);
  }
  getById(url: string, id: number): Observable<any> {
    return this.http.get(`${url}/${id}`);
  }
  create(url: string, item: any): Observable<any> {
    return this.http.post(`${url}`, item);
  }
  update(url: string, id: number, item: any): Observable<any> {
    return this.http.put(`${url}/${id}`, item);
  }
  patch(url: string, id: number, item: any): Observable<any> {
    return this.http.patch(`${url}/${id}`, item);
  }
  /* Notification **********************************************************************************************/
  alert(message: any) {
    let t = 2000;
    this._snackBar.open(message, '',
      {
        duration: t
      });
  }
  /* Fonction de notification + Redirection ********************************************************************/
  openSnackBar(message: any, navigation: string = '') {
    let t = 2000;
    this._snackBar.open(message, '',
      {
        duration: t
      });
      navigation == '' ? setTimeout(() => location.reload() , 2200) : setTimeout(() => this.route.navigateByUrl(navigation), 2200);
  }
  /* Authentification ******************************************************************************************/
  login(body: any) {
    this.http.post(this.loginUrl, body).subscribe((token) => {
      this.myUser = this.getDecodedAccessToken(JSON.stringify(token));
      if (this.myUser != undefined) {
        if (this.myUser?.roles[0] == 'ROLE_BOUTIQUIER' || this.myUser?.roles[0] == 'ROLE_ADMIN') {
          this.getAll(this.boutiquierUrl)
            .subscribe(
              boutiquier => {
                let monBoutiquier = boutiquier.find((user: any) => user.email === this.myUser.username);
                if (monBoutiquier != undefined) {
                  if (monBoutiquier.status == "Actif") {
                    this.indexDBService.addData({ id: this.id, user: monBoutiquier }, 'currentUser').subscribe(
                      {
                        next: () => this.openSnackBar('Connexion réussie', 'poc'),
                        error: () => console.log("Erreur lors de la connexion"),
                        complete: () => console.log("Completed")
                      });
                  }
                  else {
                    this.openSnackBar('Connexion non autorisée');
                  }
                }
              })
        }
      }
      else {
        this.openSnackBar('Connexion non autorisée');
      }
    },
      error => error.status === 401 ? this.openSnackBar('Email ou mot de passe incorrect') : null)
  }
  /* Obtenir le token d'authentification ***********************************************************************/
  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
  /* Ajouter au panier *****************************************************************************************/
  addToCart(productParam: any) {
    this.items$
      .pipe(
        take(1),
        map((productsParam) => {
          productParam.quantite = 1;
          productParam.quantiteEnStock--;
          productsParam.push(productParam);
          this.indexDBService.putData({ id: this.id, panier: productsParam }, 'panier').subscribe(
            {
              next: () => this.alert('Produit ajouté au panier avec succès'),
              complete: () => console.log("Ajout au panier complet")
            });
        })
      )
      .subscribe(
        {
          next: () => null,
          complete: () => console.log('complete')
        }
      );
  }
  /* Remove background *********************************************************************************/
  removeBackground(imageData: string) {
    const apiKey = this.removeBgKey;
    const options = {
      headers: { 'X-Api-Key': apiKey },
      responseType: 'blob' as const
    };
    const data = { image_file_b64: imageData };
    return this.http.post('https://api.remove.bg/v1.0/removebg', data, options);
  }
}
