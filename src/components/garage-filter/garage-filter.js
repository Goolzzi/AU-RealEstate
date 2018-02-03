import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
@inject(EventAggregator)

export class GarageFilter {
  constructor(eventAggregator) {
    this.ea = eventAggregator;
    this.index = 0;
  }
  changeValue(mode) {
    if (mode) {
      this.index ++;
    } else {
      if (this.index > 0 ) {
        this.index --;
      }
    }
    this.ea.publish('set_garage', this.index);
  }
}
