import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientService } from '../services.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss']
})
export class ConfirmPasswordComponent implements OnInit
{

  resetForm !: FormGroup;
  mesBoutiquiers : any;
  mySeller: any;
  body : any;

  constructor(private snap: ActivatedRoute, private httpService : HttpClientService, private formBuilder : FormBuilder) { }

  modifier()
  {
    if(this.resetForm.value.password == '')
    {
      this.httpService.alert('Veuillez entrer votre mot de passe');
    }
    else
    {
      this.body =
      {
        "password" : this.resetForm.value.password
      }
      const path = this.snap.snapshot.params['id'];
      this.httpService.getAll(this.httpService.boutiquierUrl).subscribe(
        (element : any) =>
        {
          this.mySeller = element.find((boutiquier : any) => boutiquier.id === +path);
          if(this.mySeller === undefined)
          {
            this.httpService.getAll(this.httpService.cashierUrl).subscribe(
              (element : any) =>
              {
                this.mySeller = element.find((caissier : any) => caissier.id === +path);
                if(this.mySeller === undefined)
                {
                  this.httpService.openSnackBar('Utilisateur invalide','login');
                }
                else
                {
                  this.httpService.update(this.httpService.cashierUrl, path, this.body).subscribe(
                    {
                      next : () => this.httpService.openSnackBar('Mot de passe modifié avec succès','login'),
                      error : () => console.log("Erreur lors de la modification du mot de passe"),
                      complete : () => console.log("Completed")
                    });
                }
              })
          }
          else
          {
            this.httpService.update(this.httpService.boutiquierUrl, path, this.body).subscribe(
              {
                next : () => this.httpService.openSnackBar('Mot de passe modifié avec succès','login'),
                error : () => console.log("Erreur lors de la modification du mot de passe"),
                complete : () => console.log("Completed")
              });
          }
        })
    }
  }
  ngOnInit(): void
  {
    this.resetForm  =  this.formBuilder.group(
      {
        password: ['', Validators.required]
      });
  }
}
