import { Observable, fromEvent } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable(
{
  providedIn: 'root',
})
export class IndexDBService
{
  private currentSellings = 'currentSellings';
  private currentShop = 'currentShop';
  private currentUser = 'currentUser';
  private dbName = 'Jayfii';
  private panier = 'panier';
  private db!: IDBDatabase;

  constructor()
  {
    this.openDB();
  }

  openDB()
  {
    let request = window.indexedDB.open(this.dbName, 1);
    const objectStoreNames = [this.currentUser, this.currentShop, this.panier, this.currentSellings];
    request.onerror = (event: any) => 'Database error: ' + event.target.errorCode;
    request.onupgradeneeded = (event: any) =>
    {
      this.db = event.target.result;
      for (const objectStoreName of objectStoreNames)
      {
        this.db.createObjectStore(objectStoreName, { keyPath: 'id' });
      }
    };
    request.onsuccess = (event: any) => this.db = event.target.result;
  }

  getData(storeName : any): Observable<any[]>
  {
    return new Observable((subscriber) =>
    {
      const request = window.indexedDB.open(this.dbName, 1);
      request.onsuccess = (event : any) =>
      {
        const transaction = this.db.transaction([storeName], 'readonly');
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.getAll();
        request.onsuccess = () =>
        {
          subscriber.next(request.result);
          subscriber.complete();
        };
      }
    })
  }

  addData(data: any, storeName : any): Observable<any>
  {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.add(data);
    return fromEvent(request, 'success').pipe(map(() => data));
  }

  putData(data: any, storeName : any): Observable<any>
  {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.put(data);
    return fromEvent(request, 'success').pipe(map(() => data));
  }

  clearData(storeName: any)
  {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.clear();
    return fromEvent(request, 'success').subscribe();
  }

  clearDatabase()
  {
    const request = indexedDB.deleteDatabase(this.dbName);
    return fromEvent(request, 'success').subscribe();
  }

}
