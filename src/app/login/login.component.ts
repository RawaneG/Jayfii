import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../services.service';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm !: FormGroup;
  body : any;
  monBoutiquier !: any;
  user !: SocialUser;
  loggedIn !: boolean;

  constructor(
    private httpService : HttpClientService,
    private formBuilder : FormBuilder,
    private service : AuthService,
  ) {}

  submitted()
  {
    this.httpService.login(this.loginForm.value);
  }

  ngOnInit(): void
  {
    // this.service.deconnecter();
    this.loginForm = this.formBuilder.group(
    {
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

  }
}
