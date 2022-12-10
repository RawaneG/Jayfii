import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from  '@angular/forms';
import { Router } from  '@angular/router';
import { Utilisateur } from  '../utilisateur';
import { AuthService } from  '../auth.service';
import { HttpClientService } from '../services.service';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit
{
  loginForm !: FormGroup;
  body : any;
  monBoutiquier !: any;
  user !: SocialUser;
  loggedIn !: boolean;

  constructor(
    private httpService : HttpClientService,
    private serviceAuth : AuthService,
    private formBuilder : FormBuilder,
    private route : Router,
    private authService : SocialAuthService
    ) { }

    submitted()
    {
      this.httpService.login(this.loginForm.value);
    }

    ngOnInit(): void
    {
      this.loginForm  =  this.formBuilder.group(
        {
          email: ['', Validators.required],
          password: ['', Validators.required]
        });

        this.authService.authState.subscribe((user) =>
        {
          this.user = user;
          this.loggedIn = (user != null);
          if(this.loggedIn)
          {
            this.httpService.getUrl(this.httpService.boutiquierUrl).subscribe(
              boutiquier =>
              {
                this.monBoutiquier = boutiquier.find((user : any) => user.email === this.user.email);
                if(this.monBoutiquier != undefined)
                {
                  if(this.monBoutiquier.status == "Actif")
                  {
                    localStorage.setItem('ACCESS_TOKEN', JSON.stringify(this.monBoutiquier));
                    this.httpService.openSnackBar('Connexion réussie','poc');
                  }
                  else
                  {
                    this.httpService.openSnackBar('Connexion non autorisée');
                  }
                }
              })
          }
        });
    }
}
