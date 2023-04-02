import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { IndexDBService } from 'src/app/index-db.service';
import { HttpClientService } from 'src/app/services.service';

@Component({
  selector: 'app-liste-categories',
  templateUrl: './liste-categories.component.html',
  styleUrls: ['./liste-categories.component.scss']
})
export class ListeCategoriesComponent implements OnInit {
  isChecked: any = 'decochee';
  mesCategories: any = [];
  spin: boolean = true;
  isSelected !: boolean;
  currentStore: any;
  currentShop: any;
  pageSlice: any;
  shopId: any;

  constructor(private httpService: HttpClientService, private indexDBService: IndexDBService) { }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    endIndex > this.mesCategories.length ? endIndex = this.mesCategories.length : null;
    this.pageSlice = this.mesCategories.slice(startIndex, endIndex);
  }
  toTrash() {
    if (this.isSelected == true) {
      this.mesCategories.forEach((element: any) => {
        element.etat = true;
        this.httpService.update(this.httpService.categorieUrl, element.id, element).subscribe(
          {
            next: (value: any) => this.httpService.openSnackBar('Suppression effectuée avec succès'),
            error: (value: any) => console.log('Erreur au niveau de la liste des catégories'),
            complete: () => console.log('Suppression complete')
          });
      });
    }
    else {
      if (this.isChecked !== 'decochee') {
        this.isChecked.etat = true;
        this.httpService.update(this.httpService.categorieUrl, (+this.isChecked.id), this.isChecked).subscribe(
          {
            next: (value: any) => this.httpService.openSnackBar('Suppression effectuée avec succès'),
            error: (value: any) => console.log('Erreur au niveau de la liste des catégories'),
            complete: () => console.log('Suppression complete')
          });
      }
    }
  }
  check(event: any) {
    event.checked === true ? this.isSelected = true : this.isSelected = false;
  }
  coche(event: any, produit: any) {
    event.checked == true ? this.isChecked = produit : this.isChecked = 'decochee'
  }
  ngOnInit(): void {
    this.indexDBService.getData('currentShop').subscribe(
      data => {
        this.shopId = data[0]?.boutique?.id;
        if (this.shopId === undefined) {
          this.spin = false
        }
        else {
          this.httpService.getById(this.httpService.shopUrl, this.shopId).subscribe(
            boutique => {
              this.currentShop = boutique
              boutique?.categories?.forEach((element: any) => {
                element.etat == false ? this.mesCategories?.push(element) : null;
                this.pageSlice = this.mesCategories ? this.mesCategories?.slice(0, 5) : null;
                this.spin = false;
              });
            }
          )
        }
      },
      error => console.log("Vous n'avez pas encore d'utilisateur " + error));
  }
}
