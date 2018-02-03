import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
@inject(EventAggregator)

export class LastUpdated {
  constructor(eventAggregator) {
    this.ea = eventAggregator;
    this.default = 31;
    this.lists = [
      {
        name: 'Today',
        days: 1
      },
      {
        name: 'Last 3 Days',
        days: 3
      },
      {
        name: 'Last Week',
        days: 7
      },
      {
        name: 'Last Month',
        days: 31
      },
      {
        name: 'Last 3 Months',
        days: 90
      },
      {
        name: 'Last 6 Months',
        days: 180
      },
      {
        name: 'No Limit',
        days: 0
      },
      {
        name: 'Older than 180 days',
        days: -180
      }
    ];
  }
  changeDays(data) {
    this.ea.publish('set_last_updated', data);
  }
}
