import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import { Utilisateur } from  '../utilisateur';
import { AuthService } from  '../auth.service';
import { HttpClientService } from '../services.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit
{
  loginForm !: FormGroup;
  body : any;
  constructor(
    private httpService : HttpClientService,
    private serviceAuth : AuthService,
    private formBuilder : FormBuilder,
    private route : Router
    ) { }

    submitted()
    {
      this.httpService.login(this.loginForm.value);
    }

    ngOnInit(): void
    {
      this.serviceAuth.deconnecter();
      this.loginForm  =  this.formBuilder.group(
        {
          email: ['', Validators.required],
          password: ['', Validators.required]
        });
    }
}
