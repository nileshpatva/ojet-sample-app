import * as AccUtils from '../accUtils';
import * as ko from 'knockout';
import * as Message from 'ojs/ojmessaging';
import 'ojs/ojknockout';
import 'ojs/ojinputtext';
import 'ojs/ojlabel';
import 'ojs/ojbutton';
import 'ojs/ojformlayout';
import 'ojs/ojcollapsible';
import AsyncLengthValidator = require('ojs/ojasyncvalidator-length');
// import AsyncRegExpValidator = require('ojs/ojasyncvalidator-regexp');
import Validator = require('ojs/ojvalidator');
import { ojValidationGroup } from 'ojs/ojvalidationgroup';
import 'ojs/ojvalidationgroup';

/**
 * custom validator function or object creator function
 * @param minMaxObj min length max length object
 * @param regex regular expression to validate the value
 */
function createValidatorObj(minMaxObj, regex?: string) {
  const { min, max } = minMaxObj;
  let regX;

  if (regex) regX = new RegExp(regex);

  return {
    validate: (value: string) => {
      if (!value) return;
      else if (value.length < min || value.length > max) {
        throw new Error(`${min}-${max} characters (A-Z, a-z, 0-9)`);
      } else if (!regX.test(value)) {
        throw new Error(`${min}-${max} characters (A-Z, a-z, 0-9 only)`);
      }

      return;
    }
  };
}

class DashboardViewModel {
  private readonly secondaryIcon = 'oj-icon-color-disabled';
  private readonly warningIcon = 'oj-icon-color-warning';
  private readonly successIcon = 'oj-icon-color-success';

  info: ko.Observable<string>;

  name: ko.Observable<string>;
  longName: ko.Observable<string>;
  discription: ko.Observable<string>;

  groupValid: ko.Observable<string | null | undefined>;

  nameValid: ko.Observable<string | null | undefined>;
  longNameValid: ko.Observable<string | null | undefined>;
  discriptionValid: ko.Observable<string | null | undefined>;

  groupCssClass: ko.Observable<string>;
  nameCssClass: ko.Observable<string>;
  longNameCssClass: ko.Observable<string>;

  nameValidator: ko.ObservableArray<Validator<string>>;
  longNameValidator: ko.ObservableArray<Validator<string>>;
  discriptionValidator: ko.ObservableArray<Validator<string>>;

  constructor() {}

  /**
   * Optional ViewModel method invoked after the View is inserted into the
   * document DOM.  The application can put logic that requires the DOM being
   * attached here.
   * This method might be called multiple times - after the View is created
   * and inserted into the DOM and after the View is reconnected
   * after being disconnected.
   */
  connected(): void {
    AccUtils.announce('Dashboard page loaded.');
    document.title = 'Dashboard';
    // implement further logic if needed

    this.info = ko.observable('');

    this.name = ko.observable('');
    this.longName = ko.observable('');
    this.discription = ko.observable('');

    this.groupValid = ko.observable();

    this.nameValid = ko.observable();
    this.longNameValid = ko.observable();
    this.discriptionValid = ko.observable();

    this.groupCssClass = ko.observable(this.secondaryIcon);
    this.nameCssClass = ko.observable(this.secondaryIcon);
    this.longNameCssClass = ko.observable(this.secondaryIcon);

    this.nameValid.subscribe(() => {
      this.nameCssClass(
        this.nameValid() === 'valid' ? this.successIcon : this.secondaryIcon
      );
    });

    this.longNameValid.subscribe(() => {
      this.longNameCssClass(
        this.longNameValid() === 'valid' ? this.successIcon : this.secondaryIcon
      );
    });

    this.groupValid.subscribe(() => {
      this.groupCssClass(
        this.groupValid() === 'valid' ? this.successIcon : this.warningIcon
      );
    });

    this.nameValidator = ko.observableArray([
      createValidatorObj({ min: 8, max: 44 }, '^[-a-zA-Z0-9 ]*$')
    ]);

    this.longNameValidator = ko.observableArray([
      createValidatorObj({ min: 8, max: 255 }, '^[-a-zA-Z0-9 ]*$')
    ]);

    this.discriptionValidator = ko.observableArray([
      new AsyncLengthValidator({
        max: 4000
      })
    ]);
  }

  /**
   * Optional ViewModel method invoked after the View is disconnected from the DOM.
   */
  disconnected(): void {
    // implement if needed
  }

  /**
   * Optional ViewModel method invoked after transition to the new View is complete.
   * That includes any possible animation between the old and the new View.
   */
  transitionCompleted(): void {
    // implement if needed
  }

  onSubmit = (event) => {
    const companyInfo = {
      Info: {
        Name: this.name(),
        LongName: this.longName(),
        Discription: this.discription()
      }
    };

    console.log(`Final Object: `, companyInfo);
    this.info(JSON.stringify(companyInfo, null, 2));
  };
}
export = DashboardViewModel;
