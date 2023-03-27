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
  spin : boolean = true;
  boutiquiers : any = [];
  body !: {};
  constructor(private httpService : HttpClientService) {}

  activer(id : number)
  {
    this.body =
    {
      "status" : "Actif"
    }
    this.httpService.update(this.httpService.boutiquierUrl, id, this.body).subscribe();
    this.httpService.openSnackBar('Statut Modifié avec succès');
  }
  desactiver(id : number)
  {
    this.body =
    {
      "status" : "Inactif"
    }
    this.httpService.update(this.httpService.boutiquierUrl, id, this.body).subscribe();
    this.httpService.openSnackBar('Statut Modifié avec succès');
  }

  ngOnInit(): void
  {
    this.httpService.getAll(this.httpService.boutiquierUrl).subscribe(
      user =>
      {
        this.boutiquiers = user;
        this.spin = false;
      }
    )
  }
}
