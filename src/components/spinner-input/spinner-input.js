import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
@inject(EventAggregator)

export class SpinnerInput {
  constructor(eventAggregator) {
    this.ea = eventAggregator;
    this.value = [0, 1, 1.25, 2, 3, 4, 5, 6];
    this.index = 0;
  }
  changeValue(mode) {
    if (mode) {
      if (this.index < this.value.length-1) {
        this.index ++;
      }
    } else {
      if (this.index > 0 ) {
        this.index --;
      }
    }
    this.ea.publish('set_baths', parseFloat(this.value[this.index]));
  }
}
