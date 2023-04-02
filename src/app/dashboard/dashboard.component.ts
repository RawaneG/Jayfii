import { HttpClientService } from '../services.service';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IndexDBService } from '../index-db.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  maVente!: { date: any; vente: number; cout: number; nombreVentes: number };
  dateActuelle: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  echantillonDate!: string | null;
  mesVentesFiltrees: any = [];
  nombreVentes: number = 0;
  venteTotale: number = 0;
  derniereVente!: number;
  totalVente: number = 0;
  mesCommandes: any = [];
  mesVentes: any[] = [];
  totalCout: number = 0;
  coutTotal: number = 0;
  pageEvent!: PageEvent;
  spin: boolean = true;
  filtrer?: any = [];
  currentSeller: any;
  currentShop: any;
  currentUser: any;
  form!: FormGroup;
  filtreDate: any;
  weekStart!: any;
  taillePage: any;
  couts: any = [];
  dateDebut: any;
  month!: number;
  pageSlice: any;
  year!: number;
  weekEnd!: any;
  dateFin: any;
  shops?: any;
  shopId: any;

  constructor(
    private httpService: HttpClientService,
    private indexDBService: IndexDBService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
  ) { }

  //--Filtre par date spécifique
  filterByDate() {
    if (this.form.value.start == null || this.form.value.end === null) {
      this.httpService.openSnackBar('Veuillez choisir un intervalle de date valide');
    }
    else {
      this.totalVente = 0;
      this.totalCout = 0;
      this.dateDebut = this.datePipe.transform(this.form.value.start, 'yyyy-MM-dd');
      this.dateFin = this.datePipe.transform(this.form.value.end, 'yyyy-MM-dd');
      this.mesVentes.forEach((vente) => vente.date >= this.dateDebut && vente.date <= this.dateFin ? this.mesVentesFiltrees.push(vente) : null);
      this.mesVentesFiltrees.forEach((element: any) => {
        this.totalVente += element.vente;
        this.totalCout += element.cout;
      });
      this.pageSlice = this.mesVentesFiltrees.slice(0, 5);
      this.mesVentesFiltrees = [];
    }
  }
  //--Filtre par jour, semaine, mois et année
  filtering(title: string) {
    this.totalVente = 0;
    this.totalCout = 0;
    switch (title) {
      case 'week':
        this.weekEnd = new Date(this.dateActuelle);
        this.weekStart = this.datePipe.transform(this.weekEnd.setDate(this.weekEnd.getDate() - 7), 'yyyy-MM-dd');
        this.mesVentes.forEach((vente) => vente.date >= this.weekStart && vente.date <= this.dateActuelle ? this.mesVentesFiltrees.push(vente) : null);
        this.mesVentesFiltrees.forEach((element: any) => {
          this.totalVente += element.vente;
          this.totalCout += element.cout;
        });
        this.pageSlice = this.mesVentesFiltrees.slice(0, 5);
        this.mesVentesFiltrees = [];
        break;
      case 'month':
        this.month = new Date(this.dateActuelle).getMonth();
        this.mesVentes.forEach((vente) => new Date(vente.date).getMonth() === this.month ? this.mesVentesFiltrees.push(vente) : null);
        this.mesVentesFiltrees.forEach((element: any) => {
          this.totalVente += element.vente;
          this.totalCout += element.cout;
        });
        this.pageSlice = this.mesVentesFiltrees.slice(0, 5);
        this.mesVentesFiltrees = [];
        break;
      case 'year':
        this.year = new Date(this.dateActuelle).getFullYear();
        this.mesVentes.forEach((vente) => new Date(vente.date).getFullYear() === this.year ? this.mesVentesFiltrees.push(vente) : null);
        this.mesVentesFiltrees.forEach((element: any) => {
          this.totalVente += element.vente;
          this.totalCout += element.cout;
        });
        this.pageSlice = this.mesVentesFiltrees.slice(0, 5);
        this.mesVentesFiltrees = [];
        break;
    }
  }
  //--Pagination
  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    endIndex > this.filtrer.length ? endIndex = this.filtrer.length : null;
    this.pageSlice = this.mesVentes.slice(startIndex, endIndex);
  }
  ngOnInit(): void {
    this.indexDBService.getData('currentShop').subscribe(
      data => {
        this.shopId = data[0]?.boutique?.id;
        if (this.shopId === undefined) {
          this.spin = false
        }
        else {
          this.httpService.getAll(this.httpService.shopUrl).subscribe(
            data => {
              data.forEach((element: any) => element.id === this.shopId ? this.mesCommandes?.push(element) : null);
              this.filtrer = this.mesCommandes[0]?.commande;
              this.spin = false;
              // -- Calcul des couts totaux
              this.filtrer?.forEach((commande: any) => {
                let total = 0;
                commande.ligneDeCommandes.forEach((ligne: any) => total += ligne.produit.cout);
                this.couts.push(total);
                commande.cout = this.couts[this.couts.length - 1];
              });
              // -- Calcul des ventes qui ont été faites dans la journée
              if (this.filtrer != undefined) {
                this.echantillonDate = this.datePipe.transform(this.filtrer[0]?.date, 'yyyy-MM-dd');
                this.filtrer.forEach((element: any) => {
                  if (this.echantillonDate == this.datePipe.transform(element.date, 'yyyy-MM-dd')) {
                    if (this.mesVentes.filter((e) => e.date === this.echantillonDate).length > 0) {
                      this.nombreVentes += 1;
                      this.venteTotale += element.prixCommande;
                      this.coutTotal += element.cout;
                      let index = this.mesVentes.findIndex((vente) => vente.date === this.echantillonDate);
                      this.mesVentes[index].vente = this.venteTotale;
                      this.mesVentes[index].cout = this.coutTotal;
                      this.mesVentes[index].nombreVentes = this.nombreVentes;
                    }
                    else {
                      this.nombreVentes += 1;
                      this.venteTotale += element.prixCommande;
                      this.coutTotal += element.cout;
                      this.maVente =
                      {
                        date: this.echantillonDate,
                        vente: this.venteTotale,
                        cout: this.coutTotal,
                        nombreVentes: this.nombreVentes,
                      };
                      this.mesVentes.push(this.maVente);
                    }
                  }
                  else {
                    this.nombreVentes = 0;
                    this.venteTotale = 0;
                    this.coutTotal = 0;
                    this.echantillonDate = this.datePipe.transform(element.date, 'yyyy-MM-dd');
                    if (this.mesVentes.filter((e) => e.date === this.echantillonDate).length > 0) {
                      this.nombreVentes += 1;
                      this.venteTotale += element.prixCommande;
                      this.coutTotal += element.cout;
                      let index = this.mesVentes.findIndex((vente) => vente.date === this.echantillonDate);
                      this.mesVentes[index].vente = this.venteTotale;
                      this.mesVentes[index].cout = this.coutTotal;
                      this.mesVentes[index].nombreVentes = this.nombreVentes;
                    }
                    else {
                      this.nombreVentes += 1;
                      this.venteTotale += element.prixCommande;
                      this.coutTotal += element.cout;
                      this.maVente =
                      {
                        date: this.echantillonDate,
                        vente: this.venteTotale,
                        cout: this.coutTotal,
                        nombreVentes: this.nombreVentes,
                      };
                      this.mesVentes.push(this.maVente);
                    }
                  }
                });
              }
              // -- Calcul de la somme des ventees effectuées
              this.mesVentes.forEach((element) => {
                this.totalVente += element.vente;
                this.totalCout += element.cout;
              });
              // -- Pagination
              this.taillePage = this.mesVentes.length
              this.pageSlice = this.mesVentes.slice(0, 5);
            }
          )
        }
      },
      error => console.log('Erreur au niveau du composant dashboard' + error)
    )
    this.form = this.formBuilder.group(
      {
        start: [''],
        end: [''],
      });

  }
}
