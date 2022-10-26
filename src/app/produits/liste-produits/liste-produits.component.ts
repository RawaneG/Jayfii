import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClientService } from 'src/app/services.service';

@Component({
  selector: 'app-liste-produits',
  templateUrl: './liste-produits.component.html',
  styleUrls: ['./liste-produits.component.scss']
})
export class ListeProduitsComponent implements OnInit
{
  panelOpenState = false;
  mesProduits : any;
  mesCategories : any;
  pageSlice : any;
  category : any;
  isSelected !: boolean;
  isChecked : any = 'decochee';

  constructor(private httpService : HttpClientService) { }

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
  toTrash()
  {
    if(this.isSelected == true)
    {
      this.mesProduits.forEach((element : any) =>
      {
        element.etat = true;
        this.httpService.putUrl(this.httpService.produitUrl + '/' + element.id, element);
      });
    }
    else
    {
      if(this.isChecked !== 'decochee')
      {
        this.isChecked.etat = true;
        this.httpService.putUrl(this.httpService.produitUrl + '/' + (+this.isChecked.id), this.isChecked);
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
  ngOnInit(): void
  {
    this.httpService.getUrl(this.httpService.produitUrl).subscribe
    (
      (reponse) =>
      {
        this.mesProduits = reponse;
        this.pageSlice = this.mesProduits.slice(0 , 5);
      }
    );
    this.httpService.getUrl(this.httpService.categorieUrl).subscribe
    (
      (reponse) => {this.mesCategories = reponse}
    );
  }

}
