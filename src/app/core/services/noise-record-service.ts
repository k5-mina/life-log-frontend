import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NoiseRecordCreateRequest } from '../../models/noise-record-create-request.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NoiseRecordCountResponse } from '../../models/noise-record-count-response.model';

@Injectable({
  providedIn: 'root',
})
export class NoiseRecordService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/noise-record`;

  register(record: NoiseRecordCreateRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl, record);
  }

  getRecordCount(year: number, month: number): Observable<NoiseRecordCountResponse[]> {
    return this.http.get<NoiseRecordCountResponse[]>(`${this.apiUrl}/counts`, {
      params: { year, month },
    });
  }
}
