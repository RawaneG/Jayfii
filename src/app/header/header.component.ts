import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';
import { Component, OnInit } from '@angular/core';
import { IndexDBService } from '../index-db.service';
import { HttpClientService } from '../services.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  monRole: any;
  id: number = 0;
  shops: any[] = [];
  currentStore: any;
  boutiquierId: any;
  currentSeller: any;
  currentUser: any = {};
  cartIcon : boolean = false;

  constructor(
    public route: Router,
    public location: Location,
    private service: AuthService,
    private indexDBService: IndexDBService,
    private httpService: HttpClientService,
  ) { }

  deconnexion() { this.service.deconnecter(); }
  close() { document.querySelector('.popup-container')?.classList.add('hidden'); }
  open() { document.querySelector('.popup-container')?.classList.remove('hidden'); }
  showMyCart() { this.route.url === "/poc"? this.cartIcon = true : this.cartIcon = false; }
  translate() { let nav = document.querySelector('#nav-bar'); nav?.classList.toggle('translate'); }
  refresh(): void { let currentUrl = this.route.url; this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => this.route.navigate([currentUrl])); }
  openPanier() { document.querySelector('.overlay')?.classList.remove('hide_parent'); document.querySelector('.second-parent')?.classList.remove('hide_parent'); }

  switch(shop: any)
  {
    this.indexDBService.clearData('panier');
    this.indexDBService.clearData('currentShop');
    this.indexDBService.putData({ id: this.id, boutique: shop }, 'currentShop').subscribe(
      {
        next: () => this.httpService.openSnackBar(shop.nomBoutique + ' a été choisie avec succès'),
        error: () => console.log("Erreur au niveau de l'ajout de la boutique"),
        complete: () => console.log('Complété avec succès')
      }
    );
    this.currentStore = shop;
  }
  ngOnInit(): void
  {
    this.showMyCart();
    this.indexDBService.getData('currentUser').subscribe(
      data =>
      {
        this.boutiquierId = data.length > 0 ? data[0].user.id : [];
        this.monRole = data.length > 0 ? data[0].user.roles[0] : [];
        this.httpService.getAll(this.httpService.shopUrl).subscribe(data => data.forEach((element: any) => element.boutiquier.id === this.boutiquierId ? this.shops.push(element) : null))
      },
      error => console.log("Vous n'avez pas encore d'utilisateur " + error)
    );
    this.indexDBService.getData('currentShop').subscribe((data : any) => this.currentStore = data[0]?.boutique)
  }
}
