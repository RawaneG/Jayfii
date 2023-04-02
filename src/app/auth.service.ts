import { IndexDBService } from './index-db.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private route: Router, private indexDBService: IndexDBService) { }

  public estConnecte() {
    return localStorage.getItem('ACCESS_TOKEN') !== null;
  }
  public deconnecter() {
    this.indexDBService.clearData('panier').subscribe(
      {
        complete: () => console.log('Panier vidé')
      }
    );
    this.indexDBService.clearData('currentShop').subscribe(
      {
        complete: () => console.log('Boutique vidé')
      }
    );
    this.indexDBService.clearData('currentUser').subscribe(
      {
        complete: () => console.log('Utilisateur vidé')
      }
    );
    this.indexDBService.clearData('currentSellings').subscribe(
      {
        complete: () => console.log('Boutique courrante vidé')
      }
    );
    this.route.navigateByUrl('/');
  }
}
