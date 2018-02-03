import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
@inject(EventAggregator)

export class LotFilter {
  constructor(eventAggregator) {
    this.ea = eventAggregator;
    this.lotList = [2000, 4500, 6500, 8000, 10890, 21780, 32670, 43560, 87120, 130680, 174240, 217800, 435600, 1742400, 4356000];
    this.minLot = 0;
    this.maxLot = 5000000;
    this.selectedMinLot = 0;
    this.selectedMaxLot = 5000000;
    this.minLotList = this.lotList;
    this.maxLotList =  this.lotList;
  }
  changeMinLot(event) {
    let minIndex = this.lotList.indexOf(parseInt(event));
    this.maxLotList = this.lotList.slice(minIndex + 1);
    this.ea.publish('set-min-lot', event);
  }
  changeMaxLot(event) {
    let maxIndex = this.lotList.indexOf(parseInt(event));
    this.minLotList = this.lotList.slice(0, maxIndex);
    this.ea.publish('set-max-lot', event);
  }
}
