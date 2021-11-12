import {
  AfterViewInit,
  Component,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { Subscription } from "rxjs";
import { DatePickerComponent } from "./date-picker/date-picker.component";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements AfterViewInit {
  readonly numberOfInputs = 10;
  readonly inputs: string[] = [];

  @ViewChildren(DatePickerComponent)
  datePicker: QueryList<DatePickerComponent>;

  clickCount = 0;
  intervalSubscription: number;

  constructor() {
    for (let i = 0; i < this.numberOfInputs; i++) {
      this.inputs.push(`Input ${i}`);
    }
  }
  ngAfterViewInit(): void {
    console.log(this.datePicker);
    this.startClicking();
  }

  startClicking(): void {
    this.clickCount = 0;

    setInterval(() => {
      const index = this.getRandomIntInclusive(0, this.datePicker.length - 1);
      this.datePicker.get(index).triggerInputFocus();
      this.clickCount++;
    }, 100);
  }

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }
}
