import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpClientService } from '../services.service';
import { IndexDBService } from '../index-db.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-poste-de-vente',
  templateUrl: './poste-de-vente.component.html',
  styleUrls: ['./poste-de-vente.component.scss']
})
export class PosteDeVenteComponent implements OnInit
{
  items$ !: Observable<any[]>;
  data !: any[];
  id = 0;
  spin: boolean = true;
  maQuantite: any;
  ajoutee: any;
  monPanier$ !: Observable<any>;
  mesProduits: any[] = [];
  monTotal: number = 0;
  form !: FormGroup;
  nomProduit = new FormControl('');
  montant !: number;
  reste: number = 0;
  confirmer: boolean = false;
  body: any;
  tabCommandes: any = [];
  intermediaire: any = [];
  tabEntier: any = [];
  produit !: { quantiteEnStock: any; };
  receipt: any = [];
  currentStore: any;
  currentShop: any;
  currentUser: any;
  currentCashier: any;
  currentSeller: any;
  product: any;
  search: any = '';
  category: any;
  mesCategories: any[] = [];
  unfilteredProd: any;
  monProduit: any[] = [];
  mesCommandes: any[] = [];
  public messaged !: string;

  constructor(
    private httpService: HttpClientService,
    private indexDBService: IndexDBService,
    private formBuilder: FormBuilder,
    public location: Location,
  )
  {

  }

  recherche()
  {
    this.mesProduits = [];
    this.search = this.nomProduit.value;
    this.unfilteredProd = this.currentShop.produit.filter((item: any) => item.nom.toLowerCase().includes(this.search.toLowerCase()));
    this.unfilteredProd.forEach((element: any) =>
    {
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
  getProduct()
  {
    this.monPanier$.subscribe(
      panier =>
      {
        panier.forEach((element : any) =>
        {
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
      }
    )
    return this.tabEntier;
  }
  confirmerPaiement()
  {
    if (this.monTotal == 0)
    {
      this.httpService.alert("Veuillez selectionner au moins un produit");
    }
    else
    {
      if (this.currentCashier == undefined)
      {
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
          error : (error : any) =>
          {
            console.log("Il y'a erreur au niveau de l'ajout de commande'")
          },
          complete : () =>
          {
            console.log("Commande ajoutée avec succès")
          }
        }
      );
      this.mesProduits.forEach((element: any) =>
      {
        this.produit =
        {
          "quantiteEnStock": element.quantiteEnStock
        }
        this.httpService.update(this.httpService.produitUrl,element.id,this.produit).subscribe(
          {
            error : (error : any) =>
            {
              console.log("Il y'a erreur au niveau de la vente")
            },
            complete : () =>
            {
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
    if (this.montant >= this.monTotal && !isNaN(this.montant))
    {
      this.reste = this.montant - this.monTotal;
      this.confirmer = true;
    }
    else
    {
      this.reste = 0;
      this.confirmer = false;
    }
  }
  closeAll()
  {
    this.monTotal = 0;
    this.indexDBService.clearData('panier');
  }
  panier(produit: any)
  {
    this.httpService.addToCart(produit)
    this.monPanier$ = this.httpService.items$;
    // this.httpService.items$.subscribe(
    //   (data) =>
    //   {
    //     this.monPanier = data
    //     this.monTotal += this.monPanier ? this.monPanier[this.monPanier.length - 1].prix : 0
    //   }
    // )
    // this.indexDBService.getData('panier').subscribe((data) =>
    // {
    //   this.monPanier = data[0].panier;
    //   this.monTotal += this.monPanier ? this.monPanier[this.monPanier.length - 1].prix : 0;
    // });
  }
  selectCategorie(event: any)
  {
    this.category = event.nom;
  }
  ngOnInit(): void
  {
    this.indexDBService.getData('currentUser').subscribe(
      (data) =>
      {
        this.currentUser = data.length > 0 ? data[0].user.id : [];
      },
      (error) =>
      {
        console.log("Erreur au niveau de l'obtention de l'utilisateur")
      }
    )
    this.indexDBService.getData('currentShop').subscribe(
      (data) =>
      {
        this.currentStore = data.length > 0 ? data[0].boutique.id : [];
        this.httpService.getById(this.httpService.shopUrl, this.currentStore).subscribe(
          boutique =>
          {
            this.currentShop = boutique;
            boutique?.produit?.forEach((element: any) =>
            {
              element.etat == false ? this.mesProduits?.push(element) : null;
            });
            boutique?.categories?.forEach((element: any) =>
            {
              element.etat == false ? this.mesCategories?.push(element) : null;
            });
            this.spin = false;
          }
        )
      },
      (error) =>
      {
        console.log("Erreur au niveau de l'obtention de la boutique " + error)
      });
    this.form = this.formBuilder.group(
    {
      montant: [""]
    });
  }
}
