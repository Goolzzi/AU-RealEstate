import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
@inject(EventAggregator)

export class PriceFilter {
  constructor(eventAggregator) {
    this.ea = eventAggregator;
    this.priceList = [25000, 50000, 75000, 100000, 125000, 150000, 175000, 200000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000];
    this.minPrice = 25000;
    this.maxPrice = 4000000;
    this.selectedMinPrice = 0;
    this.selectedMaxPrice = 4000000;
    this.minPriceList = this.priceList;
    this.maxPriceList =  this.priceList;
  }
  changeMinPrice(event) {
    let minIndex = this.priceList.indexOf(parseInt(event));
    this.maxPriceList = this.priceList.slice(minIndex + 1);
    this.ea.publish('set-min-price', event);
  }
  changeMaxPrice(event) {
    let maxIndex = this.priceList.indexOf(parseInt(event));
    this.minPriceList = this.priceList.slice(0, maxIndex);
    this.ea.publish('set-max-price', event);
  }
}
