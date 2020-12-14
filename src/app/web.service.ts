import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()
export class WebService {

    listUrl: string = '/api/countries';
    oneCountryUrl: string = '/api/country';
    detailUrl: string = '/api/wine';

    constructor(private http: HttpClient) {}

    async getCountryList() {
        return await this.http.get(this.listUrl).toPromise();
    }

    async getWineList(country: string, limit: number, offset: number) {
        const qs = new HttpParams()
            .set('offset', offset.toString())
            .set('limit', limit.toString());
        return await this.http.get(`${this.oneCountryUrl}/${country}`, { params: qs }).toPromise();
    }

    async getWineDetails(_id: string) {
        return await this.http.get(`${this.detailUrl}/${_id}`).toPromise();
    }
    
}
