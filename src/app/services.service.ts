import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable(
{
    providedIn: 'root'
})
export class HttpClientService
{

  tab !: any[];

  constructor(private http : HttpClient) {}

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
}
