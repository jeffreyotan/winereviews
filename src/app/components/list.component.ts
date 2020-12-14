import { Component, OnInit } from '@angular/core';
import { WebService } from '../web.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  countryList: string[] = [];

  constructor(private webSvc: WebService) { }

  ngOnInit(): void {
    this.populateList();
  }

  async populateList() {
    const results = await this.webSvc.getCountryList();
    // console.info('-> populateList: ', results);
    this.countryList = results as string[];
  }

}
