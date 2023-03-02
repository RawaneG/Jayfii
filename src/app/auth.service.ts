import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any;
  constructor(private route: Router, private authService: SocialAuthService) {}

  public estConnecte() {
    return localStorage.getItem('ACCESS_TOKEN') !== null;
  }
  public deconnecter() {
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('reçu');
    localStorage.removeItem('promo');
    localStorage.removeItem('panier');
    localStorage.removeItem('boutique');
    localStorage.removeItem('mes_boutiques');
    this.route.navigateByUrl('/');
  }
  getRole() {
    this.user = JSON.parse(localStorage.getItem('ACCESS_TOKEN') || '[]');
    if (this.user !== null) {
      return this.user.roles;
    } else {
      return (this.user = null);
    }
  }
}
