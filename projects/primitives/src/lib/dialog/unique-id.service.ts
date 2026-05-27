import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UniqueIdService {
  private counter = 0;

  generateId(prefix = 'ap-id'): string {
    return `${prefix}-${this.counter++}`;
  }
}
