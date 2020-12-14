import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WineSummary } from '../models';
import { WebService } from '../web.service';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  country: string = "";
  offset: number = 0;
  limit: number = 30;
  wineList: WineSummary[] = [];

  constructor(private activatedRoute: ActivatedRoute, private webSvc: WebService) { }

  ngOnInit(): void {
    this.country = this.activatedRoute.snapshot.params['country'];
    this.offset = this.activatedRoute.snapshot.queryParams['offset'];
    this.limit = this.activatedRoute.snapshot.queryParams['limit'];
    console.info(`-> onInit with country: ${this.country}, offset: ${this.offset} and limit: ${this.limit}`);

    this.getWineList();
  }

  async getWineList() {
    const results: WineSummary[] = await this.webSvc.getWineList(this.country, this.limit, this.offset) as WineSummary[];
    console.info('-> getWineList: ', results);

    results.forEach(element => {
      this.wineList.push(element as WineSummary);
    });
  }

}
