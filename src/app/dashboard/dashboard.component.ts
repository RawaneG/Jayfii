import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClientService } from '../services.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit
{
  constructor( private datePipe : DatePipe, private httpService : HttpClientService, private formBuilder : FormBuilder) { }
  form !: FormGroup;
  // -- Variables pour la liste des ventes
  dateActuelle : any = this.datePipe.transform(new Date(),'yyyy-MM-dd');
  mesCommandes : any = [];
  filtrer: any = [];
  couts : any = [];
  // -- Variables pour la pagination
  pageEvent !: PageEvent;
  pageSlice : any;
  // -- Variables pour le filtre
  filtreDate : any;

  onPageChange(event : PageEvent)
  {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.filtrer.length)
    {
      endIndex = this.filtrer.length;
    }
    this.pageSlice = this.filtrer.slice(startIndex, endIndex);
  }
  dateChange(event : any)
  {
    this.filtreDate = this.datePipe.transform(event.value,'yyyy-MM-dd');
  }
  ngOnInit(): void
  {
    this.form = this.formBuilder.group(
      {
        date : ['']
      }
    )
    this.httpService.getUrl(this.httpService.commandeUrl).subscribe(
      data =>
      {
        this.filtrer = data;
        this.pageSlice = this.filtrer.slice(0 , 5);
        this.filtrer.forEach((commande : any) =>
        {
          let total = 0;
          commande.ligneDeCommandes.forEach((ligne : any) =>
          {
            total += ligne.produit.cout;
          });
          this.couts.push(total);
          commande.cout = this.couts[this.couts.length - 1];
        });
      }
    );
  }
}
