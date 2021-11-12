import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { isDateValid } from 'ngx-bootstrap/chronos';
import { BsDatepickerConfig, BsDatepickerDirective, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit, OnDestroy, OnChanges {
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
  private initialRangeValue!: Date[];
  private destroy$ = new Subject<boolean>();

  constructor(
    private localeService: BsLocaleService,
    private changeDetection: ChangeDetectorRef
  ) {
    this.loadDialogConfig();
  }

  /**
   *
   * @param event the window resize event
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkForTruncation();
  }

  /**
   * Initialize component
   */
  ngOnInit(): void {
    this.initialRangeValue = this._valueRange;
    this.initialValue = this._value;
    this.loadDialogConfig();
  }

  /**
   *
   */
  ngOnChanges(): void {
    this.checkForTruncation();
  }

  /**
   * End subscriptions on destroy
   */
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  bigClicked(): void {
    this.datePickerInput.nativeElement.focus();
  }

  /**
   * Get Date-Format based on locale
   * @returns { string } Date-Format
   */
  getDateFormat(): string {
    return "dd.MM.yyyy"
  }

  /**
   * If the user enters the component with the mouse, activate hover styling
   */
  onMouseEnter() {
    this.isHovering = true;
  }

  /**
   * If the user leaves the component with the mouse, deactivate hover styling
   */
  onMouseLeave() {
    this.isHovering = false;
  }

  /**
   * Toggle Datepicker
   */
  triggerInputFocus(): void {
    this.datePickerInput.nativeElement.focus();
  }
  /**
   * Sets picker state to false
   */
  pickerHidden() {
    this.checkForTruncation();
    this.focusLost.emit(this.value);
  }

  /**
   * Sets picker state to true
   */
  pickerShown() {
  }

  /**
   * Reset Value to initial value
   */
  resetValue(): void {
    this._value = this.initialValue;
    this.valueChange.emit(this._value.toISOString());
  }

  /**
   * Reset Range Value to initial value
   */
  resetRangeValue(): void {
    this._valueRange = this.initialRangeValue;
    this.valueRangeChange.emit(this._valueRange);
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
   * Shows clear-Icon when input is not empty and picker is searchbox
   * @returns {boolean} is empty
   */
  isEmpty(): boolean {
    return this.rangePicker ? !this.valueRange : !this.value;
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
    return dateA && dateB ? dateA.toDateString() === dateB.toDateString() : false;
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

  /**
   * Checks whether to show a tooltip or not, based on if the placeholder/title overflows the input
   */
  checkForTruncation(): void {
    // const timeoutTimeForTooltips = 50;
    // setTimeout(() => {
    //   if (this.appearance === TextInputAppearance.PLACEHOLDER) {
    //     this.placeholderTruncated = this.truncatedTooltipPlaceholderService.isPlaceholderTruncated(
    //       this.datePickerInput,
    //       this.title
    //     );
    //   } else if (this.appearance === TextInputAppearance.TITLE) {
    //     this.placeholderTruncated = this.truncatedTooltipPlaceholderService.isPlaceholderTruncated(
    //       this.titleInput,
    //       this.title
    //     );
    //   }
    // }, timeoutTimeForTooltips);
  }

  /**
   * Handle value change on bootstrap datepicker
   * @param dates new selected date
   */
  onDateRangeChange(dates: Date[]): void {
    if (this._valueRange !== dates) {
      this._valueRange = dates;
      this.valueRangeChange.emit(dates);
      this.changedValue.emit(true);
    }
  }

  /**
   * Clears Input
   */
  onClearButtonClicked(): void {
    this.rangePicker ? this.resetRangeValue() : this.resetValue();
    this.pickerHidden();
  }

  /**
   * triggered when the field lost the focus.
   */
  onFocus() {
    this.datePicker.show();
  }

  /**
   * Triggered when a key is pressed in the input
   * @param event the event
   */
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      this.datePicker.hide();
    }
  }
}
