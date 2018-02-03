import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
@inject(EventAggregator)

export class SqrtFilter {
  constructor(eventAggregator) {
    this.ea = eventAggregator;
    this.sqrtList = [500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3500, 4000, 4500, 5000, 6000];
    this.minSqrt = 0;
    this.maxSqrt = 6000;
    this.selectedMinSqrt = 0;
    this.selectedMaxSqrt = 6000;
    this.minSqrtList = this.sqrtList;
    this.maxSqrtList =  this.sqrtList;
  }
  changeMinSqrt(event) {
    let minIndex = this.sqrtList.indexOf(parseInt(event));
    this.maxSqrtList = this.sqrtList.slice(minIndex + 1);
    this.ea.publish('set-min-sqrt', event);
  }
  changeMaxSqrt(event) {
    let maxIndex = this.sqrtList.indexOf(parseInt(event));
    this.minSqrtList = this.sqrtList.slice(0, maxIndex);
    this.ea.publish('set-max-sqrt', event);
  }
}
