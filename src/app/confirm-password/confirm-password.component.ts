import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClientService } from '../services.service';

@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss']
})
export class ConfirmPasswordComponent implements OnInit
{

  mesBoutiquiers : any;
  resetForm !: FormGroup;
  body : any;
  mySeller: any;

  constructor(private snap: ActivatedRoute, private httpService : HttpClientService, private serviceAuth : AuthService, private formBuilder : FormBuilder, private route : Router) { }

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
                  this.httpService.update(this.httpService.cashierUrl, path, this.body).subscribe();
                  this.httpService.openSnackBar('Mot de passe modifié avec succès','login');
                }
              }
            )
          }
          else
          {
            this.httpService.update(this.httpService.boutiquierUrl, path, this.body).subscribe();
            this.httpService.openSnackBar('Mot de passe modifié avec succès','login');
          }
        }
      )
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
