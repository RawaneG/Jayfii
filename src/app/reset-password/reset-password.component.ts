import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClientService } from '../services.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit
{
  mesBoutiquiers : any;
  resetForm !: FormGroup;
  body : any;
  mySeller: any;

  constructor(private httpService : HttpClientService, private serviceAuth : AuthService, private formBuilder : FormBuilder, private route : Router) { }

  reset()
  {
    if(this.resetForm.value.email == '')
    {
    }
    else
    {
      setTimeout(() =>
      {
        this.httpService.getUrl(this.httpService.boutiquierUrl).subscribe(
          observables =>
          {
            this.mySeller = observables.find((user : any) => user.email === this.resetForm.value.email)
            if(this.mySeller == undefined)
            {

            }
            else
            {
              console.log(this.mySeller.id);
            }
          }
        )
      }, 2000);
      // this.mesBoutiquiers.find((email : any) => email.id === this.resetForm.value.email);
    }
  }

  ngOnInit(): void
  {
    this.httpService.getUrl(this.httpService.boutiquierUrl).subscribe(
      observables =>
      {
        this.mesBoutiquiers = observables
      }
    )
    this.resetForm  =  this.formBuilder.group(
      {
        email: ['', Validators.required]
      });
  }
}
