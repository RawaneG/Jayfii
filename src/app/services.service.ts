import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, take } from 'rxjs';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";

@Injectable(
{
    providedIn: 'root'
})
export class HttpClientService
{
  loginUrl = "https://127.0.0.1:8000/api/login";
  produitUrl = "https://127.0.0.1:8000/api/produits";
  categorieUrl = "https://127.0.0.1:8000/api/categories";
  quantite : number = 1;
  tab !: any[];
  itemsSubject = new BehaviorSubject<any[]>([]);
  items$ = this.itemsSubject.asObservable();
  myUser: any;
  user: any;

  constructor(private http : HttpClient, private route : Router)
  {
    let existingCartItems = JSON.parse(localStorage.getItem('panier') || '[]');
    if (!existingCartItems)
    {
      existingCartItems = [];
    }
    this.itemsSubject.next(existingCartItems);
  }
/**************************************** Authentification ******** **************************/
  login(body : any)
  {
    this.http.post(this.loginUrl, body).subscribe
    (
      token =>
      {
        this.myUser = this.getDecodedAccessToken(JSON.stringify(token));
        if(this.myUser != undefined)
        {
          localStorage.setItem('ACCESS_TOKEN', JSON.stringify(this.myUser));
          this.route.navigateByUrl('poc');
        }
      }
    )
  }
  getDecodedAccessToken(token: string): any
  {
    try
    {
      return jwt_decode(token);
    }
    catch(Error)
    {
      return null;
    }
  }
/**************************************** Récupération des Observables ******** **************************/
  putUrl(url : any, body : any)
  {
    this.http.put(url, body).subscribe();
  }
/**************************************** Récupération des Observables ******** **************************/
  postUrl(url : any, body : any)
  {
    this.http.post(url, body).subscribe();
  }
/**************************************** Récupération des Observables ******** **************************/
  getUrl(url : any) : Observable<any>
  {
    return this.http.get<any[]>(url);
  }
/**************************************** Transition Observable en tableau *****************************/
  obsToTab(observable : any)
  {
    this.getUrl(observable).subscribe
    (
      value => {this.tab = value}
    )
    return this.tab;
  }
/**************************************** Recherche d'un produit par Id ****** **************************/
  getElementById(id : number, tableau : any)
  {
    return tableau.find((param : any) => param.id === id);
  }
/**************************************** Ajouter au panier ****** **********************************/
  addToCart(productParam: any)
  {
    this.items$.pipe(
      take(1),
      map((productsParam) =>
      {
        productParam.quantite = 1;
        productsParam.push(productParam);
        localStorage.setItem('panier', JSON.stringify(productsParam));
      }),
    ).subscribe();
  }
/**************************************** Incrémentation *************************************************/
incremente()
{
  this.quantite++;
  this.items$.pipe(
    take(1),
    map((selected) =>
    {
      selected[0].quantite++;
      localStorage.setItem('panier', JSON.stringify(selected));
    }),
  ).subscribe();
}
/**************************************** Décrementation *************************************************/
decremente()
{
  this.quantite--;
  this.items$.pipe(
    take(1),
    map((selected) =>
    {
      selected[0].quantite--;
      localStorage.setItem('panier', JSON.stringify(selected));
    }),
  ).subscribe();
}
/****************************************** Sous-Total *************************************************/
  sousTotal()
  {
    let total = 0;
    this.items$.subscribe(
    valeur => valeur.forEach(element => total += element.quantite * element.prix)
    );
    return total;
  }
}
