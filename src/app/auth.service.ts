import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { SocialAuthService } from '@abacritt/angularx-social-login';
import { IndexDBService } from './index-db.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any;
  constructor(private route: Router, private indexDBService : IndexDBService) {}

  public estConnecte()
  {
    return localStorage.getItem('ACCESS_TOKEN') !== null;
  }
  public deconnecter()
  {
    this.indexDBService.clearData('panier');
    this.indexDBService.clearData('currentShop');
    this.indexDBService.clearData('currentUser');
    this.indexDBService.clearData('currentSellings');
    this.route.navigateByUrl('/');
  }
  getRole()
  {
    this.user = JSON.parse(localStorage.getItem('ACCESS_TOKEN') || '[]');
    if (this.user !== null)
    {
      return this.user.roles;
    } else
    {
      return (this.user = null);
    }
  }
}
