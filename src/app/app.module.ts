import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { DatePickerComponent } from "./date-picker/date-picker.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  declarations: [AppComponent, DatePickerComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
