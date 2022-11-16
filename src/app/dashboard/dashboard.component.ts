import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClientService } from '../services.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit
{
  derniereVente !: number;
  nombreVentes : number = 0;
  totalVente : number = 0;
  totalCout : number = 0;
  echantillonDate !: string | null;
  venteTotale : number = 0;
  coutTotal: number = 0;
  mesVentes : any[] = [];
  maVente!: { date: any; vente: number; cout : number; nombreVentes : number};
  currentSeller: any;
  currentUser: any;
  shops ?: any;
  currentShop: any;
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
    this.pageSlice = this.mesVentes.slice(startIndex, endIndex);
  }

  ngOnInit(): void
  {
    //-- Affichage de la boutique en cours d'utilisation
    this.currentShop = JSON.parse(localStorage.getItem('boutique') || '[]');
    this.form = this.formBuilder.group(
      {
        start : [''],
        end : ['']
      }
    )
    // -- Liste des ventes
    this.filtrer = this.currentShop.commande;
    // -- Calcul des couts totaux
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
    // -- Calcul des ventes qui ont été faites dans la journée
    this.echantillonDate = this.datePipe.transform(this.filtrer[0].date,'yyyy-MM-dd');
    this.filtrer.forEach((element : any) =>
        {
          if(this.echantillonDate == this.datePipe.transform(element.date,'yyyy-MM-dd'))
          {
            if(this.mesVentes.filter(e => e.date === this.echantillonDate).length > 0)
            {
              this.nombreVentes += 1;
              this.venteTotale += element.prixCommande;
              this.coutTotal += element.cout;
              let index = this.mesVentes.findIndex(vente => vente.date === this.echantillonDate);
              this.mesVentes[index].vente = this.venteTotale;
              this.mesVentes[index].cout = this.coutTotal;
              this.mesVentes[index].nombreVentes = this.nombreVentes;
            }
            else
            {
              this.nombreVentes += 1;
              this.venteTotale += element.prixCommande;
              this.coutTotal += element.cout;
              this.maVente =
              {
                "date" : this.echantillonDate,
                "vente" : this.venteTotale,
                "cout" : this.coutTotal,
                "nombreVentes" : this.nombreVentes
              }
              this.mesVentes.push(this.maVente)
            }
          }
          else
          {
            this.nombreVentes = 0;
            this.venteTotale = 0
            this.coutTotal = 0
            this.echantillonDate = this.datePipe.transform(element.date,'yyyy-MM-dd');
            if(this.mesVentes.filter(e => e.date === this.echantillonDate).length > 0)
            {
              this.nombreVentes += 1;
              this.venteTotale += element.prixCommande;
              this.coutTotal += element.cout;
              let index = this.mesVentes.findIndex(vente => vente.date === this.echantillonDate);
              this.mesVentes[index].vente = this.venteTotale;
              this.mesVentes[index].cout = this.coutTotal;
              this.mesVentes[index].nombreVentes = this.nombreVentes;
            }
            else
            {
              this.nombreVentes += 1;
              this.venteTotale += element.prixCommande;
              this.coutTotal += element.cout;
              this.maVente =
              {
                "date" : this.echantillonDate,
                "vente" : this.venteTotale,
                "cout" : this.coutTotal,
                "nombreVentes" : this.nombreVentes
              }
              this.mesVentes.push(this.maVente)
            }
          }
    });
    // -- Calcul de la somme des ventees effectuées
    this.mesVentes.forEach(element =>
    {
      this.totalVente += element.vente;
      this.totalCout += element.cout;
    });
    // -- Pagination
      this.pageSlice = this.mesVentes.slice(0 , 5);
    }
}
