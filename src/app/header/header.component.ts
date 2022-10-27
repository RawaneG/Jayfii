import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit
{
  constructor(private service : AuthService) { }
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
  deconnexion()
  {
    this.service.deconnecter();
  }
  ngOnInit(): void
  {
  }
}
