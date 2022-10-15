import { Component, OnInit } from '@angular/core';
import { HttpClientService } from 'src/app/services.service';

@Component({
  selector: 'app-liste-categories',
  templateUrl: './liste-categories.component.html',
  styleUrls: ['./liste-categories.component.scss']
})
export class ListeCategoriesComponent implements OnInit
{
  mesCategories : any;
  constructor(private httpService : HttpClientService) { }
  ngOnInit(): void
  {
    this.httpService.getUrl(this.httpService.categorieUrl).subscribe
    (
      (reponse) => {this.mesCategories = reponse}
    );
  }
}
