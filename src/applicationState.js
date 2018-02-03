import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
@inject(EventAggregator)
export class applicationState {

  constructor(eventAggregator) {
    this.eventAggregator = eventAggregator;
    this.loggedInUser = '';
    this.loggedInUserType = '';

    // SignalR Connectivity

    this.signalRurl = 'http://www.realtoranalytics.com';
    //this.signalRurl = '';


    console.log(this.signalRurl);
    this.connectionStatus = 'Disconnected';

    this.connection = $.hubConnection(this.signalRurl);
    this.listingsHub = this.connection.createHubProxy('listingsHub');
    this.adminHub = this.connection.createHubProxy('adminHub');

    console.log('Connecting...');

    this.adminHub.on('broadcastMessage', (subject, data) => {
      console.log('**** Server Message **** ' + subject);
      let payload = {};
      this.eventAggregator.publish(subject, payload);
    });


    this.connection.disconnected( () => {
      console.log('Disconnected');
      this.connectionStatus = 'Disconnected';
      this.ChangeConnectionStatus('Disconnected');
      this.hubConnected = false;
    });

    this.connection.reconnecting( () => {
      console.log('Reconnecting');
      this.connectionStatus = 'Connecting';
      this.ChangeConnectionStatus('Connecting');
      this.hubConnected = false;
    });

    this.connection.reconnected( () => {
      console.log('Reconnected');
      this.connectionStatus = 'Connected';
      this.ChangeConnectionStatus('Connected');
      this.hubConnected = true;
    });
    // System Messages Listener
    this.configuration = {
      optionOne: false,
      optionTwo: false
    };
  }

  detached() {
    console.log('Stopping SignalR Connection');
    this.connection.stop();
  }

  refreshConnection() {
    this.connectionReady = this.connection.start().done(() => {
      console.log('Connected');
      this.connectionStatus = 'Connected';
      this.ChangeConnectionStatus('Connected');
    }).fail(() => {
      console.log('Could not Connect');
      this.connectionStatus = 'Disconnected';
      this.ChangeConnectionStatus('Disconnected');
    });
  }

  ChangeConnectionStatus(connectionStatus) {
    if (connectionStatus === 'Disconnected') {
      $('.connectionStatus').css('background-color', 'Red');
    }
    if (connectionStatus === 'Connected') {
      $('.connectionStatus').css('background-color', 'Green');
    }
    if (connectionStatus === 'Connecting') {
      $('.connectionStatus').css('background-color', 'Orange');
    }
  }
}
