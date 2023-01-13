import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Drone, Drones, Position, Scan } from './api-interfaces';
import { BASE_API_URL } from './app.module';

@Injectable({
  providedIn: 'root'
})
export class DroneLogicService {

  constructor(private http: HttpClient,
              @Inject(BASE_API_URL) private baseApiUrl: string) { }

  public getDrones(): Observable<Drones> {
    return this.http.get<Drones>(`${this.baseApiUrl}/drones`);
  }

  public activeDrone(id: number): Observable<unknown> {
    return this.http.post<unknown>(`${this.baseApiUrl}/drones/${id}/activate`, {});
  }

  public shutdownDrone(id: number): Observable<unknown> {
    return this.http.post<unknown>(`${this.baseApiUrl}/drones/${id}/shutdown`, {});
  }

  public flyTo(id: number, posX: number, posY: number): Observable<Position> {
    const body = {
      x: posX,
      y: posY
    };
    return this.http.post<Position>(`${this.baseApiUrl}/drones/${id}/flyTo`, body);
  }

  public scanArea(id: number): Observable<Scan> {
    return this.http.get<Scan>(`${this.baseApiUrl}/drones/${id}/scan`);
  }

  public markAsExamined(x: number, y: number): Observable<unknown> {
    const body = {
      x: x,
      y: y
    };
    return this.http.post<unknown>(`${this.baseApiUrl}/trees/markAsExamined`, body);
  }
}
