import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../services.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit
{
  resetForm !: FormGroup;
  mesBoutiquiers : any;
  mySeller: any;
  body : any;

  constructor(private httpService : HttpClientService, private formBuilder : FormBuilder) { }

  reset()
  {
    if(this.resetForm.value.email == '')
    {
      this.httpService.alert('Veuillez entrer votre email');
    }
    else
    {
      this.httpService.getAll(this.httpService.boutiquierUrl).subscribe(
        observables =>
        {
          this.mySeller = observables.find((user : any) => user.email === this.resetForm.value.email)
          if(this.mySeller == undefined)
          {
            this.httpService.openSnackBar('Email invalide');
          }
          else
          {
            this.body =
            {
              "refreshToken" : "string"
            }
            this.httpService.patch(this.httpService.boutiquierUrl, this.mySeller.id, this.body).subscribe(
              {
                next : () => this.httpService.alert('Veuillez consulter votre adresse mail'),
                error : () => console.log("Erreur au niveau du changement de mot de passe"),
                complete : () => console.log("Completed"),
              })
          }
        })
    }
  }
  ngOnInit(): void
  {
    this.httpService.getAll(this.httpService.boutiquierUrl).subscribe(observables => this.mesBoutiquiers = observables)
    this.resetForm  =  this.formBuilder.group(
      {
        email: ['', Validators.required]
      });
  }
}
