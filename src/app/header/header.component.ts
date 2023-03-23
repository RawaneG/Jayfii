import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientService } from '../services.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IndexDBService } from '../index-db.service';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit
{
  @Output() mesProduits = new EventEmitter<any>();
  @Output() mesCategories = new EventEmitter<any>();
  @Output() monPanier = new EventEmitter<any>();

  id : number = 0;
  monRole: any;
  currentUser: any = {};
  currentSeller: any;
  shops: any;
  currentStore: any;

  constructor(
    private router : ActivatedRoute ,
    private service : AuthService,
    private httpService : HttpClientService,
    public route : Router,
    public location: Location,
    private indexDBService : IndexDBService
    ) {}

  refresh() : void
  {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', {skipLocationChange: true}).then(() =>
    {
      this.route.navigate([currentUrl]);
    });
  }
  switch(shop : any)
  {
    this.indexDBService.clearData('currentShop')
    this.indexDBService.clearData('panier')
    this.indexDBService.addData({id : this.id, boutique : shop}, 'currentShop');
    this.httpService.openSnackBar(shop.nomBoutique + ' a été choisie avec succès');
  }
  link(event : any)
  {
    const allItems = document.querySelectorAll(".nav__item");
    allItems.forEach(element =>
    {
      element.classList.remove('active');
    });
    const daItem = document.querySelector(event);
    daItem.classList.add('active');
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
      (data) =>
      {
        this.shops = data.length > 0 ? data[0].user.shop : [];
        this.monRole = data.length > 0 ? data[0].user.roles[0] : [];
      },
      (error) =>
      {
        console.log("Vous n'avez pas encore d'utilisateur " + error)
      });
    const allItems = document.querySelectorAll(".nav__item");
    allItems.forEach(element =>
    {
      element.classList.remove('active');
    });
    const path = this.router.snapshot.routeConfig?.path;
    const daItem = document.querySelector(`[href*=${path}]`);
    daItem?.classList.add('active');
  }
}
