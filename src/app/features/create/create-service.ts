import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CreateService {
  private readonly http = inject(HttpClient);

  register(data: unknown) {
    return this.http.post('http://localhost:8080/noise-record', data);
  }
}
