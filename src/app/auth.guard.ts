import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {
  currentUser: any;
  constructor(private serviceAuth : AuthService, private router : Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
      let url = state.url;
      this.authUser(route, url);
      return this.connexion(route, url);
    }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  authUser(route : ActivatedRouteSnapshot, url : any) : boolean
  {
    if(this.serviceAuth.estConnecte())
    {
      return true;
    }
    else
    {
      this.router.navigate(['/login']);
      return false;
    }
  }
  connexion(route : ActivatedRouteSnapshot, url : any) : boolean
  {
    this.currentUser = JSON.parse(localStorage.getItem('ACCESS_TOKEN') || '[]');
    if(this.currentUser.roles[0] == 'ROLE_BOUTIQUIER' || this.currentUser.roles[0] == 'ROLE_ADMIN')
    {
      return true;
    }
    else
    {
      this.router.navigate(['/poc']);
      return false;
    }
  }
}
