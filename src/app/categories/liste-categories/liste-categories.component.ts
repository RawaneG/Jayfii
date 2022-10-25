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
  mesCategories : any;
  pageSlice: any;
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

  ngOnInit(): void
  {
    this.httpService.getUrl(this.httpService.categorieUrl).subscribe
    (
      (reponse) =>
      {
        this.mesCategories = reponse;
        this.pageSlice = this.mesCategories.slice(0 , 5);
      }
    );
  }
}
