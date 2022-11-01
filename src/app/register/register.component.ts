import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClientService } from '../services.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit
{
  loginForm !: FormGroup;

  constructor(
    private httpService : HttpClientService,
    private serviceAuth : AuthService,
    private formBuilder : FormBuilder,
    private route : Router
    ) { }

  submitted()
  {

  }

  ngOnInit(): void
  {
    this.loginForm  =  this.formBuilder.group(
      {
        email: ['', Validators.required],
        prenom: ['', Validators.required],
        nom: ['', Validators.required],
        telephone: ['', Validators.required],
      });
  }
}
