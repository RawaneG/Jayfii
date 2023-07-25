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
    this.indexDBService.clearData('panier').subscribe();
    this.indexDBService.clearData('currentShop').subscribe();
    this.indexDBService.clearData('currentUser').subscribe();
    this.indexDBService.clearData('currentSellings').subscribe();
    this.route.navigateByUrl('/');
  }
}
