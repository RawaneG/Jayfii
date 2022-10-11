import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services.service';

@Component({
  selector: 'app-poste-de-vente',
  templateUrl: './poste-de-vente.component.html',
  styleUrls: ['./poste-de-vente.component.scss']
})
export class PosteDeVenteComponent implements OnInit
{
  constructor(private httpService : HttpClientService) {}

  ngOnInit(): void
  {

  }
}
