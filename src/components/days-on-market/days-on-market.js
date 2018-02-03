import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
@inject(EventAggregator)

export class DaysOnMarket {
  constructor(eventAggregator) {
    this.ea = eventAggregator;
    this.default = 31;
    this.lists = [
      {
        name: 'One Day',
        days: 1
      },
      {
        name: '3 Days',
        days: 3
      },
      {
        name: 'Week',
        days: 7
      },
      {
        name: 'Month',
        days: 31
      },
      {
        name: 'Up to 3 Months',
        days: 90
      },
      {
        name: 'Up to 6 Months',
        days: 180
      },
      {
        name: 'No Limit',
        days: 0
      },
      {
        name: 'More than 180 days',
        days: -30
      }
    ];
  }
  changeDays(data) {
    this.ea.publish('set_days_on_market', data);
  }
}
