import { Component, OnInit } from '@angular/core';
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

  constructor(private httpService : HttpClientService) { }

  ngOnInit(): void
  {
    this.httpService.getUrl(this.httpService.produitUrl).subscribe
    (
      (reponse) => {this.mesProduits = reponse}
    );
    this.httpService.getUrl(this.httpService.categorieUrl).subscribe
    (
      (reponse) => {this.mesCategories = reponse}
    );
  }

}
