import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
@inject(EventAggregator)

export class BedFilter {
  constructor(eventAggregator) {
    this.ea = eventAggregator;
    this.bedList = [1, 2, 3, 4, 5, 6];
    this.minBeds = 0;
    this.maxBeds = 6;
    this.selectedMinBeds = 0;
    this.selectedMaxBeds = 6;
    this.minBedList = this.bedList;
    this.maxBedList =  this.bedList;
  }
  changeMinBed(event) {
    let minIndex = this.bedList.indexOf(parseInt(event));
    this.maxBedList = this.bedList.slice(minIndex);
    this.ea.publish('set-min-bed', event);
  }
  changeMaxBed(event) {
    let maxIndex = this.bedList.indexOf(parseInt(event));
    this.minBedList = this.bedList.slice(0, maxIndex);
    this.ea.publish('set-max-bed', event);
  }
}
