import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { isDateValid } from 'ngx-bootstrap/chronos';
import {
  BsDatepickerConfig,
  BsDatepickerDirective,
} from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  @Input() title = '';
  @Input() required = false;
  @Input() dark = false;
  @Input() readonly = false;
  @Input() errorMessage = '';
  @Input() smallPicker = false;
  @Input() rangePicker = false;
  @Input() isSearchbox = false;
  @Input() isBold = false;

  @Output() valueChange = new EventEmitter<string | null>();
  @Output() valueRangeChange = new EventEmitter<Date[]>();
  @Output() changedValue = new EventEmitter<boolean>();
  @Output() focusLost = new EventEmitter<Date>();

  @ViewChild(BsDatepickerDirective) datePicker!: BsDatepickerDirective;
  @ViewChild('datepickerInput') datePickerInput!: ElementRef;
  @ViewChild('titleInput') titleInput!: ElementRef;

  /**
   * Getter for value
   */
  get value(): Date {
    return this._value;
  }
  /**
   * Setter for value.
   * @param value the value to be set.
   */
  @Input()
  set value(value: Date | string) {
    if (typeof value === 'string') {
      value = value as string;
      this._value = new Date(value);
    } else if (isDateValid(value) || !value) {
      this._value = value as Date;
      this.valueChange.emit(value ? this._value.toISOString() : null);
    }
  }

  /**
   * Getter for value range
   */
  get valueRange(): Date[] {
    return this._valueRange;
  }

  /**
   * Setter for value range
   * @param value the value to be set.
   */
  @Input()
  set valueRange(value: Date[]) {
    if (value) {
      this._valueRange = value;
      this.valueRangeChange.emit(value);
    }

    this.changeDetection.detectChanges();
  }

  bsConfig!: Partial<BsDatepickerConfig>;
  isHovering = false;
  defaultTooltipDelay = 200;
  lastValidDate!: Date;
  placeholderTruncated!: boolean;

  private _value!: Date;
  private _valueRange!: Date[];
  private initialValue!: Date;

  constructor(private changeDetection: ChangeDetectorRef) {
    this.loadDialogConfig();
  }

  /**
   * Initialize component
   */
  ngOnInit(): void {
    this.initialValue = this._value;
    this.loadDialogConfig();
  }

  /**
   * Get Date-Format based on locale
   * @returns { string } Date-Format
   */
  getDateFormat(): string {
    return 'dd.MM.yyyy';
  }

  /**
   * Toggle Datepicker
   */
  triggerInputFocus(): void {
    this.datePickerInput.nativeElement.focus();
  }

  /**
   * Assembels configuration object for Boostrap Datepicker
   */
  loadDialogConfig(): void {
    this.bsConfig = Object.assign(
      {},
      { showWeekNumbers: false },
      { customTodayClass: 'custom-today-class' },
      { containerClass: this.getContainerClass() },
      { dateInputFormat: this.getDateFormat() },
      { adaptivePosition: false }
    );
  }

  /**
   * Assembles a string with needed classes for the Bootstrap Datepicker based on inputs
   * @returns {string} Class String with needed classes
   */
  getContainerClass(): string {
    const seperator = ' ';
    let containerClass = 'custom-date-picker ag-custom-component-popup';

    if (this.dark) {
      containerClass += seperator + 'dark-picker';
    }
    if (this.smallPicker) {
      containerClass += seperator + 'small';
    }

    return containerClass;
  }

  /**
   * Compares two variables of type Date only by Date not by time
   * @param dateA Date that should be compared
   * @param dateB Date that should be compared
   * @returns { boolean } if dataA quals dateB by Date only
   */
  compareDateWithoutTime(dateA: Date, dateB: Date): boolean {
    return dateA && dateB
      ? dateA.toDateString() === dateB.toDateString()
      : false;
  }

  /**
   * Handle value change on bootstrap datepicker
   * @param date new selected date
   */
  onDateChange(date: Date): void {
    if (date && date.toDateString() === 'Invalid Date') {
      date = this.lastValidDate ? this.lastValidDate : new Date();
      this.value = new Date(date);
    }
    if (!this.compareDateWithoutTime(this.initialValue, date) && date) {
      this.lastValidDate = new Date(date);
      this._value = date;
      this.valueChange.emit(date.toISOString());

      this.changedValue.emit(true);
    } else {
      this.changedValue.emit(false);
    }

    this.value = date;
  }
}
