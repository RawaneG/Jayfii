import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { IndexDBService } from 'src/app/index-db.service';
import { HttpClientService } from 'src/app/services.service';

@Component({
  selector: 'app-liste-categories',
  templateUrl: './liste-categories.component.html',
  styleUrls: ['./liste-categories.component.scss']
})
export class ListeCategoriesComponent implements OnInit
{
  spin : boolean = true;
  mesCategories : any = [];
  pageSlice: any;
  isSelected !: boolean;
  isChecked : any = 'decochee';
  currentStore: any;
  currentShop: any;
  constructor(private httpService : HttpClientService, private indexDBService : IndexDBService) { }

  onPageChange(event : PageEvent)
  {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.mesCategories.length)
    {
      endIndex = this.mesCategories.length;
    }
    this.pageSlice = this.mesCategories.slice(startIndex, endIndex);
  }
  toTrash()
  {
    if(this.isSelected == true)
    {
      this.mesCategories.forEach((element : any) =>
      {
        element.etat = true;
        setTimeout(() => {
          this.httpService.putUrl(this.httpService.categorieUrl + '/' + element.id, element);
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
          this.httpService.putUrl(this.httpService.categorieUrl + '/' + (+this.isChecked.id), this.isChecked);
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
  ngOnInit(): void
  {
    this.spin = false;
    this.indexDBService.getData('currentShop').subscribe(
      (data) =>
      {
        this.currentShop = data.length > 0 ? data[0].boutique.categories : [];
        this.currentShop.forEach((element: any) =>
        {
          element.etat == false ? this.mesCategories?.push(element) : null;
          this.pageSlice = this.mesCategories ? this.mesCategories.slice(0 , 5) : null;
        });
      },
      (error) =>
      {
        console.log("Vous n'avez pas encore d'utilisateur " + error)
      });
  }
}
