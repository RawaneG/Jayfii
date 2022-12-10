import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Router } from '@angular/router';
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

  constructor( private httpService : HttpClientService, private serviceAuth : AuthService, private formBuilder : FormBuilder, private route : Router) { }

  modifier()
  {
    if(this.resetForm.value.password == '')
    {
      this.httpService.alert('Veuillez entrer votre mot de passe');
    }
    else
    {
      // console.log(this.snap);
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
