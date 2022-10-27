import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { HttpClientService } from 'src/app/services.service';

@Component({
  selector: 'app-liste-categories',
  templateUrl: './liste-categories.component.html',
  styleUrls: ['./liste-categories.component.scss']
})
export class ListeCategoriesComponent implements OnInit
{
  mesCategories : any = [];
  pageSlice: any;
  isSelected !: boolean;
  isChecked : any = 'decochee';
  constructor(private httpService : HttpClientService) { }

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
        this.httpService.putUrl(this.httpService.categorieUrl + '/' + element.id, element);
        setTimeout(() => {

        }, 500);
        location.reload();
      });
    }
    else
    {
      if(this.isChecked !== 'decochee')
      {
        this.isChecked.etat = true;
        this.httpService.putUrl(this.httpService.categorieUrl + '/' + (+this.isChecked.id), this.isChecked);
        setTimeout(() => {

        }, 500);
        location.reload();
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
    this.httpService.getUrl(this.httpService.categorieUrl).subscribe
    (
      (reponse) =>
      {
        reponse.forEach((element : any) =>
        {
            if(element.etat === false)
            {
              this.mesCategories.push(element);
            }
        });
        this.pageSlice = this.mesCategories.slice(0 , 5);
      }
    );
  }
}
