import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()
export class WebService {

    listUrl: string = '/api/countries';
    oneCountryUrl: string = '/api/country';

    constructor(private http: HttpClient) {}

    async getCountryList() {
        return await this.http.get(this.listUrl).toPromise();
    }
    
}
