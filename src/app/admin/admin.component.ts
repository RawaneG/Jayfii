import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../services.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit
{
  boutiquiers : any = [];
  spin : boolean = true;
  body !: {};

  constructor(private httpService : HttpClientService) {}

  activer(id : number)
  {
    this.body =
    {
      "status" : "Actif"
    }
    this.httpService.update(this.httpService.boutiquierUrl, id, this.body).subscribe(
      {
        next : () => this.httpService.openSnackBar('Statut Modifié avec succès'),
        error : () => console.log('Erreur pendant la modification du statut'),
        complete : () => console.log('Completed')
      });
  }
  desactiver(id : number)
  {
    this.body =
    {
      "status" : "Inactif"
    }
    this.httpService.update(this.httpService.boutiquierUrl, id, this.body).subscribe(
      {
        next : () => this.httpService.openSnackBar('Statut Modifié avec succès'),
        error : () => console.log('Erreur pendant la modification du statut'),
        complete : () => console.log('Completed')
      });
  }
  ngOnInit(): void
  {
    this.httpService.getAll(this.httpService.boutiquierUrl).subscribe(
      user =>
      {
        this.boutiquiers = user;
        this.spin = false;
      })
  }
}
