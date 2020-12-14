import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WineDetails } from '../models';
import { WebService } from '../web.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  _id: string = "";
  wineDetails: WineDetails = {
    _id: "",
    country: "",
    description: "",
    designation: "",
    points: 0,
    price: 0,
    province: "",
    region_1: "",
    region_2: "",
    taster_name: "",
    taster_twitter_handle: "",
    title: "",
    variety: "",
    winery: ""
  };

  constructor(private activatedRoute: ActivatedRoute, private webSvc: WebService) { }

  ngOnInit(): void {
    this._id = this.activatedRoute.snapshot.params['id'];
    this.getWineDetails();
  }

  async getWineDetails() {
    const results = await this.webSvc.getWineDetails(this._id);
    console.info('-> Wine Details: ', results);

    this.wineDetails = results[0] as WineDetails;
  }

}
