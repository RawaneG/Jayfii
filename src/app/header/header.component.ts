import { HttpClientService } from '../services.service';
import { IndexDBService } from '../index-db.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser: any = {};
  currentSeller: any;
  shops: any[] = [];
  currentStore: any;
  boutiquierId: any;
  id: number = 0;
  monRole: any;

  constructor(
    private httpService: HttpClientService,
    private indexDBService: IndexDBService,
    private service: AuthService,
    public location: Location,
    public route: Router,
  ) { }

  translate()
  {
    let nav = document.querySelector('#nav-bar');
    nav?.classList.toggle('translate');
  }
  openPanier()
  {
    document.querySelector('.overlay')?.classList.remove('hide_parent');
    document.querySelector('.second-parent')?.classList.remove('hide_parent');
  }
  refresh(): void
  {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => this.route.navigate([currentUrl]));
  }
  switch(shop: any)
  {
    this.indexDBService.clearData('currentShop');
    this.indexDBService.clearData('panier');
    this.indexDBService.putData({ id: this.id, boutique: shop }, 'currentShop').subscribe(
      {
        next: () => this.httpService.openSnackBar(shop.nomBoutique + ' a été choisie avec succès'),
        error: () => console.log("Erreur au niveau de l'ajout de la boutique"),
        complete: () => console.log('Complété avec succès')
      }
    );
  }
  open()
  {
    document.querySelector('.popup-container')?.classList.remove('hidden');
  }
  close()
  {
    document.querySelector('.popup-container')?.classList.add('hidden');
  }
  deconnexion()
  {
    this.service.deconnecter();
  }
  ngOnInit(): void
  {
    this.indexDBService.getData('currentUser').subscribe(
      data =>
      {
        this.boutiquierId = data.length > 0 ? data[0].user.id : [];
        this.monRole = data.length > 0 ? data[0].user.roles[0] : [];
        this.httpService.getAll(this.httpService.shopUrl).subscribe(data => data.forEach((element: any) => element.boutiquier.id === this.boutiquierId ? this.shops.push(element) : null))
      },
      error => console.log("Vous n'avez pas encore d'utilisateur " + error)
    );
  }
}
