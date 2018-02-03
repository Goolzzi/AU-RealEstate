define('app',['exports', 'aurelia-framework', 'applicationState', 'bootstrap'], function (exports, _aureliaFramework, _applicationState) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_applicationState.applicationState), _dec(_class = function () {
    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Welcome';
      config.map([{
        route: ['', 'Listings'],
        name: 'Listings',
        moduleId: './listings',
        nav: true,
        title: 'Listings'
      }, {
        route: 'Find',
        name: 'Find',
        moduleId: './listings',
        nav: true,
        title: 'Find'
      }, {
        route: 'Listings',
        name: 'Projects',
        moduleId: './listings',
        nav: true,
        title: 'Projects'
      }]);

      this.router = router;
    };

    function App(appState) {
      _classCallCheck(this, App);

      this.message = 'Welcome to Aurelia!';

      this.appState = appState;
    }

    App.prototype.refreshConnection = function refreshConnection() {
      this.appState.refreshConnection();
    };

    App.prototype.attached = function attached() {
      console.log('Main App Attached');
      this.refreshConnection();
      $('.splash').hide();
    };

    App.prototype.activate = function activate() {};

    return App;
  }()) || _class);
});
define('applicationState',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.applicationState = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var applicationState = exports.applicationState = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function applicationState(eventAggregator) {
      var _this = this;

      _classCallCheck(this, applicationState);

      this.eventAggregator = eventAggregator;
      this.loggedInUser = '';
      this.loggedInUserType = '';

      this.signalRurl = 'http://www.realtoranalytics.com';


      console.log(this.signalRurl);
      this.connectionStatus = 'Disconnected';

      this.connection = $.hubConnection(this.signalRurl);
      this.listingsHub = this.connection.createHubProxy('listingsHub');
      this.adminHub = this.connection.createHubProxy('adminHub');

      console.log('Connecting...');

      this.adminHub.on('broadcastMessage', function (subject, data) {
        console.log('**** Server Message **** ' + subject);
        var payload = {};
        _this.eventAggregator.publish(subject, payload);
      });

      this.connection.disconnected(function () {
        console.log('Disconnected');
        _this.connectionStatus = 'Disconnected';
        _this.ChangeConnectionStatus('Disconnected');
        _this.hubConnected = false;
      });

      this.connection.reconnecting(function () {
        console.log('Reconnecting');
        _this.connectionStatus = 'Connecting';
        _this.ChangeConnectionStatus('Connecting');
        _this.hubConnected = false;
      });

      this.connection.reconnected(function () {
        console.log('Reconnected');
        _this.connectionStatus = 'Connected';
        _this.ChangeConnectionStatus('Connected');
        _this.hubConnected = true;
      });

      this.configuration = {
        optionOne: false,
        optionTwo: false
      };
    }

    applicationState.prototype.detached = function detached() {
      console.log('Stopping SignalR Connection');
      this.connection.stop();
    };

    applicationState.prototype.refreshConnection = function refreshConnection() {
      var _this2 = this;

      this.connectionReady = this.connection.start().done(function () {
        console.log('Connected');
        _this2.connectionStatus = 'Connected';
        _this2.ChangeConnectionStatus('Connected');
      }).fail(function () {
        console.log('Could not Connect');
        _this2.connectionStatus = 'Disconnected';
        _this2.ChangeConnectionStatus('Disconnected');
      });
    };

    applicationState.prototype.ChangeConnectionStatus = function ChangeConnectionStatus(connectionStatus) {
      if (connectionStatus === 'Disconnected') {
        $('.connectionStatus').css('background-color', 'Red');
      }
      if (connectionStatus === 'Connected') {
        $('.connectionStatus').css('background-color', 'Green');
      }
      if (connectionStatus === 'Connecting') {
        $('.connectionStatus').css('background-color', 'Orange');
      }
    };

    return applicationState;
  }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('listings',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'aurelia-router', 'applicationState', 'numeral'], function (exports, _aureliaFramework, _aureliaEventAggregator, _aureliaRouter, _applicationState, _numeral) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.listings = undefined;

  var _numeral2 = _interopRequireDefault(_numeral);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor;

  var listings = exports.listings = (_dec = (0, _aureliaFramework.inject)(_applicationState.applicationState, _aureliaRouter.Router, _aureliaEventAggregator.EventAggregator), _dec(_class = (_class2 = function () {
    function listings(appState, router, eventAggregator) {
      _classCallCheck(this, listings);

      this.listings = [];
      this.sortColumn = 'StatusHours';
      this.sortOrder = 'ascending';
      this.currentAddress = 'Seattle, WA';
      this.longitude = -122.349275;
      this.latitude = 47.620548;
      this.POIs = [{
        POIID: 0,
        POIName: 'None'
      }];
      this.filters = {
        Style: [],
        MinBeds: [0],
        MaxBeds: [0],
        MinSqft: [],
        MaxSqft: [6000],
        POIMaxDriveTime: [300],
        POI: [],
        MHA: [],
        MHA2: [],
        UV: [],
        FUV: [],
        DOM: [0],
        STATDAYS: [31],
        MinPrice: [0],
        MaxPrice: [0],
        MinLot: [0],
        MaxLot: [5000000],
        ListingStatus: ['A'],
        Zoning: [],
        Use: [],
        MinBaths: [0],
        MinYear: [0],
        MaxYear: [0],
        MustBsmnt: [0],
        SplitOK: [1],
        OneStory: [0],
        MinGarage: [0],
        GarageCvr: [0],
        Waterfront: [0],
        Views: [0],
        hasAC: [0],
        Kitchen2nd: [0],
        Fence: [0],
        FenceFull: [0],
        MasterBth: [0]
      };

      _initDefineProp(this, 'mapMarkers', _descriptor, this);

      this.appState = appState;
      this.router = router;
      this.eventAggregator = eventAggregator;
      this.firstTime = true;
      this.tableType = 'compact';
      this.zoomRate = 10;
      this.bounds = null;
    }

    listings.prototype.attached = function attached() {
      var _this = this;

      this.appState.connectionReady.done(function () {
        _this.refreshData();
        _this.loadPOIs();
      });
      this.eventAggregator.subscribe('googlemap:marker:click', function (response) {
        _this.clickRow('', response.custom.id, '');
        var dif = $('#listingsTableDiv').offset().top - $('#listingsTableID').offset().top + $('#listingsTableRow_' + response['custom']['id']).position().top - 18;
        $('#listingsTableDiv').animate({
          scrollTop: dif
        }, 400);
      });

      this.eventAggregator.subscribe('RealtorAnalytics:Listings:Updated', function (response) {
        console.log("eventAggregator: realtoranalytics:listings:updated");
        _this.refreshData();
      });
      this.eventAggregator.subscribe('set-min-price', function (message) {
        _this.filters.MinPrice[0] = message;
        _this.refreshData();
      });
      this.eventAggregator.subscribe('set-max-price', function (message) {
        _this.filters.MaxPrice[0] = message;
        _this.refreshData();
      });
      this.eventAggregator.subscribe('set-min-bed', function (message) {
        _this.filters.MinBeds[0] = message;
        _this.refreshData();
      });
      this.eventAggregator.subscribe('set-max-bed', function (message) {
        _this.filters.MaxBeds[0] = message;
        _this.refreshData();
      });
      this.eventAggregator.subscribe('set_baths', function (message) {
        _this.filters.MinBaths[0] = message;
        _this.refreshData();
      });
      this.eventAggregator.subscribe('set-min-sqrt', function (message) {
        _this.filters.MinSqft[0] = message;
        _this.refreshData();
      });
      this.eventAggregator.subscribe('set-max-sqrt', function (message) {
        _this.filters.MaxSqft[0] = message;
        _this.refreshData();
      });
      this.eventAggregator.subscribe('set-min-lot', function (message) {
        _this.filters.MinLot[0] = message;
        _this.refreshData();
      });
      this.eventAggregator.subscribe('set-max-lot', function (message) {
        _this.filters.MaxLot[0] = message;
        _this.refreshData();
      });
      this.eventAggregator.subscribe('set-min-year', function (message) {
        _this.filters.MinYear[0] = message;
        _this.refreshData();
      });
      this.eventAggregator.subscribe('set-max-year', function (message) {
        _this.filters.MaxYear[0] = message;
        _this.refreshData();
      });
      this.eventAggregator.subscribe('set_days_on_market', function (message) {
        _this.filters.DOM[0] = message;
        _this.refreshData();
      });
      this.eventAggregator.subscribe('set_last_updated', function (message) {
        _this.filters.STATDAYS[0] = message;
        _this.refreshData();
      });
      this.eventAggregator.subscribe('set_garage', function (message) {
        _this.filters.MinGarage[0] = message;
        _this.refreshData();
      });
    };

    listings.prototype.loadMapLayers = function loadMapLayers(map) {
      var _this2 = this;

      this.zoningLayer = new google.maps.Data();
      this.uvLayer = new google.maps.Data();
      this.CurrentuvLayer = new google.maps.Data();
      this.zoningChangeLayer = new google.maps.Data();
      this.transitLayer = new google.maps.Data();

      window.onresize = function () {
        var center = map.map.getCenter();
        google.maps.event.trigger(map.map, 'resize');
        map.map.setCenter(center);
      };

      google.maps.event.addListener(map.map, 'idle', function () {
        var response = map.map.getBounds();
        _this2.filters.Boundries = [response.f.f, response.f.b, response.b.f, response.b.b];
        console.log('idle -----');
        _this2.refreshData();
      });

      this.zoningLayer.setMap(this.GoogleMap.map);

      this.uvLayer.setMap(this.GoogleMap.map);
      this.CurrentuvLayer.setMap(this.GoogleMap.map);
      this.transitLayer.setMap(this.GoogleMap.map);

      this.uvLayer.setStyle(function (feature) {
        var uvtype = feature.getProperty('UV_TYPE');
        var _color = void 0;
        var _fillOpacity = void 0;
        var _strokeColor = void 0;
        var _strokeWeight = void 0;
        var firstChar = void 0;
        if (uvtype.strlength == 0) firstChar = "";else firstChar = uvtype.substring(0, 1);
        if (firstChar == "F") {
          _color = '#111111';
          _fillOpacity = 0.00;
          _strokeColor = '#FF9900';
          _strokeWeight = '2';
        } else {
          _color = uvtype == "UC" || uvtype == "UCV" ? '#111111' : '#333333';
          _fillOpacity = 0;
          _strokeColor = '#222222';
          _strokeWeight = '2';
        }
        return {
          fillColor: _color,
          fillOpacity: _fillOpacity,
          strokeColor: _strokeColor,
          strokeOpacity: '1',
          strokeWeight: _strokeWeight,
          zIndex: 9,
          clickable: false
        };
      });

      this.transitLayer.setStyle(function (feature) {
        var shapeTime = feature.getProperty('RE_NAME');
        var _color = void 0;
        var _fillOpacity = 0.2;
        var _strokeColor = void 0;
        var _strokeWeight = void 0;
        var firstChar = void 0;

        if (shapeTime == 300) _color = '#018812';else if (shapeTime == 600) _color = '#01CC32';else if (shapeTime == 900) _color = '#FF9900';
        return {
          fillColor: _color,
          fillOpacity: _fillOpacity,
          strokeColor: _strokeColor,
          strokeOpacity: '0',
          strokeWeight: _strokeWeight,
          zIndex: 1,
          clickable: false
        };
      });

      this.CurrentuvLayer.setStyle(function (feature) {
        var uvtype = feature.getProperty('UV_TYPE');
        var _color = void 0;
        var _fillOpacity = void 0;
        var _strokeColor = void 0;
        var _strokeWeight = void 0;
        _color = uvtype == "UC" || uvtype == "UCV" ? '#111111' : '#333333';
        _fillOpacity = 0.00;
        _strokeColor = '#aaaaaa';
        _strokeWeight = '2';
        return {
          fillColor: _color,
          fillOpacity: _fillOpacity,
          strokeColor: _strokeColor,
          strokeOpacity: '1',
          strokeWeight: _strokeWeight,
          zIndex: 10,
          clickable: true
        };
      });


      this.zoningLayer.setStyle(function (feature) {

        var objectID = feature.getProperty('ZONEID');
        var Zone = feature.getProperty('MHA_ZONING').toUpperCase();
        var ZoneDesc = feature.getProperty('ZONELUT_DE');
        var isMHA = feature.getProperty('MHA');
        var isUpgrade = feature.getProperty('UPGRADE');

        var _color = void 0;
        var _fillOpacity = void 0;
        var _strokeColor = void 0;
        var _strokeWeight = void 0;
        var _strokeOpacity = void 0;

        _color = '#FFFFFF';
        _fillOpacity = 0.25;
        _strokeWeight = 0.5;
        _strokeOpacity = 0.1;

        if (Zone.indexOf("SF") >= 0) {
          _color = '#ffffff';
          _fillOpacity = 0.1;
        } else if (Zone.indexOf("RSL") >= 0) {
          _color = '#fffb9a';
        } else if (Zone.indexOf("LR1") >= 0) {
          _color = '#fff14a';
        } else if (Zone.indexOf("LR2") >= 0) {
          _color = '#fcc02c';
        } else if (Zone.indexOf("LR3") >= 0) {
          _color = '#f67f17';
        } else if (Zone.indexOf("MR") >= 0 || Zone.indexOf("HR") >= 0) {
          _color = '#f36f11';
        } else if (Zone.indexOf("NC1") >= 0 || Zone.indexOf("NC2") >= 0 || Zone.indexOf("NC3") >= 0) {
          if (Zone.indexOf("30") >= 0) _color = "#c261da";else if (Zone.indexOf("40") >= 0) _color = "#c261da";else if (Zone.indexOf("55") >= 0) _color = "#b450cd";else if (Zone.indexOf("65") >= 0) _color = "#a03aba";else if (Zone.indexOf("75") >= 0) _color = "#9530ae";else if (Zone.indexOf("85") >= 0) _color = "#8b27a4";else if (Zone.indexOf("95") >= 0) _color = "#822699";else if (Zone.indexOf("125") >= 0 || Zone.indexOf("160") >= 0) _color = "#641a76";else _color = "#a03aba";
        } else if (Zone.indexOf("SM") >= 0 || Zone.indexOf("SM") >= 0 || Zone.indexOf("SM") >= 0) {
          _color = '#7b41cc';
        } else if (Zone.indexOf("DMC") >= 0 || Zone.indexOf("DRC") >= 0 || Zone.indexOf("PMM") >= 0) {
          _color = '#42329c';
        } else if (Zone.indexOf("C1") >= 0 || Zone.indexOf("C2") >= 0 || Zone.indexOf("C3") >= 0) {
          _color = '#28b6f6';
        } else if (Zone.indexOf("IB") >= 0 || Zone.indexOf("IG") >= 0 || Zone.indexOf("IC") >= 0) {
          _color = '#aaaadd';
          _fillOpacity = 0.06;
        }

        _strokeColor = _color;

        if (isMHA == "1") {

          _fillOpacity = 0.6;
        }

        return {
          fillColor: _color,
          fillOpacity: _fillOpacity,
          strokeColor: _strokeColor,
          strokeOpacity: _strokeOpacity,
          strokeWeight: _strokeWeight,
          zIndex: 3
        };
      });
    };

    listings.prototype.hyperLink = function hyperLink(url) {
      window.open(url);
    };

    listings.prototype.selectViewType = function selectViewType(type) {
      this.tableType = type;
    };

    listings.prototype.clickCheckbox = function clickCheckbox(group, value, chkbox) {
      if (!$("#" + chkbox).prop("checked")) this.filters[group].push(value);else this.filters[group].splice(this.filters[group].indexOf(value), 1);

      this.refreshData();
    };

    listings.prototype.clickFeature = function clickFeature(group, checkbox) {
      this.filters[group][0] = !$('#' + checkbox).prop('checked') ? 1 : 0;
      this.refreshData();
    };

    listings.prototype.clickCovered = function clickCovered(group, checkbox) {
      this.filters[group][0] = !$('#' + checkbox).prop('checked') ? 1 : 0;
      this.refreshData();
      return true;
    };

    listings.prototype.clickRadio = function clickRadio(group, value, chkbox) {
      this.filters[group] = [value];
      this.refreshData();
    };

    listings.prototype.loadPOIs = function loadPOIs() {
      var _this3 = this;

      this.appState.listingsHub.invoke('GetPOIs').done(function (data) {
        console.log('Finished calling GetPOIs, result size was ', data.length);
        _this3.POIs = JSON.parse(data);
      }).fail(function (data) {
        console.log('Failed calling GetPOIs');
      });
    };

    listings.prototype.refreshData = function refreshData() {
      var _this4 = this;

      console.log('filters---------', this.filters);
      this.appState.listingsHub.invoke('GetListings', this.filters, 'HARDCODEDTOKENIGOTFROMAUTHPLUGIN').done(function (data) {
        console.log('Finished calling GetListings, result size was ', data.length);
        _this4.listings = JSON.parse(data);
        console.log('listings---------------', _this4.listings);
        var haveNeighbourhood = true;
        var haveSNeighbourhood = true;
        for (var i = 0; i < _this4.listings.length; i++) {

          if (_this4.listings[i]["PrimaryImage"].length > 0) {
            _this4.listings[i]["PrimaryImage"] = "http://www.realtoranalytics.com/ImgSrv/Listings/" + _this4.listings[i]["MLSNumber"].substring(_this4.listings[i]["MLSNumber"].length - 2) + "/" + _this4.listings[i]["MLSNumber"] + "/" + _this4.listings[i]["PrimaryImage"];
          } else {
            _this4.listings[i]["PrimaryImage"] = "http://www.realtoranalytics.com/ImgSrv/Listings/00.png";
          }
          if ((0, _numeral2.default)(_this4.listings[i]["FrequentTransitScanned"]) > 0) _this4.listings[i]["FrequentTransitCSS"] = "";else _this4.listings[i]["FrequentTransitCSS"] = "DISPLAYNONE";

          if (_this4.listings[i]["ST"] == "S") _this4.listings[i]["ListingPrice"] = _this4.listings[i]["SellingPrice"];

          if (_this4.listings[i]["UrbanVillageCurrent"] == "" || _this4.listings[i]["UrbanVillageCurrent"] == "N/A" || _this4.listings[i]["City"] != "Seattle") _this4.listings[i]["UrbanVillageCSS"] = "DISPLAYNONE";else _this4.listings[i]["UrbanVillageCSS"] = "";

          if ("N/A" == _this4.listings[i]["ZoningFuture"] || "" == _this4.listings[i]["ZoningFuture"]) _this4.listings[i]["ZoningFutureCSS"] = "DISPLAYNONE";else _this4.listings[i]["ZoningFutureCSS"] = "";

          if (_this4.listings[i]["UrbanVillageFuture"] == "N/A" || _this4.listings[i]["UrbanVillageFuture"] == "" || _this4.listings[i]["UrbanVillageCurrent"] == _this4.listings[i]["UrbanVillageFuture"]) _this4.listings[i]["UrbanVillageFutureCSS"] = "DISPLAYNONE";else _this4.listings[i]["UrbanVillageFutureCSS"] = "";
          if (_this4.listings[i]["Neighbourhood"] == "N/A" || _this4.listings[i]["Neighbourhood"] == "NO BROADER TERM" || _this4.listings[i]["Neighbourhood"] == "" || _this4.listings[i]["Neighbourhood"] == _this4.listings[i]["SNeighbourhood"]) haveNeighbourhood = false;else {
            var _haveNeighbourhood = true;
            _this4.listings[i]["Neighbourhood"] = _this4.titleCase(_this4.listings[i]["Neighbourhood"]);
          }
          if (_this4.listings[i]["SNeighbourhood"] == "N/A" || _this4.listings[i]["SNeighbourhood"] == "NO BROADER TERM" || _this4.listings[i]["Neighbourhood"] == "") haveSNeighbourhood = false;else {
            var _haveSNeighbourhood = true;
            _this4.listings[i]["SNeighbourhood"] = _this4.titleCase(_this4.listings[i]["SNeighbourhood"]);
          }
          if (_this4.listings[i]["PresentUseGroup"] != "MF" || _this4.listings[i]["CAP"] == "0.00" || _this4.listings[i]["CAP"] == "") _this4.listings[i]["CAPTEXT"] = "";else {
            _this4.listings[i]["CAPTEXT"] = "CAP " + _this4.listings[i]["CAP"] + "%";
          }

          if (haveNeighbourhood && haveSNeighbourhood) _this4.listings[i]["NeighbourhoodUnited"] = _this4.listings[i]["Neighbourhood"] + " / " + _this4.listings[i]["SNeighbourhood"];else if (haveNeighbourhood) _this4.listings[i]["NeighbourhoodUnited"] = _this4.listings[i]["Neighbourhood"];else if (haveSNeighbourhood) _this4.listings[i]["NeighbourhoodUnited"] = _this4.listings[i]["SNeighbourhood"];else _this4.listings[i]["NeighbourhoodUnited"] = "";

          if (_this4.listings[i]["NeighbourhoodUnited"].length > 32) _this4.listings[i]["NeighbourhoodUnited"] = _this4.listings[i]["NeighbourhoodUnited"].substring(0, 32) + "...";
        }
        _this4.mapMarkers = _this4.createMarkers(_this4.listings);
      }).fail(function (data) {
        console.log('Failed calling GetListings');
      });
    };

    listings.prototype.onClickMap = function onClickMap(event) {

      console.log("A onClickMap " + event);
    };

    listings.prototype.onClickMarker = function onClickMarker(event) {
      console.log("B onClickMarker " + event);
    };

    listings.prototype.titleCase = function titleCase(str) {
      str = str.replace("/", " ");
      str = str.replace("//", " ");
      str = str.replace("\/", " ");
      str = str.replace("  ", " ");
      str = str.replace("  ", " ");
      var words = str.toLowerCase().split(' ');
      for (var i = 0; i < words.length; i++) {
        var letters = words[i].split('');
        letters[0] = letters[0].toUpperCase();
        words[i] = letters.join('');
      }
      return words.join(' ');
    };

    listings.prototype.changePriceRange = function changePriceRange(event) {};

    listings.prototype.changeLotRange = function changeLotRange(event) {};

    listings.prototype.createMarkers = function createMarkers(listingsArray) {
      var markersArray = [];
      for (var i in listingsArray) {
        var markerTitle = "";
        if (isNaN(listingsArray[i]["ListingPrice"])) {
          markerTitle = listingsArray[i]["FullAddress"];
        } else {
          markerTitle = listingsArray[i]["FullAddress"] + ' ' + (0, _numeral2.default)(listingsArray[i]["ListingPrice"]).format('($0,0)');
        }

        var iconimg = 'img/Markers/' + listingsArray[i]["ListingStatus"] + '/';
        if (listingsArray[i]["PresentUseGroup"] != "") iconimg = iconimg + listingsArray[i]["PresentUseGroup"] + ".png";else iconimg = iconimg + "null.png";

        iconimg = 'img/Markers/Temp/Marker' + listingsArray[i]["ListingStatus"] + '.png';


        var _fontWeight = "normal";
        var _fontSize = "12px";
        var _fontcolor = "#555555";

        if (this.currentSelectedId == listingsArray[i]["ListingID"]) {
          _fontWeight = "bold";
          _fontSize = "12px";
          _fontcolor = "#000000";
        }

        var row = {
          custom: {
            id: listingsArray[i]["ListingID"]
          },
          icon: iconimg,
          title: markerTitle,
          label: {
            text: this.formatKMB(listingsArray[i]["ListingPrice"]),
            color: _fontcolor,
            fontSize: _fontSize,
            fontWeight: _fontWeight
          },
          longitude: listingsArray[i]["Longitude"],
          latitude: listingsArray[i]["Latitude"]
        };
        row.infoWindowx = {
          content: '\n                <div id="content">    \n\n                   <img src="' + listingsArray[i]["ListingImage"] + '" width="240">\n                     <br>\n                    <a href="../REPM/PropertySearch.aspx?Address=' + listingsArray[i]["FullAddress"] + '" target="_ps">' + listingsArray[i]["FullAddress"] + '</a>\n                      <a href="' + listingsArray[i]["URL"] + '" target="_rf"><h3 id="firstHeading" class="firstHeading">' + (0, _numeral2.default)(listingsArray[i]["ListingPrice"]).format("$(0,0)") + '</h3></a>\n\n\n                     <h5 id="secondHeading" class="firstHeading">' + listingsArray[i]["ListingBeds"] + '<small>Bed</small> | ' + listingsArray[i]["ListingBaths"] + '<small>Bath</small> | ' + listingsArray[i]["ListingSqft"] + '<small>sf</small> | ' + listingsArray[i]["SqFtLot"] + '<small>sf</small> ' + listingsArray[i]["CurrentZoning"] + '' + '</h1>\n \n                    <div id="textcontent" class="col-sm-12">\n                      \n\n                  </div>\n                </div>'
        };

        markersArray.push(row);
      }

      return markersArray;
    };

    listings.prototype.clickRow = function clickRow(event, id, address, _longitude, _latitude) {
      this.currentSelectedId = id;
      $(".listingsTableRow").removeClass("info");
      $("#listingsTableRow_" + id).addClass("info");
      this.currentAddress = address;

      this.mapMarkers = this.createMarkers(this.listings);
    };

    listings.prototype.changeSort = function changeSort(sortByColumn) {
      if (sortByColumn == this.sortColumn) {
        if (this.sortOrder == 'ascending') this.sortOrder = 'descending';else this.sortOrder = 'ascending';
      } else this.sortOrder = 'dscending';
      this.sortColumn = sortByColumn;
    };

    listings.prototype.POIchanged = function POIchanged() {
      var _this5 = this;

      this.filters['POI'] = [];
      var poiid = $('select[name=POIsSelect]').val();


      var maxTime = $('select[name=POIsMaxTime]').val();
      var _map = this.GoogleMap.map;

      for (var i = 0; i < poiid.length; i++) {
        this.filters['POI'].push(poiid[i]);
      }
      this.filters['POIMaxDriveTime'] = [maxTime];

      if (poiid == "" || poiid.length == 0 || poiid[0] == "") {
        this.refreshData();
        this.transitLayer.forEach(function (feature) {
          _this5.transitLayer.remove(feature);
        });
        this.zoningLayer.setMap(this.GoogleMap.map);
        this.uvLayer.setMap(this.GoogleMap.map);
        this.CurrentuvLayer.setMap(this.GoogleMap.map);
        this.transitLayer.setMap(null);
      } else {
        (function () {

          _this5.zoningLayer.setMap(null);
          _this5.uvLayer.setMap(null);
          _this5.CurrentuvLayer.setMap(null);
          _this5.transitLayer.setMap(_this5.GoogleMap.map);
          _this5.transitLayer.forEach(function (feature) {
            _this5.transitLayer.remove(feature);
          });
          var iCounter = 0;
          var iMax = poiid.length - 1;
          for (var _i = 0; _i <= iMax; _i++) {
            var url = "/FrontEnd/GIS/GetJSON.aspx?poiID=" + poiid[_i] + "&poiTransitType=car&poiMaxValue=" + maxTime;


            var promise = $.getJSON(url);
            promise.then(function (data) {

              _this5.transitLayer.addGeoJson(data);

              if (iCounter == iMax) {
                (function () {
                  var bounds = new google.maps.LatLngBounds();
                  _this5.transitLayer.forEach(function (feature) {
                    feature.getGeometry().forEachLatLng(function (latlng) {
                      bounds.extend(latlng);
                    });
                  });
                  console.log(bounds);
                  _this5.GoogleMap.map.fitBounds(bounds);
                })();
              }
              iCounter++;
            });
          }
        })();
      }
    };

    listings.prototype.lookupIndexById = function lookupIndexById(markerArray, Id) {
      for (var row = 0; row < markerArray.length; row++) {

        if (markerArray[row].custom.id == Id) {
          return row;
        }
      }
      return -1;
    };

    listings.prototype.formatKMB = function formatKMB(value) {
      var str = "";
      var num = Number(value);
      var numlength = ("" + num).length;

      if (num >= 1000000) {
        var n1 = Math.round(num / Math.pow(10, numlength - 3));
        var d1 = n1 / Math.pow(10, 9 - numlength);
        str = d1 + "M";
      } else if (num >= 1000) {
        var _n = Math.round(num / Math.pow(10, numlength - 3));
        var _d = _n / Math.pow(10, 6 - numlength);
        str = _d + "K";
      } else str = num;
      return "$" + str;
    };

    listings.prototype.setHouseType = function setHouseType() {
      console.log('event%%%%%%%%%%');
    };

    _createClass(listings, [{
      key: 'minPrice',
      get: function get() {
        return '' + this.filters.MinPrice[0];
      }
    }, {
      key: 'maxPrice',
      get: function get() {
        return '' + this.filters.MaxPrice[0];
      }
    }, {
      key: 'getLatitude',
      get: function get() {
        return '' + this.latitude;
      }
    }, {
      key: 'getLongitude',
      get: function get() {
        return '' + this.longitude;
      }
    }, {
      key: 'listingStatus',
      get: function get() {
        var status = {
          active: false,
          pending: false,
          sold: false
        };
        this.filters.ListingStatus.forEach(function (ele) {
          switch (ele) {
            case 'A':
              status.active = true;
              break;
            case 'P':
              status.pending = true;
              break;
            case 'S':
              status.sold = true;
              break;
          }
        });
        return status;
      }
    }]);

    return listings;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mapMarkers', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return [{
        infoWindow: {
          content: '\n            <div id="content">\n                <div id="siteNotice"></div>\n                <h1 id="firstHeading" class="firstHeading">Uluru</h1>\n                <div id="bodyContent">\n                <p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large sandstone rock formation in the southern part of the Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) south west of the nearest large town, Alice Springs; 450&#160;km (280&#160;mi) by road. Kata Tjuta and Uluru are the two major features of the Uluru - Kata Tjuta National Park. Uluru is sacred to the Pitjantjatjara and Yankunytjatjara, the Aboriginal people of the area. It has many springs, waterholes, rock caves and ancient paintings. Uluru is listed as a World Heritage Site.</p>\n                <p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">https://en.wikipedia.org/w/index.php?title=Uluru</a> last visited June 22, 2009).</p>\n                </div>\n            </div>\n        '
        }
      }];
    }
  })), _class2)) || _class);
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources').plugin('aurelia-google-maps', function (config) {
      config.options({
        apiKey: 'AIzaSyBUTbBmV57ZxYULwWqbBz-S2vGFfrHknKk',
        apiLibraries: 'drawing,geometry',
        options: { panControl: true, panControlOptions: { position: 9 } },
        language: '' | 'en',
        region: '' | 'US'
      });
    }).plugin('resources/value-converters/converters');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('components/bed-filter/bed-filter',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BedFilter = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var BedFilter = exports.BedFilter = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function BedFilter(eventAggregator) {
      _classCallCheck(this, BedFilter);

      this.ea = eventAggregator;
      this.bedList = [1, 2, 3, 4, 5, 6];
      this.minBeds = 0;
      this.maxBeds = 6;
      this.selectedMinBeds = 0;
      this.selectedMaxBeds = 6;
      this.minBedList = this.bedList;
      this.maxBedList = this.bedList;
    }

    BedFilter.prototype.changeMinBed = function changeMinBed(event) {
      var minIndex = this.bedList.indexOf(parseInt(event));
      this.maxBedList = this.bedList.slice(minIndex);
      this.ea.publish('set-min-bed', event);
    };

    BedFilter.prototype.changeMaxBed = function changeMaxBed(event) {
      var maxIndex = this.bedList.indexOf(parseInt(event));
      this.minBedList = this.bedList.slice(0, maxIndex);
      this.ea.publish('set-max-bed', event);
    };

    return BedFilter;
  }()) || _class);
});
define('components/days-on-market/days-on-market',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DaysOnMarket = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var DaysOnMarket = exports.DaysOnMarket = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function DaysOnMarket(eventAggregator) {
      _classCallCheck(this, DaysOnMarket);

      this.ea = eventAggregator;
      this.default = 31;
      this.lists = [{
        name: 'One Day',
        days: 1
      }, {
        name: '3 Days',
        days: 3
      }, {
        name: 'Week',
        days: 7
      }, {
        name: 'Month',
        days: 31
      }, {
        name: 'Up to 3 Months',
        days: 90
      }, {
        name: 'Up to 6 Months',
        days: 180
      }, {
        name: 'No Limit',
        days: 0
      }, {
        name: 'More than 180 days',
        days: -30
      }];
    }

    DaysOnMarket.prototype.changeDays = function changeDays(data) {
      this.ea.publish('set_days_on_market', data);
    };

    return DaysOnMarket;
  }()) || _class);
});
define('components/garage-filter/garage-filter',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.GarageFilter = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var GarageFilter = exports.GarageFilter = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function GarageFilter(eventAggregator) {
      _classCallCheck(this, GarageFilter);

      this.ea = eventAggregator;
      this.index = 0;
    }

    GarageFilter.prototype.changeValue = function changeValue(mode) {
      if (mode) {
        this.index++;
      } else {
        if (this.index > 0) {
          this.index--;
        }
      }
      this.ea.publish('set_garage', this.index);
    };

    return GarageFilter;
  }()) || _class);
});
define('components/last-updated-filter/last-updated',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.LastUpdated = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var LastUpdated = exports.LastUpdated = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function LastUpdated(eventAggregator) {
      _classCallCheck(this, LastUpdated);

      this.ea = eventAggregator;
      this.default = 31;
      this.lists = [{
        name: 'Today',
        days: 1
      }, {
        name: 'Last 3 Days',
        days: 3
      }, {
        name: 'Last Week',
        days: 7
      }, {
        name: 'Last Month',
        days: 31
      }, {
        name: 'Last 3 Months',
        days: 90
      }, {
        name: 'Last 6 Months',
        days: 180
      }, {
        name: 'No Limit',
        days: 0
      }, {
        name: 'Older than 180 days',
        days: -180
      }];
    }

    LastUpdated.prototype.changeDays = function changeDays(data) {
      this.ea.publish('set_last_updated', data);
    };

    return LastUpdated;
  }()) || _class);
});
define('components/lot-filter/lot-filter',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.LotFilter = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var LotFilter = exports.LotFilter = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function LotFilter(eventAggregator) {
      _classCallCheck(this, LotFilter);

      this.ea = eventAggregator;
      this.lotList = [2000, 4500, 6500, 8000, 10890, 21780, 32670, 43560, 87120, 130680, 174240, 217800, 435600, 1742400, 4356000];
      this.minLot = 0;
      this.maxLot = 5000000;
      this.selectedMinLot = 0;
      this.selectedMaxLot = 5000000;
      this.minLotList = this.lotList;
      this.maxLotList = this.lotList;
    }

    LotFilter.prototype.changeMinLot = function changeMinLot(event) {
      var minIndex = this.lotList.indexOf(parseInt(event));
      this.maxLotList = this.lotList.slice(minIndex + 1);
      this.ea.publish('set-min-lot', event);
    };

    LotFilter.prototype.changeMaxLot = function changeMaxLot(event) {
      var maxIndex = this.lotList.indexOf(parseInt(event));
      this.minLotList = this.lotList.slice(0, maxIndex);
      this.ea.publish('set-max-lot', event);
    };

    return LotFilter;
  }()) || _class);
});
define('components/price-filter/price-filter',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.PriceFilter = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var PriceFilter = exports.PriceFilter = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function PriceFilter(eventAggregator) {
      _classCallCheck(this, PriceFilter);

      this.ea = eventAggregator;
      this.priceList = [25000, 50000, 75000, 100000, 125000, 150000, 175000, 200000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000];
      this.minPrice = 25000;
      this.maxPrice = 4000000;
      this.selectedMinPrice = 0;
      this.selectedMaxPrice = 4000000;
      this.minPriceList = this.priceList;
      this.maxPriceList = this.priceList;
    }

    PriceFilter.prototype.changeMinPrice = function changeMinPrice(event) {
      var minIndex = this.priceList.indexOf(parseInt(event));
      this.maxPriceList = this.priceList.slice(minIndex + 1);
      this.ea.publish('set-min-price', event);
    };

    PriceFilter.prototype.changeMaxPrice = function changeMaxPrice(event) {
      var maxIndex = this.priceList.indexOf(parseInt(event));
      this.minPriceList = this.priceList.slice(0, maxIndex);
      this.ea.publish('set-max-price', event);
    };

    return PriceFilter;
  }()) || _class);
});
define('components/spinner-input/spinner-input',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SpinnerInput = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var SpinnerInput = exports.SpinnerInput = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function SpinnerInput(eventAggregator) {
      _classCallCheck(this, SpinnerInput);

      this.ea = eventAggregator;
      this.value = [0, 1, 1.25, 2, 3, 4, 5, 6];
      this.index = 0;
    }

    SpinnerInput.prototype.changeValue = function changeValue(mode) {
      if (mode) {
        if (this.index < this.value.length - 1) {
          this.index++;
        }
      } else {
        if (this.index > 0) {
          this.index--;
        }
      }
      this.ea.publish('set_baths', parseFloat(this.value[this.index]));
    };

    return SpinnerInput;
  }()) || _class);
});
define('components/sqrt-filter/sqrt-filter',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SqrtFilter = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var SqrtFilter = exports.SqrtFilter = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function SqrtFilter(eventAggregator) {
      _classCallCheck(this, SqrtFilter);

      this.ea = eventAggregator;
      this.sqrtList = [500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3500, 4000, 4500, 5000, 6000];
      this.minSqrt = 0;
      this.maxSqrt = 6000;
      this.selectedMinSqrt = 0;
      this.selectedMaxSqrt = 6000;
      this.minSqrtList = this.sqrtList;
      this.maxSqrtList = this.sqrtList;
    }

    SqrtFilter.prototype.changeMinSqrt = function changeMinSqrt(event) {
      var minIndex = this.sqrtList.indexOf(parseInt(event));
      this.maxSqrtList = this.sqrtList.slice(minIndex + 1);
      this.ea.publish('set-min-sqrt', event);
    };

    SqrtFilter.prototype.changeMaxSqrt = function changeMaxSqrt(event) {
      var maxIndex = this.sqrtList.indexOf(parseInt(event));
      this.minSqrtList = this.sqrtList.slice(0, maxIndex);
      this.ea.publish('set-max-sqrt', event);
    };

    return SqrtFilter;
  }()) || _class);
});
define('components/year-built-filter/year-built-filter',['exports', 'aurelia-framework', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.YearFilter = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var YearFilter = exports.YearFilter = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function YearFilter(eventAggregator) {
      _classCallCheck(this, YearFilter);

      this.ea = eventAggregator;
      this.yearList = this.getYearList();
      this.minYear = 1900;
      this.maxYear = new Date().getFullYear();
      this.selectedMinYear = 1900;
      this.selectedMaxYear = new Date().getFullYear();
      this.minYearList = this.yearList;
      this.maxYearList = this.yearList;
    }

    YearFilter.prototype.getYearList = function getYearList() {
      var date = new Date();
      var list = [];
      for (var i = date.getFullYear(); i > 1900; i--) {
        list.push(i);
      }
      return list;
    };

    YearFilter.prototype.changeMinYear = function changeMinYear(event) {
      var minIndex = this.yearList.indexOf(parseInt(event));
      this.maxYearList = this.yearList.slice(0, minIndex);
      this.ea.publish('set-min-year', event);
    };

    YearFilter.prototype.changeMaxYear = function changeMaxYear(event) {
      var maxIndex = this.yearList.indexOf(parseInt(event));
      this.minYearList = this.yearList.slice(maxIndex + 1);
      this.ea.publish('set-max-year', event);
    };

    return YearFilter;
  }()) || _class);
});
define('resources/value-converters/converters',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(aurelia) {
    aurelia.globalResources('resources/value-converters/ralistings', 'resources/value-converters/date-format', 'resources/value-converters/number-format', 'resources/value-converters/remove-Spaces', 'resources/value-converters/time-format', 'resources/value-converters/sort');
  }
});
define('resources/value-converters/date-format',['exports', 'moment', 'numeral'], function (exports, _moment, _numeral) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.DateFormatValueConverter = undefined;

    var _moment2 = _interopRequireDefault(_moment);

    var _numeral2 = _interopRequireDefault(_numeral);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var DateFormatValueConverter = exports.DateFormatValueConverter = function () {
        function DateFormatValueConverter() {
            _classCallCheck(this, DateFormatValueConverter);
        }

        DateFormatValueConverter.prototype.toView = function toView(value, format) {
            if (format === 'daysToHoursDays') {
                if (value <= 2) {
                    return (0, _numeral2.default)(value * 24).format('0,0') + 'h';
                } else if (value < 3.5) {
                    return (0, _numeral2.default)(value).format('0,0.0') + 'd';
                } else {
                    return (0, _numeral2.default)(value).format('0,0') + 'd';
                }
            }

            if (format === 'daysToHoursDaysLong') {
                if ((0, _numeral2.default)(value * 24).format('0,0') == '1') return "1 Hour";else if (value <= 2) {
                    return (0, _numeral2.default)(value * 24).format('0,0') + ' Hours';
                } else if (value < 3.5) {
                    return (0, _numeral2.default)(value).format('0,0.0') + ' Days';
                } else {
                    return (0, _numeral2.default)(value).format('0,0') + 'Days';
                }
            }

            return (0, _moment2.default)(value).format(format);
        };

        return DateFormatValueConverter;
    }();
});
define('resources/value-converters/number-format',['exports', 'numeral'], function (exports, _numeral) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NumberFormatValueConverter = undefined;

  var _numeral2 = _interopRequireDefault(_numeral);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var NumberFormatValueConverter = exports.NumberFormatValueConverter = function () {
    function NumberFormatValueConverter() {
      _classCallCheck(this, NumberFormatValueConverter);
    }

    NumberFormatValueConverter.prototype.toView = function toView(value, format) {
      if (isNaN(value)) {
        return value;
      }
      if (format === 'removezeros') {
        return Number(value);
      }
      if (format === 'kmbt') {
        var str = '';
        var num = Number(value);
        var numlength = ('' + num).length;

        if (num >= 1000000) {
          var n1 = Math.round(num / Math.pow(10, numlength - 3));
          var d1 = n1 / Math.pow(10, 9 - numlength);
          str = d1 + 'M';
        } else if (num >= 1000) {
          var _n = Math.round(num / Math.pow(10, numlength - 3));
          var _d = _n / Math.pow(10, 6 - numlength);
          str = _d + 'K';
        } else {
          str = num;
        }
        return '$' + str;
      } else {
        return (0, _numeral2.default)(value).format(format);
      }
    };

    return NumberFormatValueConverter;
  }();
});
define('resources/value-converters/ralistings',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var ralistingsValueConverter = exports.ralistingsValueConverter = function () {
        function ralistingsValueConverter() {
            _classCallCheck(this, ralistingsValueConverter);
        }

        ralistingsValueConverter.prototype.toView = function toView(value, format) {

            if (value == null || value == "") {
                return "UV TBD";
            }

            if (value == "Error") {
                return "UV N/A";
            }

            if (value == "No") {
                return "No";
            }

            var indexOfP = value.indexOf("(");
            var UVName = value.substring(0, indexOfP);
            var UVType = value.substring(indexOfP);

            if (format == 'UVREMOVEDESC') {
                if (UVType.indexOf("Center") > 0) return "UC";
                return "UV";
            }
            if (format == 'UVONLYDESC') {

                return value;
            }
            return value;
        };

        return ralistingsValueConverter;
    }();
});
define('resources/value-converters/remove-Spaces',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var removeSpacesValueConverter = exports.removeSpacesValueConverter = function () {
        function removeSpacesValueConverter() {
            _classCallCheck(this, removeSpacesValueConverter);
        }

        removeSpacesValueConverter.prototype.toView = function toView(value) {
            if (value == null) return "";
            return value.replace(" ", "").replace("-", "");
        };

        return removeSpacesValueConverter;
    }();
});
define('resources/value-converters/slider-two-values',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var SliderTwoValuesValueConverter = exports.SliderTwoValuesValueConverter = function () {
        function SliderTwoValuesValueConverter() {
            _classCallCheck(this, SliderTwoValuesValueConverter);
        }

        SliderTwoValuesValueConverter.prototype.toView = function toView(value) {
            return '[' + value.MinPrice[0] + ',' + value.MaxPrice[0] + ']';
        };

        SliderTwoValuesValueConverter.prototype.fromView = function fromView(values) {
            return {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            };
        };

        return SliderTwoValuesValueConverter;
    }();
});
define('resources/value-converters/sort',['exports', 'resources/value-converters/util'], function (exports, _util) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.SortValueConverter = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var SortValueConverter = exports.SortValueConverter = function () {
        function SortValueConverter() {
            _classCallCheck(this, SortValueConverter);
        }

        SortValueConverter.prototype.toView = function toView(array, propertyName, direction) {
            var factor = direction === 'ascending' ? 1 : -1;
            return array.slice(0).sort(function (a, b) {
                if (isNaN(a[propertyName]) || isNaN(b[propertyName])) {

                    return (0, _util.stringComparisonOrdinalIgnoreCase)(a[propertyName], b[propertyName]) * factor;
                } else {
                    return (a[propertyName] - b[propertyName]) * factor;
                }
            });
        };

        return SortValueConverter;
    }();
});
define('resources/value-converters/time-format',['exports', 'moment'], function (exports, _moment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.TimeFormatValueConverter = undefined;

    var _moment2 = _interopRequireDefault(_moment);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var TimeFormatValueConverter = exports.TimeFormatValueConverter = function () {
        function TimeFormatValueConverter() {
            _classCallCheck(this, TimeFormatValueConverter);
        }

        TimeFormatValueConverter.prototype.toView = function toView(value) {
            return (0, _moment2.default)(value).format('h:mm:ss a');
        };

        return TimeFormatValueConverter;
    }();
});
define('resources/value-converters/util',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.stringComparisonOrdinalIgnoreCase = stringComparisonOrdinalIgnoreCase;
    exports.dateComparison = dateComparison;
    function stringComparisonOrdinalIgnoreCase(a, b) {
        if (a === null) a = '';
        if (b === null) b = '';

        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }

    function dateComparison(a, b) {
        if (a === null) a = new Date(1900, 0, 1);
        if (b === null) b = new Date(1900, 0, 1);
        return moment(b).diff(moment(a));
    }
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"bootstrap/css/bootstrap.css\"></require><require from=\"assets/style/customized-bootstrap.css\"></require><require from=\"assets/style/realdash.css\"></require><nav id=\"navtop\" class=\"navbar navbar-static-top\" style=\"z-index:200\"><div class=\"container-fluid\"><div class=\"navbar-header\"><button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\" aria-expanded=\"false\"><span class=\"sr-only\">Toggle navigation</span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span> <span class=\"icon-bar\"></span></button> <a class=\"navbar-brand\" href=\"#\"><span class=\"brand-dash\">dash</span><span class=\"brand-real\">Real</span></a></div><div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\"><ul class=\"nav navbar-nav navbar-right\"><li><a href=\"#\"><i class=\"fa fa-star navbar-icon\" aria-hidden=\"true\"></i> Favorites</a></li><li><a href=\"#\"><i class=\"fa fa-map-marker navbar-icon\" aria-hidden=\"true\"></i> Saved Searches</a></li><li><a href=\"#\"><i class=\"fa fa-user navbar-icon\" aria-hidden=\"true\"></i> My Account</a></li></ul></div></div></nav><div class=\"page-host content-wrapper\"><router-view></router-view></div></template>"; });
define('text!assets/style/customized-bootstrap.css', ['module'], function(module) { module.exports = "@font-face {\r\n    font-family: MyriadPro;\r\n    src: url(\"src/assets/fonts/Myriad-Pro-Semibold.ttf\");\r\n}\r\n@font-face {\r\n    font-family: helvetica;\r\n    src: url(\"src/assets/fonts/helvetica-neue-bold.ttf\");\r\n}\r\nbody {\r\n    font-family: MyriadPro;\r\n}\r\nbody>.navbar {\r\n    margin-bottom:0;\r\n    background-color: #206e92;\r\n    border-width: 0;\r\n}\r\n.navbar-nav li a{\r\n    color: white;\r\n}\r\n.navbar-brand {\r\n    background-color: #f6ac15;\r\n    min-width: 225px;\r\n    text-align: center;\r\n    font-size: 2em;\r\n    font-family: helvetica;\r\n    letter-spacing: 1px;\r\n}\r\n.navbar .navbar-collapse {\r\n    padding-right: 30px;\r\n}\r\n.nav > li > a:hover, .nav > li > a:focus {\r\n    text-decoration: none;\r\n    color: #ffffff;\r\n    background-color: #13b2cf;\r\n}\r\n.search-filter-bar div.row > div {\r\n    padding: 0;\r\n}\r\n.btn-group > .btn.button_season {\r\n    border-radius: 0;\r\n}"; });
define('text!listings.html', ['module'], function(module) { module.exports = "<template><require from=\"components/price-filter/price-filter\"></require><require from=\"components/bed-filter/bed-filter\"></require><require from=\"components/sqrt-filter/sqrt-filter\"></require><require from=\"components/lot-filter/lot-filter\"></require><require from=\"components/year-built-filter/year-built-filter\"></require><require from=\"components/spinner-input/spinner-input\"></require><require from=\"components/days-on-market/days-on-market\"></require><require from=\"components/last-updated-filter/last-updated\"></require><require from=\"components/garage-filter/garage-filter\"></require><div class=\"search-filter-bar\"><div class=\"row\"><div class=\"col-sm-3\"><input type=\"text\" id=\"search-place\" placeholder=\"&#xf002; Search By City, Neighborhood, School, Address or Zip\" class=\"place-search-filter\"></div><div class=\"col-sm-6 filter-bar\"><div class=\"dropdown\"><div class=\"dropdown-toggle dash-filter-menu\" data-toggle=\"dropdown\" role=\"button\" aria-hidden=\"true\" aria-expanded=\"false\">Price <span class=\"caret\"></span></div><price-filter></price-filter></div><div class=\"dropdown\"><div class=\"dropdown-toggle dash-filter-menu\" data-toggle=\"dropdown\" role=\"button\" aria-hidden=\"true\" aria-expanded=\"false\">Property <span class=\"caret\"></span></div><div class=\"dropdown-menu property-menu\"><div class=\"section\"><div class=\"section-item\"><div class=\"filter-name\">Beds</div><bed-filter class=\"select-filter\"></bed-filter></div><div class=\"section-item\"><div class=\"filter-name\">Baths</div><spinner-input class=\"select-filter\"></spinner-input></div></div><div class=\"section\"><div class=\"section-item\"><div class=\"filter-name\">Square Feet</div><sqrt-filter class=\"select-filter\" selectedminsqrt.bind=\"filters.MinSqft[0]\" selectedmaxsqrt.bind=\"filters.MaxSqft[0]\"></sqrt-filter></div><div class=\"section-item\"><div class=\"filter-name\">Lot Size</div><lot-filter class=\"select-filter\"></lot-filter></div></div><div class=\"section\"><div class=\"section-item\"><div class=\"filter-name\">House Type</div><div class=\"btn-group col-xs-12 select-filter\" data-toggle=\"buttons\"><label class=\"btn btn-default button_season\" click.trigger=\"clickCheckbox('Style','SFR','type_house')\"><img class=\"filter-image\" src=\"src/assets/image/icons/houses.png\"><input type=\"checkbox\" name=\"type_house\" id=\"type_house\" value=\"SFR\">Houses</label><label class=\"btn btn-default button_season\" click.trigger=\"clickCheckbox('Style','CONDO','type_condo')\"><img class=\"filter-image\" src=\"src/assets/image/icons/condo.png\"><input type=\"checkbox\" name=\"type_condo\" id=\"type_condo\" value=\"CONDO\">Condo</label><label class=\"btn btn-default button_season\" click.trigger=\"clickCheckbox('Style','TH','type_townhouse')\"><img class=\"filter-image\" src=\"src/assets/image/icons/townhouses.png\"><input type=\"checkbox\" name=\"type_townhouse\" id=\"type_townhouse\" value=\"TH\">Townhouses</label><label class=\"btn btn-default button_season\" click.trigger=\"clickCheckbox('Style','V','type_lots_land')\"><img class=\"filter-image\" src=\"src/assets/image/icons/lotsland.png\"><input type=\"checkbox\" name=\"type_lots_land\" id=\"type_lots_land\" value=\"V\">Lots/Land</label><label class=\"btn btn-default button_season\" click.trigger=\"clickCheckbox('Style','MF','type_multifamily')\"><img class=\"filter-image\" src=\"src/assets/image/icons/multifamily.png\"><input type=\"checkbox\" name=\"type_multifamily\" id=\"type_multifamily\" value=\"MF\">Multifamily</label></div></div></div><div class=\"section\"><div class=\"section-item\"><div class=\"filter-name\">Feature</div><div class=\"btn-group col-xs-12 select-filter\" data-toggle=\"buttons\"><label class=\"btn btn-default button_season\" click.trigger=\"clickFeature('OneStory','one_story')\"><img class=\"filter-image\" src=\"src/assets/image/icons/storyonly.png\"><input type=\"checkbox\" name=\"one_story\" id=\"one_story\">1 Story Only</label><label class=\"btn btn-default button_season\" click.trigger=\"clickFeature('MustBsmnt','basement')\"><img class=\"filter-image\" src=\"src/assets/image/icons/basement.png\"><input type=\"checkbox\" name=\"basement\" id=\"basement\">Basement</label><label class=\"btn btn-default button_season\" click.trigger=\"clickFeature('SplitOK','split_entry')\"><img class=\"filter-image\" src=\"src/assets/image/icons/multifamily.png\"><input type=\"checkbox\" name=\"split_entry\" id=\"split_entry\">Split Entry</label><label class=\"btn btn-default button_season\" click.trigger=\"clickFeature('ManufOK','manufactured_home')\"><img class=\"filter-image\" src=\"src/assets/image/icons/manuhome.png\"><input type=\"checkbox\" name=\"manufactured_home\" id=\"manufactured_home\">Manufactured Home</label></div></div></div><div class=\"section\"><div class=\"section-item\"><div class=\"filter-name\">Year Built</div><year-filter class=\"select-filter\"></year-filter></div></div></div></div><div class=\"dropdown\"><div class=\"dash-filter-menu\">Close to <span class=\"caret\"></span></div><div class=\"dropdown-menu\"></div></div><div class=\"dropdown\"><div class=\"dash-filter-menu\">Schools <span class=\"caret\"></span></div><div class=\"dropdown-menu\"></div></div><div class=\"dropdown\"><div class=\"dash-filter-menu\">Location <span class=\"caret\"></span></div><div class=\"dropdown-menu\"></div></div><div class=\"dropdown\"><div class=\"drop-down-toggle dash-filter-menu\" data-toggle=\"dropdown\" role=\"button\" aria-hidden=\"true\" aria-expanded=\"false\">More <span class=\"caret\"></span></div><div class=\"dropdown-menu more-menu\"><div class=\"section\"><div class=\"section-item\"><div class=\"filter-name\">Listing Status</div><div class=\"form-group select-filter\"><div><input type=\"checkbox\" name=\"fancy-checkbox-active\" id=\"fancy_checkbox_active\" checked.bind=\"listingStatus.active\" autocomplete=\"off\"><div class=\"btn-group\" click.delegate=\"clickCheckbox('ListingStatus', 'A', 'fancy_checkbox_active')\"><label for=\"fancy_checkbox_active\" class=\"btn btn-success\"><span class=\"fa fa-check\"></span> <span></span></label><label for=\"fancy_checkbox_active\" class=\"btn btn-default active\">Active</label></div></div><div><input type=\"checkbox\" name=\"fancy-checkbox-pending\" id=\"fancy-checkbox-pending\" checked.bind=\"listingStatus.pending\" autocomplete=\"off\"><div class=\"btn-group\" click.delegate=\"clickCheckbox('ListingStatus', 'P', 'fancy-checkbox-pending')\"><label for=\"fancy-checkbox-pending\" class=\"btn btn-warning\"><span class=\"fa fa-check\"></span> <span></span></label><label for=\"fancy-checkbox-pending\" class=\"btn btn-default active\">Pending</label></div></div><div><input type=\"checkbox\" name=\"fancy-checkbox-danger\" id=\"fancy-checkbox-sold\" checked.bind=\"listingStatus.sold\" autocomplete=\"off\"><div class=\"btn-group\" click.delegate=\"clickCheckbox('ListingStatus', 'S', 'fancy-checkbox-sold')\"><label for=\"fancy-checkbox-sold\" class=\"btn btn-danger\"><span class=\"fa fa-check\"></span> <span></span></label><label for=\"fancy-checkbox-sold\" class=\"btn btn-default active\">Sold</label></div></div></div></div></div><div class=\"section days-filter\"><div class=\"section-item\"><div class=\"filter-name\">Days On Market</div><div class=\"select-filter\"><days-on-market></days-on-market></div></div><div class=\"section-item\"><div class=\"filter-Name\">Time Since Change</div><div class=\"select-filter\"><last-updated></last-updated></div></div></div><div class=\"section\"><div class=\"section-item\"><div class=\"filter-name\">Garage</div><garage-filter class=\"select-filter\"></garage-filter></div><div class=\"section-item\"><div class=\"filter-name\">Covered Only</div><div class=\"form-group select-filter\"><input type=\"checkbox\" style=\"display:none\" name=\"fancy-checkbox-coverd\" id=\"fancy-checkbox-coverd\" autocomplete=\"off\"><div class=\"btn-group\"><label for=\"fancy-checkbox-coverd\" class=\"btn btn-default\" click.trigger=\"clickCovered('GarageCvr', 'fancy-checkbox-coverd')\"><span class=\"fa fa-check\"></span> <span></span></label></div></div></div></div><div class=\"section\"><div class=\"section-item\"><div class=\"filter-name\">Additional Amenities</div><div class=\"select-filter\"><div class=\"filter-option-wrapper\"><div class=\"icon-image\"></div><div class=\"icon-name\">Waterfront</div><div class=\"form-group\" style=\"margin-top:1rem\"><input type=\"checkbox\" style=\"display:none\" name=\"fancy-checkbox-sail\" id=\"fancy-checkbox-sail\" autocomplete=\"off\"><div class=\"btn-group\"><label for=\"fancy-checkbox-sail\" class=\"btn btn-default\" click.trigger=\"clickCovered('Waterfront', 'fancy-checkbox-sail')\"><span class=\"fa fa-check\"></span> <span></span></label></div></div></div><div class=\"filter-option-wrapper\"><div class=\"icon-image\"></div><div class=\"icon-name\">View</div><div class=\"form-group\" style=\"margin-top:1rem\"><input type=\"checkbox\" style=\"display:none\" name=\"fancy-checkbox-view\" id=\"fancy-checkbox-view\" autocomplete=\"off\"><div class=\"btn-group\"><label for=\"fancy-checkbox-view\" class=\"btn btn-default\" click.trigger=\"clickCovered('Views', 'fancy-checkbox-view')\"><span class=\"fa fa-check\"></span> <span></span></label></div></div></div><div class=\"filter-option-wrapper\"><div class=\"icon-image\"></div><div class=\"icon-name\">A/C</div><div class=\"form-group\" style=\"margin-top:1rem\"><input type=\"checkbox\" style=\"display:none\" name=\"fancy-checkbox-ac\" id=\"fancy-checkbox-ac\" autocomplete=\"off\"><div class=\"btn-group\"><label for=\"fancy-checkbox-ac\" class=\"btn btn-default\" click.trigger=\"clickCovered('hasAC', 'fancy-checkbox-ac')\"><span class=\"fa fa-check\"></span> <span></span></label></div></div></div><div class=\"filter-option-wrapper\"><div class=\"icon-image\"></div><div class=\"icon-name\">2nd Kitchen</div><div class=\"form-group\" style=\"margin-top:1rem\"><input type=\"checkbox\" style=\"display:none\" name=\"fancy-checkbox-kithen\" id=\"fancy-checkbox-kithen\" autocomplete=\"off\"><div class=\"btn-group\"><label for=\"fancy-checkbox-kithen\" class=\"btn btn-default\" click.trigger=\"clickCovered('Kitchen2nd', 'fancy-checkbox-kithen')\"><span class=\"fa fa-check\"></span> <span></span></label></div></div></div><div class=\"filter-option-wrapper\"><div class=\"icon-image\"></div><div class=\"icon-name\">Fence</div><div class=\"form-group\" style=\"margin-top:1rem\"><input type=\"checkbox\" style=\"display:none\" name=\"fancy-checkbox-fence\" id=\"fancy-checkbox-fence\" autocomplete=\"off\"><div class=\"btn-group\"><label for=\"fancy-checkbox-fence\" class=\"btn btn-default\" click.trigger=\"clickCovered('Fence', 'fancy-checkbox-fence')\"><span class=\"fa fa-check\"></span> <span></span></label></div></div></div><div class=\"filter-option-wrapper\"><div class=\"icon-image\"></div><div class=\"icon-name\">Master Bath</div><div class=\"form-group\" style=\"margin-top:1rem\"><input type=\"checkbox\" style=\"display:none\" name=\"fancy-checkbox-master-bath\" id=\"fancy-checkbox-master-bath\" autocomplete=\"off\"><div class=\"btn-group\"><label for=\"fancy-checkbox-master-bath\" class=\"btn btn-default\" click.trigger=\"clickCovered('MasterBth', 'fancy-checkbox-master-bath')\"><span class=\"fa fa-check\"></span> <span></span></label></div></div></div></div></div></div></div></div></div><div class=\"col-sm-3 save-bar\"><div class=\"save-search-menu pull-right\"><i class=\"fa fa-map-marker\" aria-hidden=\"true\"></i> Save Search</div></div></div></div><div id=\"bodyDiv\"><div class=\"landing-page\"><div class=\"map-view\"><google-map map-loaded.call=\"loadMapLayers(GoogleMap, $event)\" view-model.ref=\"GoogleMap\" markers.bind=\"mapMarkers\" zoom=\"${zoomRate}\" latitude=\"${getLatitude}\" longitude=\"${getLongitude}\" address=\"Seattle, WA\"></google-map></div><div class=\"listingView\" style=\"box-shadow:-5px 3px 10px 0 rgba(0,0,0,.35)\"><div id=\"listingsTableDiv\" class=\"table-responsive\"><h1>Seattle, WA</h1><h5><span style=\"font-weight:Boiler\">${listings.length} Home</span> Listings in Your Area</h5><div class=\"table-type\"><div><span>${minPrice | numberFormat: 'kmbt'} - ${maxPrice | numberFormat: 'kmbt'}</span></div><select name=\"sort\" id=\"sort-item\" value.bind=\"sortColumn\" change.delegate=\"changeSort(sortColumn)\"><option value=\"\">Sort By</option><option value=\"ListingPrice\">Price</option><option value=\"LotSqft\">Lot</option><option value=\"ListingBeds\">Beds</option><option value=\"ListingSqft\">Sqft</option></select><div data-toggle=\"buttons\" class=\"btn-group\"><label class=\"btn btn-default\" click.trigger=\"selectViewType('list')\"><input id=\"checkDOM1\" type=\"radio\" value=\"list\"><i class=\"fa fa-th-list\"></i></label><label class=\"btn btn-default\" click.trigger=\"selectViewType('compact')\"><input id=\"checkDOM3\" type=\"radio\" value=\"compact\"><i class=\"fa fa-th\"></i></label></div></div><table show.bind=\"tableType == 'list'\" id=\"listingsTableID\" class=\"listingsTable table table-hover\"><thead id=\"listingsTableHead\"><tr><th><span class=\"thsortable\" click.trigger=\"changeSort('StatusHours')\">Stat</span> | <span class=\"thsortable\" click.trigger=\"changeSort('DOM')\">DOM</span></th><th class=\"thsortable\" click.trigger=\"changeSort('MLSNumber')\">MLS</th><th class=\"thsortable\" click.trigger=\"changeSort('Neighbourhood')\">Location</th><th class=\"thsortable\"><span class=\"thsortable\" click.trigger=\"changeSort('ListingPrice')\">Price</span> ( <span class=\"thsortable\" click.trigger=\"changeSort('PPImpSqft')\">P</span>)</th><th class=\"thsortable\"><span click.trigger=\"changeSort('LotSqft')\">Parcel</span> (<span class=\"thsortable\" click.trigger=\"changeSort('PPLotSqft')\">P</span>)</th><th class=\"thsortable\" click.trigger=\"changeSort('ListingSqft')\">Property (<span class=\"thsortable\" click.trigger=\"changeSort('YearBuilt')\">Y</span> | <span class=\"thsortable\" click.trigger=\"changeSort('CAP')\">C</span>)</th></tr></thead><tbody id=\"listingsTableBody\"><tr id=\"listingsTableRow_${listing.ListingID}\" click.trigger=\"clickRow($event,listing.ListingID,listing.FullAddress,listing.Longitude,listing.Latitude)\" class=\"listingsTableRow\" repeat.for=\"listing of listings | sort:sortColumn:sortOrder\"><td class=\"STATUS${listing.ListingStatus | removeSpaces}\"><div class=\"box\"><span id=\"listingsTableCell_ListingImage_${listing.ListingID}\"><img border=\"1\" src=\"${listing.PrimaryImage}\" width=\"120\"></span><br><span style=\"color:#666\" id=\"listingsTableCell_DOM_${listing.ListingID}\">RA:<b>${listing.StatusHours | dateFormat:'daysToHoursDays'}</b> | CDOM:<b>${listing.DOM}d</b></span><div class=\"ribbon${listing.ListingStatus | removeSpaces}\"><span>${listing.ListingType}</span></div></div></td><td style=\"vertical-align:top\"><font size=\"+1\"><span id=\"Span8\">${listing.City}</span></font> | <span id=\"listingsTableCell_MLSNumber_${listing.ListingID}\"><a click.trigger=\"hyperLink('http://www.coldwellbankerbain.com/'+listing.MLSNumber)\" target=\"_MLS${listing.ListingID}\" href=\"\">${listing.MLSNumber}</a></span> | <span id=\"listingsTableCell_TaxID_${listing.EXTID1}\"><a click.trigger=\"hyperLink('http://blue.kingcounty.com/Assessor/eRealProperty/Dashboard.aspx?ParcelNbr='+listing.EXTID1)\" target=\"_COUNTY${listing.ListingID}\" href=\"\">C</a></span><br><span id=\"Span9\">${listing.NeighbourhoodUnited}</span><br><span id=\"Span10\"><a target=\"_RA${listing.ListingID}\" click.trigger=\"hyperLink('../../REPM/PropertySearch.aspx?Address='+listing.FullAddress)\" href=\"../REPM/PropertySearch.aspx?Address=${listing.FullAddress}\">${listing.StreetAddress}</a></span></td><td style=\"vertical-align:top\"><font size=\"+1\"><span id=\"Span4\">${listing.ListingPrice | numberFormat:'kmbt'}</span></font><br>${listing.PPImpSqft | numberFormat:'($0,0)'}<small>/sqft</small><br></td><td style=\"vertical-align:top\"><font size=\"+1\"><span id=\"listingsTableCell_SqFtLot_${listing.ListingID}\">${listing.LotSqft | numberFormat:'(0,0)'}</span> </font>sqft<br>${listing.PPLotSqft | numberFormat:'($0,0)'}<small>/sqft</small><br><b><span style=\"border:thin;border-width:1px;border-color:#ccc;background-color:#f2f2f2;margin:1px;border-style:dashed;padding-left:3px;padding-right:3px\" id=\"Span6\">${listing.CurrentZoning | removeSpaces}</span></b> <b><span class.bind=\"listing.ZoningFutureCSS\" style=\"border:thin;border-width:1px;border-color:#ffc954;background-color:#ffedc5;margin:1px;border-style:dashed;padding-left:3px;padding-right:3px\" id=\"Span1\">${listing.ZoningFuture3 | removeSpaces}</span></b> <font size=\"-1\"><span class.bind=\"listing.UrbanVillageCSS\"><span style=\"border:thin;border-width:1px;border-color:#ccc;margin:1px;border-style:dashed;padding-left:3px;padding-right:3px\" title=\"${listing.UrbanVillageCurrent | ralistings:'UVONLYDESC'}\" id=\"Span7\">${listing.UrbanVillageCurrent | ralistings:'UVREMOVEDESC'} </span></span><span class.bind=\"listing.UrbanVillageFutureCSS\"><span style=\"border:thin;border-width:1px;border-color:#ffc954;background-color:#ffedc5;margin:1px;border-style:dashed;padding-left:3px;padding-right:3px\" title=\"${listing.UrbanVillageFuture | ralistings:'UVONLYDESC'}\" id=\"Span2\">${listing.UrbanVillageFuture | ralistings:'UVREMOVEDESC'}</span></span><br><span class.bind=\"listing.FrequentTransitCSS\"><img width=\"10\" src=\"img/walk.png\">${listing.FTDistanceToNearestStation | numberFormat:'(0,0)'}<sub>ft</sub> - <img width=\"12\" src=\"http:${listing.FTVehicleIcon}\"> <span style=\"border:thin;border-width:1px;border-color:#ccc;margin:1px;border-style:solid;padding-left:0;padding-right:3px\"><a target=\"_ft\" title=\"${listing.FTNearestStationName}\" click.trigger=\"hyperLink(listing.FTNearestStationURL)\">${listing.FTNearestStationLine}</a></span></span></font></td><td style=\"vertical-align:top\"><font size=\"+1\"><span id=\"listingsTableCell_ListingSqft_${listing.ListingID}\">${listing.ListingSqft | numberFormat:'(0,0)'}</span> </font>sqft<br><span id=\"Span3\"><i class=\"fa fa-bed\" aria-hidden=\"true\"></i> ${listing.ListingBeds | numberFormat:'removezeros' }</span>| <span id=\"Span5\"><i class=\"fa fa-bath\" aria-hidden=\"true\"></i> ${listing.ListingBaths| numberFormat:'removezeros' }</span><br><span title=\"${listing.PresentUseName}\" id=\"listingsTableCell_PresentUseName_${listing.ListingID}\">${listing.PresentUseGroup} ${listing.CAPTEXT}</span><br><span title=\"${listing.YearBuilt}\" id=\"listingsTableCell_YearBuilt_$\">${listing.YearBuilt}</span></td></tr></tbody></table><div show.bind=\"tableType == 'compact'\" class=\"compact-view\"><div class=\"row\"><div class=\"col-sm-6 poi-item\" click.trigger=\"clickRow($event,listing.ListingID,listing.FullAddress,listing.Longitude,listing.Latitude)\" repeat.for=\"listing of listings | sort:sortColumn:sortOrder\"><img src=\"${listing.PrimaryImage}\" class=\"item-image\" border=\"1\"><div class=\"thumb-overlay\"><span if.bind=\"listing.ListingStatus=='A'\" class=\"label label-success thumb-badge thumb-badge${listing.ListingStatus | removeSpaces}\">${listing.StatusHours | dateFormat:'daysToHoursDaysLong'} on dashReal</span> <span if.bind=\"listing.ListingStatus=='P'\" class=\"label label-success thumb-badge thumb-badge${listing.ListingStatus | removeSpaces}\">Pending ${listing.StatusHours | dateFormat:'daysToHoursDaysLong'}</span> <span if.bind=\"listing.ListingStatus=='PI'\" class=\"label label-success thumb-badge thumb-badge${listing.ListingStatus | removeSpaces}\">Pending Inspection ${listing.StatusHours | dateFormat:'daysToHoursDaysLong'}</span> <span if.bind=\"listing.ListingStatus=='PB'\" class=\"label label-success thumb-badge thumb-badge${listing.ListingStatus | removeSpaces}\">Pending Backup ${listing.StatusHours | dateFormat:'daysToHoursDaysLong'}</span> <span if.bind=\"listing.ListingStatus=='PF'\" class=\"label label-success thumb-badge thumb-badge${listing.ListingStatus | removeSpaces}\">Pending Feas. ${listing.StatusHours | dateFormat:'daysToHoursDaysLong'}</span> <span if.bind=\"listing.ListingStatus=='S'\" class=\"label label-success thumb-badge thumb-badge${listing.ListingStatus | removeSpaces}\">Sold ${listing.StatusHours | dateFormat:'daysToHoursDaysLong'} ago</span> <span class=\"rate-item\"><i class=\"fa fa-star\"></i></span><div class=\"resort-info\"><div class=\"price-location\"><div class=\"price\"><span>$</span> ${listing.ListingPrice | numberFormat: '(0,0)'}</div><div class=\"address1\"><span>${listing.City}, </span><span>${listing.State} </span><span>${listing.ZIP}</span></div><div class=\"street-address\"><span>${listing.StreetAddress}</span></div></div><div class=\"resort-room-info\"><div class=\"column\"><span class=\"count\">${listing.ListingBeds | numberFormat: '(0,0)'}</span><span class=\"name\">Beds</span></div><div class=\"column\"><span class=\"count\">${listing.ListingBaths | numberFormat: '(0,0)' }</span><span class=\"name\">Baths</span></div><div class=\"column\"><span class=\"count\">${listing.ListingFinishedSqft | numberFormat: '(0,0)'}</span><span class=\"name\">Sq.Ft</span></div></div></div></div></div></div></div></div></div></div></div></template>"; });
define('text!assets/style/realdash.css', ['module'], function(module) { module.exports = "#bodyDiv {\r\n    height: calc(100vh - 105px);\r\n}\r\n.brand-dash {\r\n    color: white;\r\n}\r\n.brand-real {\r\n    color: black;\r\n}\r\n.navbar-icon {\r\n    color: #a5fa54;\r\n}\r\n.search-filter-bar {\r\n    min-height: 50px;\r\n    background-color: #13b2cf;\r\n    box-shadow: 0px 2px 2px 0px rgba(173,173,173,0.75);\r\n}\r\n.search-filter-bar > .row {\r\n    display: flex; \r\n    margin: 0;\r\n}\r\n.search-filter-bar .place-search-filter {\r\n    width: 100%;\r\n    line-height: 50px;\r\n    padding: 0 20px;\r\n    font-family: FontAwesome, Arial, Helvetica, sans-serif;\r\n}\r\n.search-filter-bar .filter-bar {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: flex-start;\r\n    align-items: center;\r\n}\r\n.filter-bar div.dropdown a.dropdown-toggle {\r\n    padding: 17px;\r\n    border: 1px #36b9d0 solid;\r\n}\r\n.dash-dropdown {\r\n    position: relative;\r\n    display: inline-block;\r\n}\r\n.dash-filter-menu {\r\n    padding: 17px 2.5rem;\r\n    color: white;\r\n}\r\n.dropdown-menu {\r\n    display: none;\r\n    position: absolute;\r\n    background-color: #f9f9f9;\r\n    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);\r\n    padding: 12px 16px;\r\n    top: 50px;\r\n    z-index: 10;\r\n    margin-top: 3px;\r\n}\r\n.dropdown .dropdown-menu {\r\n    background-color: white;\r\n    color: black;\r\n    border-top: 2px #11516d solid;\r\n    border-bottom: 2px #13b2cf solid;\r\n    padding: 2rem;\r\n    justify-content: space-around;\r\n    border-radius: 0;\r\n}\r\n.dropdown .dropdown-menu .dash-icon {\r\n    width: 10px;\r\n    height: 3px;\r\n    background-color: black;\r\n    margin: 0 15px;\r\n}\r\n.dropdown:hover, .dropdown:focus {\r\n    background-color: #11516d;\r\n}\r\n.dropdown:hover .dropdown-menu, .dropdown:focus .dropdown-menu, .dropdown.open .dropdown-menu {\r\n    display: flex;\r\n    transition: ease-in-out, display .35s ease-in-out;\r\n}\r\n.dropdown.open .dash-filter-menu {\r\n    background-color: #11516d;\r\n}\r\n.filter-bar select {\r\n    border-radius: 0;\r\n}\r\n/** \r\n* Propert Menu \r\n**/\r\n.property-menu {\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    width: 600px;\r\n    align-items: flex-start;\r\n    padding: 2rem;\r\n}\r\n.property-menu .section {\r\n    display: flex;\r\n    flex-direction: row;\r\n    margin-bottom: 3rem;\r\n}\r\n.property-menu .section .section-item {\r\n    margin: 0 1rem;\r\n}\r\n.property-menu .select-filter {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: flex-start;\r\n    align-items: center;\r\n    margin-top: 1rem;\r\n    padding: 0;\r\n}\r\n\r\n/**\r\n* More Menu\r\n**/\r\n.more-menu {\r\n    flex-direction: column;\r\n    justify-content: flex-start;\r\n    width: 600px;\r\n    align-items: flex-start;\r\n    padding: 2rem;\r\n}\r\n.more-menu .section {\r\n    display: flex;\r\n    flex-direction: row;\r\n    margin-bottom: 3rem;\r\n    width: 100%;\r\n    justify-content: space-between;\r\n}\r\n.more-menu .section .section-item {\r\n    margin: 0 1rem;\r\n}\r\n.more-menu .form-group.select-filter {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    margin-top: 1rem;\r\n    padding: 0;\r\n    width: 400px;\r\n}\r\n.more-menu .select-filter {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    margin-top: 1rem;\r\n    padding: 0;\r\n    width: 100%;\r\n}\r\n.more-menu .btn-group .btn {\r\n    border-radius: 0;\r\n    padding: 6px 6px;\r\n}\r\n.more-menu .btn-group .btn.active {\r\n    background-color: white;\r\n    padding: 6px 2rem;\r\n}\r\n.more-menu .section .section-item .filter-option-wrapper {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    width: 90px;\r\n}\r\n.more-menu .section .section-item .filter-option-wrapper .icon-image {\r\n    width: 25px;\r\n    height: 25px;\r\n    background-image: url(src/assets/image/Transport-Sail-Boat-icon.png);\r\n    background-repeat: no-repeat;\r\n    background-size: cover;\r\n}\r\n.more-menu .section .section-item .filter-option-wrapper .icon-name {\r\n    font-size: 12px;\r\n}\r\n.more-menu .section.days-filter .section-item {\r\n    width: 50%;\r\n    align-items: stretch;\r\n}\r\n.number-spinner input, .number-spinner span button{\r\n    padding-top: 8px;\r\n}\r\n/****************\r\n           Toogle Check Box\r\n           ***********************************/\r\n.form-group input[type=\"checkbox\"] {\r\n    display: none;\r\n}\r\n\r\n.form-group input[type=\"checkbox\"] + .btn-group > label span {\r\n    width: 20px;\r\n}\r\n\r\n.form-group input[type=\"checkbox\"] + .btn-group > label span:first-child {\r\n    display: none;\r\n}\r\n.form-group input[type=\"checkbox\"] + .btn-group > label span:last-child {\r\n    display: inline-block;\r\n}\r\n\r\n.form-group input[type=\"checkbox\"]:checked + .btn-group > label span:first-child {\r\n    display: inline-block;\r\n}\r\n.form-group input[type=\"checkbox\"]:checked + .btn-group > label span:last-child {\r\n    display: none;\r\n}\r\n\r\n.filter-option-wrapper {\r\n    display: flex;\r\n    flex-direction: column;\r\n}\r\n.button_season .filter-image {\r\n    width: 14px;\r\n    margin-right: 5px;\r\n}\r\n.button_season {\r\n    min-width: 100px;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n.save-search-menu {\r\n    line-height: 54px;\r\n    padding-right: 20px;\r\n    background-color: #96eb5b;\r\n    padding-left: 20px;\r\n    color: black;\r\n}\r\n\r\n\r\n\r\n.landing-page {\r\n    display: flex;\r\n    flex-direction: row;\r\n    height: 100%;\r\n}\r\n#listingsTableDiv {\r\n    height: 100%;\r\n    padding: 0px 15px;\r\n    width: 750px;\r\n}\r\n.table-type {\r\n    display: flex;\r\n    justify-content: flex-end;\r\n    align-items: center;\r\n}\r\n.table-type #sort-item {\r\n    padding: 0 10px;\r\n    text-transform: uppercase;\r\n    border-width: 0px;\r\n}\r\n.item-image {\r\n    width: 100%;\r\n    height: 190px;\r\n\r\n}\r\n.compact-view {\r\n    height: calc(100vh - 265px);\r\n    margin-top: 10px;\r\n    overflow-y: scroll;\r\n}\r\n.compact-view::-webkit-scrollbar { \r\n    display: none; \r\n}\r\n.compact-view .row {\r\n    margin-left: 0px;\r\n    margin-right: 0px;\r\n    height: 100%;\r\n    overflow-y: scroll;\r\n}\r\n.compact-view .poi-item {\r\n    padding: 8px;\r\n}\r\n.thumb-overlay {\r\n    position: absolute;\r\n    top: 8px;\r\n    left: 8px;\r\n    right: 8px;\r\n    bottom: 8px;\r\n    background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0), rgba(0,0,0,0.5), rgba(0, 0, 0, 0.7));\r\n}\r\n.thumb-overlay .thumb-badge {\r\n    position: absolute;\r\n    top:3px;\r\n    left:3px;\r\n    padding: 0.55rem 0.75rem;\r\n    font-size: 0.95em;\r\n    opacity:0.93;\r\n}\r\n\r\n.thumb-overlay .thumb-badgeA {\r\n\r\n  background-color:#52b30e;\r\n}\r\n\r\n.thumb-overlay .thumb-badgeP {\r\n\r\n  background-color:#f6ac15;\r\n}\r\n\r\n.thumb-overlay .thumb-badgeS {\r\n\r\n  background-color:#59abe5;\r\n}\r\n\r\n.thumb-overlay .thumb-badgePB {\r\n\r\n  background-color:#f6ac15;\r\n}\r\n\r\n.thumb-overlay .thumb-badgePF {\r\n\r\n  background-color:#f6ac15;\r\n}\r\n\r\n.thumb-overlay .thumb-badgePI {\r\n\r\n  background-color:#f6ac15;\r\n}\r\n\r\n\r\n.thumb-overlay .rate-item {\r\n    position: absolute;\r\n    font-size: 20px;\r\n    padding: 5px 15px;\r\n    right: 0;\r\n    /* color: rgba(0,0,0,.2); */\r\n    color: #96eb5b;\r\n}\r\n.thumb-overlay .resort-info {\r\n    color: white;\r\n    position: absolute;\r\n    bottom: 0;\r\n    width: 100%;\r\n    display: flex;\r\n    justify-content: space-between;\r\n    padding: 0 1rem 0.5rem;\r\n    align-items: flex-end;  \r\n}\r\n.thumb-overlay .resort-info .price-location .price {\r\n    font-size: 1.5em;\r\n}\r\n.thumb-overlay .resort-info .price-location .address1 {\r\n    font-size: 1.1em;\r\n}\r\n.thumb-overlay .resort-info .price-location .street-address {\r\n    font-size: 1em;\r\n    font-weight:lighter;\r\n}\r\n.thumb-overlay .resort-info .resort-room-info {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    width: 45%;\r\n}\r\n.thumb-overlay .resort-info .resort-room-info .column {\r\n    display: flex;\r\n    flex-direction: column;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n.thumb-overlay .resort-info .resort-room-info .column .count {\r\n    font-size: 1.5em;\r\n    position: relative;\r\n    bottom: -2px;\r\n}\r\n.map-view {\r\n    width: 100%;\r\n    z-index: 5;\r\n}\r\ngoogle-map {\r\n    height: 100%;\r\n    position: relative;\r\n    overflow: hidden;\r\n    top: 0px;\r\n    left: 0px;\r\n    width: 100%;\r\n}\r\ngoogle-map::before {\r\n    box-shadow: inset 0px 5px 5px 0px rgba(173,173,173,0.75);   \r\n}\r\n#listingsTableDiv .btn.btn-default {\r\n    border-width: 0;\r\n}\r\n\r\n/** Google Map Style **/\r\n.map-view {\r\n    position: relative;\r\n    overflow: hidden;\r\n    width: 100%;\r\n}\r\n.map-view:before, .map-view:after, google-map:before, google-map:after {\r\n    position: absolute;\r\n    display: block;\r\n    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);\r\n    content: '';\r\n    z-index: 5;\r\n}\r\n.map-view:before {\r\n    top: -5px;\r\n    left: 0;\r\n    right: 0;\r\n    height: 5px;\r\n}\r\n.map-view:after {\r\n    right: -5px;\r\n    top: 0;\r\n    bottom: 0;\r\n    width: 5px;\r\n}\r\ngoogle-map:before{\r\n    bottom: -5px;\r\n    left: 0;\r\n    right: 0;\r\n    height: 5px;\r\n}\r\ngoogle-map:after{\r\n    left: -5px;\r\n    top: 0;\r\n    bottom: 0;\r\n    width: 5px;\r\n}\r\ngoogle-map {\r\n    width: inherit;\r\n    height: 100%;\r\n}\r\n.disable-input {\r\n    color: grey;\r\n}"; });
define('text!components/bed-filter/bed-filter.html', ['module'], function(module) { module.exports = "<template><require from=\"./style.css\"></require><select name=\"minimum\" id=\"minimum\" value.bind=\"selectedMinBed\" class.bind=\"selectedMinBed==minBeds? 'disable-input': ''\" change.delegate=\"changeMinBed(selectedMinBed)\"><option model.bind=\"minBeds\">No Min</option><option repeat.for=\"bed of minBedList\" model.bind=\"bed\" style=\"color:#000\">${bed}</option></select><div class=\"dash-icon\"></div><select name=\"maximum\" id=\"maximum\" value.bind=\"selectedMaxBed\" class.bind=\"selectedMaxBed==maxBeds? 'disable-input': ''\" change.delegate=\"changeMaxBed(selectedMaxBed)\"><option model.bind=\"maxBeds\">No Max</option><option repeat.for=\"bed of maxBedList\" model.bind=\"bed\" style=\"color:#000\">${bed}</option></select></template>"; });
define('text!components/bed-filter/style.css', ['module'], function(module) { module.exports = "\r\nbed-filter select {\r\n    width: 80px;\r\n    height: 30px;\r\n    outline-offset: 0px;\r\n    padding: 0 1rem;\r\n    -webkit-appearance: none;\r\n    background-image: url(\"src/assets/image/arrow-down.png\");\r\n    background-repeat: no-repeat;\r\n    background-size: 15px 12px;\r\n    background-position: 80% center;\r\n    font-size: 10px;\r\n}\r\n"; });
define('text!components/days-on-market/days-on-market.html', ['module'], function(module) { module.exports = "<template><require from=\"./style.css\"></require><div><select name=\"days_on_market\" id=\"days_on_market\" value.bind=\"default\" change.delegate=\"changeDays(default)\"><option repeat.for=\"list of lists\" model.bind=\"list.days\" style=\"color:#000\">${list.name}</option></select></div></template>"; });
define('text!components/days-on-market/style.css', ['module'], function(module) { module.exports = "days-on-market select {\r\n    width: 100%;\r\n    height: 30px;\r\n    outline-offset: 0px;\r\n    padding: 0 1rem;\r\n    -webkit-appearance: none;\r\n    background-image: url(\"src/assets/image/arrow-down.png\");\r\n    background-repeat: no-repeat;\r\n    background-size: 15px 12px;\r\n    background-position: 95% center;\r\n    font-size: 10px;\r\n}\r\ndays-on-market{\r\n    width: 100%;\r\n}\r\n"; });
define('text!components/garage-filter/garage-filter.html', ['module'], function(module) { module.exports = "<template><require from=\"./style.css\"></require><div class=\"input-group number-spinner\"><span class=\"input-group-btn\"><button class=\"btn btn-default\" data-dir=\"dwn\" click.delegate=\"changeValue(false)\"><span class=\"fa fa-minus\"></span></button> </span><input type=\"text\" class=\"form-control text-center\" value.bind=\"index\"> <span class=\"input-group-btn\"><button class=\"btn btn-default\" data-dir=\"up\" click.delegate=\"changeValue(true)\"><span class=\"fa fa-plus\"></span></button></span></div></template>"; });
define('text!components/garage-filter/style.css', ['module'], function(module) { module.exports = ".input-group-btn .btn.btn-default {\r\n    border-radius: 0;\r\n    background-color: #11516e;\r\n    color: white;\r\n    border: 0;\r\n    padding: 7px 12px;\r\n}\r\n.input-group.number-spinner {\r\n    width: 130px;\r\n}\r\n.input-group.number-spinner > input {\r\n    border-left: 0;\r\n    border-right: 0;\r\n}"; });
define('text!components/last-updated-filter/last-updated.html', ['module'], function(module) { module.exports = "<template><require from=\"./style.css\"></require><div><select name=\"last-updated\" id=\"last_updated\" value.bind=\"default\" change.delegate=\"changeDays(default)\"><option repeat.for=\"list of lists\" model.bind=\"list.days\" style=\"color:#000\">${list.name}</option></select></div></template>"; });
define('text!components/last-updated-filter/style.css', ['module'], function(module) { module.exports = "last-updated select {\r\n    width:100%;\r\n    height: 30px;\r\n    outline-offset: 0px;\r\n    padding: 0 1rem;\r\n    -webkit-appearance: none;\r\n    background-image: url(\"src/assets/image/arrow-down.png\");\r\n    background-repeat: no-repeat;\r\n    background-size: 15px 12px;\r\n    background-position: 95% center;\r\n    font-size: 10px;\r\n}\r\nlast-updated {\r\n    width: 100%;\r\n}"; });
define('text!components/lot-filter/lot-filter.html', ['module'], function(module) { module.exports = "<template><require from=\"./style.css\"></require><select name=\"minimum\" id=\"minimum\" value.bind=\"selectedMinLot\" class.bind=\"selectedMinLot==minLot? 'disable-input': ''\" change.delegate=\"changeMinLot(selectedMinLot)\"><option model.bind=\"minLot\">No Min</option><option repeat.for=\"lot of minLotList\" model.bind=\"lot\" style=\"color:#000\">${lot}</option></select><div class=\"dash-icon\"></div><select name=\"maximum\" id=\"maximum\" value.bind=\"selectedMaxLot\" class.bind=\"selectedMaxLot==maxLot? 'disable-input': ''\" change.delegate=\"changeMaxLot(selectedMaxLot)\"><option model.bind=\"maxLot\">No Max</option><option repeat.for=\"lot of maxLotList\" model.bind=\"lot\" style=\"color:#000\">${lot}</option></select></template>"; });
define('text!components/lot-filter/style.css', ['module'], function(module) { module.exports = "lot-filter select {\r\n    width: 80px;\r\n    height: 30px;\r\n    outline-offset: 0px;\r\n    padding: 0 1rem;\r\n    -webkit-appearance: none;\r\n    background-image: url(\"src/assets/image/arrow-down.png\");\r\n    background-repeat: no-repeat;\r\n    background-size: 15px 12px;\r\n    background-position: 80% center;\r\n    font-size: 10px;\r\n}\r\n"; });
define('text!components/price-filter/price-filter.html', ['module'], function(module) { module.exports = "<template><require from=\"./style.css\"></require><div class=\"dropdown-menu\"><select name=\"minimum\" id=\"minimum\" value.bind=\"selectedMinPrice\" class.bind=\"selectedMinPrice==minPrice? 'disable-input': ''\" change.delegate=\"changeMinPrice(selectedMinPrice)\"><option model.bind=\"minPrice\">No Minimum</option><option repeat.for=\"price of minPriceList\" model.bind=\"price\" style=\"color:#000\">${price | numberFormat: 'kmbt'}</option></select><div class=\"dash-icon\"></div><select name=\"maximum\" id=\"maximum\" value.bind=\"selectedMaxPrice\" class.bind=\"selectedMaxPrice==maxPrice? 'disable-input': ''\" change.delegate=\"changeMaxPrice(selectedMaxPrice)\"><option model.bind=\"maxPrice\">No Maximum</option><option repeat.for=\"price of maxPriceList\" model.bind=\"price\" style=\"color:#000\">${price | numberFormat: 'kmbt'}</option></select></div></template>"; });
define('text!components/price-filter/style.css', ['module'], function(module) { module.exports = "price-filter .dropdown-menu select {\r\n    width: 110px;\r\n    height: 30px;\r\n    outline-offset: 0px;\r\n    padding: 0 1rem;\r\n    -webkit-appearance: none;\r\n    border-radius: 0;\r\n}\r\nprice-filter .dropdown-menu {\r\n    background-color: white;\r\n    color: black;\r\n    border-top: 2px #11516d solid;\r\n    border-bottom: 2px #13b2cf solid;\r\n    padding: 2rem;\r\n    justify-content: space-around;\r\n    border-radius: 0;\r\n    align-items: center;\r\n}"; });
define('text!components/spinner-input/spinner-input.html', ['module'], function(module) { module.exports = "<template><require from=\"./style.css\"></require><div class=\"input-group number-spinner\"><span class=\"input-group-btn\"><button class=\"btn btn-default\" data-dir=\"dwn\" click.delegate=\"changeValue(false)\"><span class=\"fa fa-minus\"></span></button> </span><input type=\"text\" class=\"form-control text-center\" value.bind=\"value[index]+' +'\"> <span class=\"input-group-btn\"><button class=\"btn btn-default\" data-dir=\"up\" click.delegate=\"changeValue(true)\"><span class=\"fa fa-plus\"></span></button></span></div></template>"; });
define('text!components/spinner-input/style.css', ['module'], function(module) { module.exports = ".input-group-btn .btn.btn-default {\r\n    border-radius: 0;\r\n    background-color: #11516e;\r\n    color: white;\r\n    border: 0;\r\n    padding: 7px 12px;\r\n}\r\n.input-group.number-spinner {\r\n    width: 130px;\r\n}\r\n.input-group.number-spinner > input {\r\n    border-left: 0;\r\n    border-right: 0;\r\n}"; });
define('text!components/sqrt-filter/sqrt-filter.html', ['module'], function(module) { module.exports = "<template><require from=\"./style.css\"></require><select name=\"minimum\" id=\"minimum\" value.bind=\"selectedMinSqrt\" class.bind=\"selectedMinSqrt==minSqrt? 'disable-input': ''\" change.delegate=\"changeMinSqrt(selectedMinSqrt)\"><option model.bind=\"minSqrt\">No Min</option><option repeat.for=\"sqrt of minSqrtList\" model.bind=\"sqrt\" style=\"color:#000\">${sqrt}</option></select><div class=\"dash-icon\"></div><select name=\"maximum\" id=\"maximum\" value.bind=\"selectedMaxSqrt\" class.bind=\"selectedMaxSqrt==maxSqrt? 'disable-input': ''\" change.delegate=\"changeMaxSqrt(selectedMaxSqrt)\"><option model.bind=\"maxSqrt\">No Max</option><option repeat.for=\"sqrt of maxSqrtList\" model.bind=\"sqrt\" style=\"color:#000\">${sqrt}</option></select></template>"; });
define('text!components/sqrt-filter/style.css', ['module'], function(module) { module.exports = "\r\nsqrt-filter select {\r\n    width: 80px;\r\n    height: 30px;\r\n    outline-offset: 0px;\r\n    padding: 0 1rem;\r\n    -webkit-appearance: none;\r\n    background-image: url(\"src/assets/image/arrow-down.png\");\r\n    background-repeat: no-repeat;\r\n    background-size: 15px 12px;\r\n    background-position: 80% center;\r\n    font-size: 10px;\r\n}\r\n"; });
define('text!components/year-built-filter/year-built-filter.html', ['module'], function(module) { module.exports = "<template><require from=\"./style.css\"></require><select name=\"minimum\" id=\"minimum\" value.bind=\"selectedMinYear\" class.bind=\"selectedMinYear==minYear? 'disable-input': ''\" change.delegate=\"changeMinYear(selectedMinYear)\"><option model.bind=\"minYear\">Min</option><option repeat.for=\"year of minYearList\" model.bind=\"year\" style=\"color:#000\">${year}</option></select><div class=\"dash-icon\"></div><select name=\"maximum\" id=\"maximum\" value.bind=\"selectedMaxYear\" class.bind=\"selectedMaxYear==maxYear? 'disable-input': ''\" change.delegate=\"changeMaxYear(selectedMaxYear)\"><option model.bind=\"maxYear\">Max</option><option repeat.for=\"year of maxYearList\" model.bind=\"year\" style=\"color:#000\">${year}</option></select></template>"; });
define('text!components/year-built-filter/style.css', ['module'], function(module) { module.exports = "year-filter select {\r\n    width: 80px;\r\n    height: 30px;\r\n    outline-offset: 0px;\r\n    padding: 0 1rem;\r\n    -webkit-appearance: none;\r\n    background-image: url(\"src/assets/image/arrow-down.png\");\r\n    background-repeat: no-repeat;\r\n    background-size: 15px 12px;\r\n    background-position: 80% center;\r\n    font-size: 10px;\r\n}\r\n"; });
//# sourceMappingURL=app-bundle.js.map