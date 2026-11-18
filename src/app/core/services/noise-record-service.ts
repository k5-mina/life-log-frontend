import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NoiseRecordCreateRequest } from '../../models/noise-record-create-request.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NoiseRecordService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/noise-record`;

  register(record: NoiseRecordCreateRequest): Observable<void> {
    return this.http.post<void>(this.apiUrl, record);
  }
}
