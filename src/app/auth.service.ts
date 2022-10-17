import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  constructor(private route : Router) { }

  public estConnecte()
  {
    return localStorage.getItem('ACCESS_TOKEN') !== null;
  }
  public deconnecter()
  {
    localStorage.removeItem('ACCESS_TOKEN');
    this.route.navigateByUrl('/login');
  }
}
