import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  user: any;
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
  getRole()
  {
    this.user = JSON.parse(localStorage.getItem('ACCESS_TOKEN') || '[]') ;
    if(this.user !==null)
    {
      return this.user.roles;
    }
    else
    {
      return this.user = null;
    }
  }
}
