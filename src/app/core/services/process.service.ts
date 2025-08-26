// layout/service/ProcessService.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ProcessModel } from '../model/process.model';

@Injectable({ providedIn: 'root' })
export class ProcessService {
  private baseUrl = '/api/processes'; // ✅ adjust this to your backend endpoint

  constructor(private http: HttpClient) {}

  getProcesses(): Observable<ProcessModel[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(response => {
        return response.processAppsList.map((p: any) => ({
          id: p.ID,
          name: p.name,
          description: p.description,
          richDescription: p.richDescription,
          lastModifiedBy: p.lastModifiedBy,
          version: p.defaultVersion,
          createdDate: new Date(p.lastModified_on),
          shortName: p.shortName
        }));
      })
    );
  }
}
