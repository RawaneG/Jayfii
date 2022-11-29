import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit
{
  boutiquiers : any = [];
  body !: {};
  constructor(private httpService : HttpClientService) {}

  activer(id : number)
  {
    this.body =
    {
      "status" : "Actif"
    }
    this.httpService.putUrl(this.httpService.boutiquierUrl + '/' + id, this.body);
    this.httpService.openSnackBar('Statut Modifié avec succès');
  }
  desactiver(id : number)
  {
    this.body =
    {
      "status" : "Inactif"
    }
    this.httpService.putUrl(this.httpService.boutiquierUrl + '/' + id, this.body);
    this.httpService.openSnackBar('Statut Modifié avec succès');
  }

  ngOnInit(): void
  {
    this.httpService.getUrl(this.httpService.boutiquierUrl).subscribe(
      user => this.boutiquiers = user
    )
  }
}
