import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
@inject(EventAggregator)

export class YearFilter {
  constructor(eventAggregator) {
    this.ea = eventAggregator;
    this.yearList = this.getYearList();
    this.minYear = 1900;
    this.maxYear = new Date().getFullYear();
    this.selectedMinYear = 1900;
    this.selectedMaxYear = new Date().getFullYear();
    this.minYearList = this.yearList;
    this.maxYearList =  this.yearList;
  }
  getYearList() {
    let date = new Date();
    let list = []
    for (let i = date.getFullYear() ; i > 1900; i--){
      list.push(i);
    }
    return list;
  }
  changeMinYear(event) {
    let minIndex = this.yearList.indexOf(parseInt(event));
    this.maxYearList = this.yearList.slice(0, minIndex);
    this.ea.publish('set-min-year', event);
  }
  changeMaxYear(event) {
    let maxIndex = this.yearList.indexOf(parseInt(event));
    this.minYearList = this.yearList.slice(maxIndex + 1);
    this.ea.publish('set-max-year', event);
  }
}
