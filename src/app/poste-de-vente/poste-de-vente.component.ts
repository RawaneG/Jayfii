import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpClientService } from '../services.service';
import { IndexDBService } from '../index-db.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-poste-de-vente',
  templateUrl: './poste-de-vente.component.html',
  styleUrls: ['./poste-de-vente.component.scss']
})
export class PosteDeVenteComponent implements OnInit {
  produit !: { quantiteEnStock: any; };
  nomProduit = new FormControl('');
  items$ !: Observable<any[]>;
  confirmer: boolean = false;
  public messaged !: string;
  mesCategories: any[] = [];
  mesCommandes: any[] = [];
  mesProduits: any[] = [];
  intermediaire: any = [];
  tabCommandes: any = [];
  monProduit: any[] = [];
  monTotal: number = 0;
  spin: boolean = true;
  currentCashier: any;
  tabEntier: any = [];
  unfilteredProd: any;
  monPanier !: any[];
  currentSeller: any;
  receipt: any = [];
  form !: FormGroup;
  montant !: number;
  currentStore: any;
  reste: number = 0;
  currentShop: any;
  currentUser: any;
  search: any = '';
  maQuantite: any;
  data !: any[];
  category: any;
  product: any;
  ajoutee: any;
  body: any;
  id = 0;

  constructor(
    private httpService: HttpClientService,
    private indexDBService: IndexDBService,
    private formBuilder: FormBuilder,
    public location: Location,
  ) { }

  closePanier()
  {
    document.querySelector('.second-parent')?.classList.add('hide_parent');
  }
  recherche() {
    this.mesProduits = [];
    this.search = this.nomProduit.value;
    this.unfilteredProd = this.currentShop.produit.filter((item: any) => item.nom.toLowerCase().includes(this.search.toLowerCase()));
    this.unfilteredProd.forEach((element: any) => {
      element.etat == false ? this.mesProduits?.push(element) : null;
    });
  }
  open() {
    document.querySelector('.first-popup')?.classList.remove('hidden');
  }
  ouvre() {
    document.querySelector(".second-popup")?.classList.remove('cache');
  }
  ferme() {
    document.querySelector('.first-popup')?.classList.add('hidden');
  }
  close() {
    document.querySelector('.second-popup')?.classList.add('cache');
  }
  messageRecu(event: any) {
    this.monTotal = event;
  }
  getProduct() {
    this.monPanier.forEach((element: any) => {
      this.intermediaire =
      {
        "quantite": element.quantite,
        "prix": element.prix,
        "produit":
        {
          "id": element.id,
          "nom": element.nom
        }
      }
      this.tabEntier.push(this.intermediaire);
    });
    return this.tabEntier;
  }
  confirmerPaiement() {
    if (this.monTotal == 0) {
      this.httpService.alert("Veuillez selectionner au moins un produit");
    }
    else {
      if (this.currentCashier == undefined) {
        this.body =
        {
          "prixCommande": this.monTotal,
          "montant": this.montant,
          "reste": this.reste,
          "methodePaiement":
          {
            "id": 1
          },
          "boutiquier":
          {
            "id": this.currentUser
          },
          "ligneDeCommandes": this.getProduct(),
          "shop":
          {
            "id": this.currentStore
          }
        }
      }
      // else
      // {
      //   this.body =
      //   {
      //     "prixCommande": this.monTotal,
      //     "montant": this.montant,
      //     "reste": this.reste,
      //     "methodePaiement":
      //     {
      //       "id": 1
      //     },
      //     "boutiquier":
      //     {
      //       "id": this.currentCashier?.boutiquier?.id
      //     },
      //     "ligneDeCommandes": this.getProduct(),
      //     "shop":
      //     {
      //       "id": this.currentCashier?.shop?.id
      //     },
      //     "caissier":
      //     {
      //       "id": this.currentCashier?.id
      //     }
      //   }
      // }
      this.httpService.create(this.httpService.commandeUrl, this.body).subscribe(
        {
          error: () => console.log("Il y'a erreur au niveau de l'ajout de commande'"),
          complete: () => console.log("Commande ajoutée avec succès")
        }
      );
      this.mesProduits.forEach((element: any) => {
        element.quantiteStockTemp ? element.quantiteEnStock = element.quantiteStockTemp : null
        this.produit =
        {
          "quantiteEnStock": element.quantiteEnStock
        }
        this.httpService.update(this.httpService.produitUrl, element.id, this.produit).subscribe(
          {
            error: () => console.log("Il y'a erreur au niveau de la vente"),
            complete: () => {
              this.closeAll();
              this.ferme();
            }
          }
        );
        this.httpService.openSnackBar('Vente effectuée avec succès');
      })
    }
  }
  ecriture() {
    this.montant = +this.form.controls['montant'].value;
    if (this.montant >= this.monTotal && !isNaN(this.montant)) {
      this.reste = this.montant - this.monTotal;
      this.confirmer = true;
    }
    else {
      this.reste = 0;
      this.confirmer = false;
    }
  }
  closeAll() {
    this.monTotal = 0;
    this.indexDBService.clearData('panier');
    this.httpService.items$.subscribe(
      {
        next: () => this.httpService.openSnackBar('Panier vidé avec succès'),
        complete: () => console.log("Completed")
      })
  }
  panier(produit: any) {
    this.httpService.items$.pipe(
      map((mesProduits) => {
        let ajout = mesProduits.find(monProduit => monProduit == produit);
        ajout === undefined ? this.httpService.addToCart(produit) : this.httpService.openSnackBar(`Ce produit est déjà dans le panier`, "poc");
      })
    ).subscribe(
      {
        next: () => null,
        error: () => console.log(`Erreur lors de l'ajout au panier`),
        complete: () => console.log(`Ajout au panier avec succès`)
      }
    )
    this.httpService.items$.subscribe(data => this.monPanier = data);
  }
  selectCategorie(event: any) {
    event === 'vide' ? this.category = null : this.category = event.nom;
  }
  ngOnInit(): void {
    this.indexDBService.getData('currentUser').subscribe(
      (data) => this.currentUser = data.length > 0 ? data[0].user.id : [],
      (error) => console.log("Erreur au niveau de l'obtention de l'utilisateur")
    )
    this.indexDBService.getData('currentShop').subscribe(
      (data) => {
        this.currentStore = data[0]?.boutique?.id;
        if (this.currentStore === undefined) {
          this.spin = false;
        }
        else {
          this.httpService.getById(this.httpService.shopUrl, this.currentStore).subscribe(
            boutique => {
              this.currentShop = boutique;
              boutique?.produit?.forEach((element: any) => element.etat == false ? this.mesProduits?.push(element) : null);
              boutique?.categories?.forEach((element: any) => element.etat == false ? this.mesCategories?.push(element) : null);
              this.spin = false;
            }
          )
        }
      },
      (error) => {
        console.log("Erreur au niveau de l'obtention de la boutique " + error)
      });
    this.form = this.formBuilder.group(
      {
        montant: [""]
      });
  }
}
