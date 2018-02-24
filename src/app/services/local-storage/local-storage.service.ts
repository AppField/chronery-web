import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() {
  }

  saveItem(key: string, item: any): void {
    localStorage.setItem(key, JSON.stringify(item));
  }

  getItem(key: string): any {
    return JSON.parse(localStorage.getItem(key));
  }

  deleteItem(key: string): void {
    localStorage.removeItem(key);
  }

  clearStorage(): void {
    localStorage.clear();
  }
}
