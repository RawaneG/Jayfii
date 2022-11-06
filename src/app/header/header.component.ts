import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';
import { HttpClientService } from '../services.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit
{
  refresh() : void
  {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.route.navigate([currentUrl]);
    });
  }
  currentUser: any;
  currentSeller: any;
  shops: any;
  currentStore: any;
  constructor(private service : AuthService, private httpService : HttpClientService, public route : Router, public location: Location) { }

  switch(shop : any)
  {
    localStorage.setItem('boutique', JSON.stringify(shop));
    this.refresh();
    this.ngOnInit();
  }
  link(event : any)
  {
    const allItems = document.querySelectorAll(".nav__item");
    allItems.forEach(element =>
    {
      element.classList.remove('active');
    });
    const daItem = document.querySelector(event);
    daItem.classList.add('active');
  }
  open()
  {
    document.querySelector('.popup-container')?.classList.remove('hidden');
  }
  close()
  {
    document.querySelector('.popup-container')?.classList.add('hidden');
  }
  deconnexion()
  {
    this.service.deconnecter();
  }

  ngOnInit(): void
  {
    this.currentStore = JSON.parse(localStorage.getItem('boutique') || '[]');
    this.currentUser = JSON.parse(localStorage.getItem('ACCESS_TOKEN') || '[]');

    this.httpService.getUrl(this.httpService.boutiquierUrl).subscribe(
      value =>
      {
        this.currentSeller = value.find((param : any) => param.email === this.currentUser.username)
        this.shops = this.currentSeller.shop;
      }
    );
  }
}
