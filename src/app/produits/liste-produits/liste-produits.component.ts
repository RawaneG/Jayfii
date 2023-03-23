import { HttpClientService } from 'src/app/services.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { IndexDBService } from 'src/app/index-db.service';

@Component(
  {
    selector: 'app-liste-produits',
    templateUrl: './liste-produits.component.html',
    styleUrls: ['./liste-produits.component.scss']
  })
export class ListeProduitsComponent implements OnInit
{
  spin : boolean = true;
  panelOpenState = false;
  mesProduits : any[] = [];
  mesCategories : any;
  pageSlice : any;
  category : any;
  isSelected !: boolean;
  isChecked : any = 'decochee';
  currentStore: any;
  currentShop: any;

  constructor(private httpService : HttpClientService, public route : Router, public location: Location, public dialog: MatDialog, private indexDBService : IndexDBService) { }

  receiveProduct($event: any)
  {
    this.currentShop = $event;
    this.currentShop.forEach((element: any) =>
    {
      element.etat == false ? this.mesProduits?.push(element) : null;
      this.pageSlice = this.mesProduits ? this.mesProduits.slice(0 , 5) : null;
    });
  }
  receiveCategory($event: any)
  {
    this.mesCategories = $event;
  }
  onPageChange(event : PageEvent)
  {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.mesProduits.length)
    {
      endIndex = this.mesProduits.length;
    }
    this.pageSlice = this.mesProduits.slice(startIndex, endIndex);
  }
  refresh()
  {
    this.mesProduits = [];
    console.log(this.currentShop)
    this.currentShop.forEach((element: any) =>
    {
      element.etat == false ? this.mesProduits.push(element) : null;
      this.pageSlice = this.mesProduits.slice(0 , 5);
    });
  }
  toTrash()
  {
    if(this.isSelected == true)
    {
      this.mesProduits.forEach((element : any) =>
      {
        element.etat = true;
        setTimeout(() => {
        this.httpService.putUrl(this.httpService.produitUrl + '/' + element.id, element);
        this.httpService.openSnackBar('Suppression effectuée avec succès');
        }, 1000);
      });
    }
    else
    {
      if(this.isChecked !== 'decochee')
      {
        this.isChecked.etat = true;
        setTimeout(() => {
        this.httpService.putUrl(this.httpService.produitUrl + '/' + (+this.isChecked.id), this.isChecked);
        this.httpService.openSnackBar('Suppression effectuée avec succès');
        }, 1000);
      }
    }
  }
  check(event : any)
  {
    if(event.checked === true)
    {
      this.isSelected = true;
    }
    else
    {
      this.isSelected = false;
    }
  }
  coche(event : any, produit : any)
  {
    if(event.checked == true)
    {
      this.isChecked = produit;
    }
    else
    {
      this.isChecked = 'decochee';
    }
  }
  selectCategorie(event : any)
  {
    this.category = event.nom;
  }
  filtreStock()
  {
    this.mesProduits = [];
    this.currentShop.forEach((element: any) =>
    {
      if(element.etat == false)
      {
        if(element.quantiteEnStock <= element.limite)
        {
          this.mesProduits.push(element);
        }
      }
      this.pageSlice = this.mesProduits ? this.mesProduits.slice(0 , 5) : null;
    });
  }
  ngOnInit(): void
  {
    this.spin = false;
    this.indexDBService.getData('currentShop').subscribe(
      (data) =>
      {
        this.currentShop = data.length > 0 ? data[0].boutique.produit : [];
        this.mesCategories = data.length > 0 ? data[0].boutique.categories : [];
        this.currentShop.forEach((element: any) =>
        {
          element.etat == false ? this.mesProduits?.push(element) : null;
          this.pageSlice = this.mesProduits ? this.mesProduits.slice(0 , 5) : null;
        });
      },
      (error) =>
      {
        console.log("Vous n'avez pas encore d'utilisateur " + error)
      });
  }

}
