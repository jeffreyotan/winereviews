import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { WebService } from './web.service';
import { ListComponent } from './components/list.component';
import { DetailsComponent } from './components/details.component';

const ROUTES: Routes = [
  { path: "", component: ListComponent },
  { path: "home", component: ListComponent },
  { path: "/country/:country", component: DetailsComponent },
  { path: "**", redirectTo: '/', pathMatch: "full"}
];

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule
  ],
  providers: [
    WebService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
