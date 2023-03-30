import { HttpClientService } from 'src/app/services.service';
import { IndexDBService } from 'src/app/index-db.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component(
  {
    selector: 'app-liste-produits',
    templateUrl: './liste-produits.component.html',
    styleUrls: ['./liste-produits.component.scss']
  })
export class ListeProduitsComponent implements OnInit
{
  isChecked : any = 'decochee';
  mesCategories : any[] = [];
  mesProduits : any[] = [];
  panelOpenState = false;
  spin : boolean = true;
  isSelected !: boolean;
  currentStore: any;
  currentShop: any;
  pageSlice : any;
  category : any;
  shopId: any;

  constructor(private httpService : HttpClientService, public route : Router, public location: Location, public dialog: MatDialog, private indexDBService : IndexDBService) { }

  onPageChange(event : PageEvent)
  {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    endIndex > this.mesProduits.length ? endIndex = this.mesProduits.length : null;
    this.pageSlice = this.mesProduits.slice(startIndex, endIndex);
  }
  refresh()
  {
    this.mesProduits = [];
    this.currentShop?.produit?.forEach((element: any) => element.etat == false ? this.mesProduits.push(element) : null)
    this.category = null;
    this.pageSlice = this.mesProduits.slice(0 , 5);
  }
  toTrash()
  {
    if(this.isSelected == true)
    {
      this.mesProduits.forEach((element : any) =>
      {
        element.etat = true;
        this.httpService.update(this.httpService.produitUrl, element.id, element).subscribe(
          {
            next : () => this.httpService.openSnackBar('Suppression effectuée avec succès'),
            error : () => console.log('Erreur au niveau de la suppression'),
            complete : () => console.log('Suppression bien effectuée')
          })
      });
    }
    else
    {
      if(this.isChecked !== 'decochee')
      {
        this.isChecked.etat = true;
        this.httpService.update(this.httpService.produitUrl, (+this.isChecked.id), this.isChecked).subscribe(
          {
            next : () => this.httpService.openSnackBar('Suppression effectuée avec succès'),
            error : () => console.log('Erreur au niveau de la suppression'),
            complete : () => console.log('Suppression bien effectuée')
          })
      }
    }
  }
  check(event : any)
  {
    event.checked === true ? this.isSelected = true : this.isSelected = false
  }
  coche(event : any, produit : any)
  {
    event.checked == true ? this.isChecked = produit : this.isChecked = 'decochee'
  }
  selectCategorie(event : any)
  {
    this.category = event.nom;
  }
  filtreStock()
  {
    this.mesProduits = [];
    this.currentShop?.produit?.forEach((element: any) =>
    {
      element.etat == false ? (element.quantiteEnStock <= element.limite ? this.mesProduits.push(element) : null) : null;
      this.pageSlice = this.mesProduits ? this.mesProduits.slice(0 , 5) : null;
    });
  }
  ngOnInit(): void
  {
    this.indexDBService.getData('currentShop').subscribe(
      data =>
      {
        this.shopId = data[0].boutique.id;
        this.httpService.getById(this.httpService.shopUrl, this.shopId).subscribe(
          boutique =>
          {
            this.currentShop = boutique;
            boutique?.produit?.forEach((element: any) =>
            {
              element.etat == false ? this.mesProduits.push(element) : null;
              this.pageSlice = this.mesProduits ? this.mesProduits?.slice(0 , 5) : null;
              this.spin = false;
            });
            boutique?.categories?.forEach((element: any) => element.etat == false ? this.mesCategories.push(element) : null)
          })
      },
      error => console.log("Vous n'avez pas encore d'utilisateur " + error))
  }
}
