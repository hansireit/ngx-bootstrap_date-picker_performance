import { Component, VERSION } from "@angular/core";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  readonly numberOfInputs = 20;
  readonly inputs: string[] = [];

  constructor() {
    for (let i = 0; i < this.numberOfInputs; i++) {
      this.inputs.push(`Input ${i}`);
    }
  }
}
