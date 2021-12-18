import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

	private url = 'https://localhost:7087/employees';

	constructor(private http: HttpClient) { }

	public getEmployees() {
		return this.http.get(this.url);
	}
}
