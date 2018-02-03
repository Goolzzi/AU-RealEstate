// <reference path="../../../FrontEnd/GIS/GetJSON.aspx" />
import { inject, bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Router } from 'aurelia-router';
import { applicationState } from 'applicationState';
import numeral from 'numeral';

@inject(applicationState, Router, EventAggregator)
export class listings {


  // ---------------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------------

  constructor(appState, router, eventAggregator) {
    this.appState = appState;
    this.router = router;
    this.eventAggregator = eventAggregator;
    this.firstTime = true;
    this.tableType = 'compact';
    this.zoomRate = 10;
    this.bounds = null;
  }

  // ---------------------------------------------------------------------------------
  // Price filter
  // ---------------------------------------------------------------------------------


  // ---------------------------------------------------------------------------------
  // Class letiables
  // ---------------------------------------------------------------------------------

  listings = [];
  sortColumn = 'StatusHours';
  sortOrder = 'ascending';
  currentAddress = 'Seattle, WA';
  longitude = -122.349275;
  latitude = 47.620548;

  // ---------------------------------------------------------------------------------
  // Map Globals
  // ---------------------------------------------------------------------------------

  // ---------------------------------------------------------------------------------
  // POIs
  // ---------------------------------------------------------------------------------

  POIs = [{
    POIID: 0,
    POIName: 'None'
  }];


  // ---------------------------------------------------------------------------------
  // Filters
  // ---------------------------------------------------------------------------------
  filters = {
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
    MinBaths:[0],
    MinYear:[0],
    MaxYear:[0],
    MustBsmnt:[0],
    SplitOK:[1],
    OneStory:[0],
    MinGarage:[0],
    GarageCvr:[0],
    Waterfront:[0],
    Views:[0],
    hasAC:[0],
    Kitchen2nd:[0],
    Fence:[0],
    FenceFull:[0],
    MasterBth:[0],
  };

  get minPrice() {
    return `${this.filters.MinPrice[0]}`;
  }
  get maxPrice() {
    return `${this.filters.MaxPrice[0]}`;
  }
  get getLatitude() {
    return `${this.latitude}`;
  }
  get getLongitude() {
    return `${this.longitude}`;
  }
  get listingStatus() {
    let status = {
      active: false,
      pending: false,
      sold: false
    };
    this.filters.ListingStatus.forEach(ele => {
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
    })
    return status;
  }
  @bindable mapMarkers = [

    {
      infoWindow: {
        content: `
            <div id="content">
                <div id="siteNotice"></div>
                <h1 id="firstHeading" class="firstHeading">Uluru</h1>
                <div id="bodyContent">
                <p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large sandstone rock formation in the southern part of the Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) south west of the nearest large town, Alice Springs; 450&#160;km (280&#160;mi) by road. Kata Tjuta and Uluru are the two major features of the Uluru - Kata Tjuta National Park. Uluru is sacred to the Pitjantjatjara and Yankunytjatjara, the Aboriginal people of the area. It has many springs, waterholes, rock caves and ancient paintings. Uluru is listed as a World Heritage Site.</p>
                <p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">https://en.wikipedia.org/w/index.php?title=Uluru</a> last visited June 22, 2009).</p>
                </div>
            </div>
        `
      }
    }
  ];
  // ---------------------------------------------------------------------------------
  // Page Load Code
  // ---------------------------------------------------------------------------------

  attached() {
    // On Load Event
    this.appState.connectionReady.done(() => {
      this.refreshData();
      this.loadPOIs();
    });
    this.eventAggregator.subscribe('googlemap:marker:click', response => {
      //this.latitude = response.position.lat();
      //this.longitude = response.position.lng();
      // this.zoomRate = 12;
      this.clickRow('', response.custom.id, '');
      let dif = $('#listingsTableDiv').offset().top - $('#listingsTableID').offset().top + $('#listingsTableRow_' + response['custom']['id']).position().top - 18;
      $('#listingsTableDiv').animate({
        scrollTop: dif
      }, 400);
    })
    // Map Boudries filter event

    // Refresh Listings on server listings event 
    this.eventAggregator.subscribe('RealtorAnalytics:Listings:Updated', response => {
      console.log("eventAggregator: realtoranalytics:listings:updated");
      this.refreshData();
    });
    this.eventAggregator.subscribe('set-min-price', message => {
      this.filters.MinPrice[0] = message;
      this.refreshData();
    });
    this.eventAggregator.subscribe('set-max-price', message => {
      this.filters.MaxPrice[0] = message;
      this.refreshData();
    });
    this.eventAggregator.subscribe('set-min-bed', message => {
      this.filters.MinBeds[0] = message;
      this.refreshData();
    });
    this.eventAggregator.subscribe('set-max-bed', message => {
      this.filters.MaxBeds[0] = message;
      this.refreshData();
    });
    this.eventAggregator.subscribe('set_baths', message => {
      this.filters.MinBaths[0] = message;
      this.refreshData();
    });
    this.eventAggregator.subscribe('set-min-sqrt', message => {
      this.filters.MinSqft[0] = message;
      this.refreshData();
    });
    this.eventAggregator.subscribe('set-max-sqrt', message => {
      this.filters.MaxSqft[0] = message;
      this.refreshData();
    });
    this.eventAggregator.subscribe('set-min-lot', message => {
      this.filters.MinLot[0] = message;
      this.refreshData();
    });
    this.eventAggregator.subscribe('set-max-lot', message => {
      this.filters.MaxLot[0] = message;
      this.refreshData();
    });
    this.eventAggregator.subscribe('set-min-year', message => {
      this.filters.MinYear[0] = message;
      this.refreshData();
    });
    this.eventAggregator.subscribe('set-max-year', message => {
      this.filters.MaxYear[0] = message;
      this.refreshData();
    });
    this.eventAggregator.subscribe('set_days_on_market', message => {
      this.filters.DOM[0] = message;
      this.refreshData();
    });
    this.eventAggregator.subscribe('set_last_updated', message => {
      this.filters.STATDAYS[0] = message;
      this.refreshData();
    });
    this.eventAggregator.subscribe('set_garage', message => {
      this.filters.MinGarage[0] = message;
      this.refreshData();
    });

    /*
    this.eventAggregator.subscribe('googlemap:api:loaded', () => {  
    });
    */
  }
  loadMapLayers(map) {
    this.zoningLayer = new google.maps.Data();
    this.uvLayer = new google.maps.Data();
    this.CurrentuvLayer = new google.maps.Data();
    this.zoningChangeLayer = new google.maps.Data();
    this.transitLayer = new google.maps.Data();
    // this.zoningLayer.loadGeoJson('http://www.realtoranalytics.com/Admin/GIS/Layers/Zoning/Seattle/2017-06-HALA-DEIS/MHA_Zoning_Alt3.json');
    //this.zoningLayer.loadGeoJson("/Admin/GIS/Layers/Zoning/Seattle/MHA_DraftZoningChanges.json");
    //zoningChangeLayer.loadGeoJson("/Admin/GIS/Layers/Zoning/Seattle/MHA_ZoningChangeType.json");
    // this.uvLayer.loadGeoJson('http://www.realtoranalytics.com/Admin/GIS/Layers/Overlays/Seattle/2017MHAUrbanVillages.json');
    // this.CurrentuvLayer.loadGeoJson('http://www.realtoranalytics.com/Admin/GIS/Layers/Overlays/Seattle/UrbanVillages.json');
    window.onresize = function() {
      let center = map.map.getCenter();
      google.maps.event.trigger(map.map, 'resize');
      map.map.setCenter(center);
    };

    google.maps.event.addListener(map.map, 'idle', () => {
      let response = map.map.getBounds();
      this.filters.Boundries = [response.f.f, response.f.b, response.b.f, response.b.b];
      console.log('idle -----');
      this.refreshData();
    });

    this.zoningLayer.setMap(this.GoogleMap.map);
    //zoningChangeLayer.setMap(this.GoogleMap.map);
    this.uvLayer.setMap(this.GoogleMap.map);
    this.CurrentuvLayer.setMap(this.GoogleMap.map);
    this.transitLayer.setMap(this.GoogleMap.map);


    this.uvLayer.setStyle((feature) => {
      let uvtype = feature.getProperty('UV_TYPE');
      let _color;
      let _fillOpacity;
      let _strokeColor;
      let _strokeWeight;
      let firstChar;
      if (uvtype.strlength == 0)
        firstChar = "";
      else
        firstChar = uvtype.substring(0, 1);
      if (firstChar == "F") {
        _color = '#111111';
        _fillOpacity = 0.00;
        _strokeColor = '#FF9900';
        _strokeWeight = '2'
      } else {
        _color = ((uvtype == "UC") || (uvtype == "UCV")) ? '#111111' : '#333333';
        _fillOpacity = 0;
        _strokeColor = '#222222';
        _strokeWeight = '2'
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


    this.transitLayer.setStyle((feature) => {
      let shapeTime = feature.getProperty('RE_NAME');
      let _color;
      let _fillOpacity = 0.2;
      let _strokeColor;
      let _strokeWeight;
      let firstChar;

      if (shapeTime == 300)
        _color = '#018812';
      else if (shapeTime == 600)
        _color = '#01CC32';
      else if (shapeTime == 900)
        _color = '#FF9900';
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


    this.CurrentuvLayer.setStyle((feature) => {
      let uvtype = feature.getProperty('UV_TYPE');
      let _color;
      let _fillOpacity;
      let _strokeColor;
      let _strokeWeight;
      _color = ((uvtype == "UC") || (uvtype == "UCV")) ? '#111111' : '#333333';
      _fillOpacity = 0.00;
      _strokeColor = '#aaaaaa';
      _strokeWeight = '2'
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
    /*
    zoningChangeLayer.setStyle(function (feature) {
                
        let Zone = feature.getProperty('MHA_ZONING').toUpperCase();
        let _color;
        let _fillOpacity;
        let _strokeColor;
        let _strokeWeight;
        let _strokeOpacity;

        _color = '#000000';
        _fillOpacity = 0.15;
        _strokeColor = '#000000';
        _strokeWeight = '0'
        _strokeOpacity = 0;

        if (Zone == "RSL (M)") {
                    
            _fillOpacity = 0.00;
            _strokeColor = '#0000FF';
            _strokeWeight = '0'
            _strokeOpacity = 0;
        }
                


        return {
            fillColor: _color,
            fillOpacity: _fillOpacity,
            strokeColor: _strokeColor,
            strokeOpacity: '0.5',
            strokeWeight: _strokeWeight,
            zIndex: 12,
            clickable:false
        };
    });
    */


    this.zoningLayer.setStyle((feature) => {

      let objectID = feature.getProperty('ZONEID');
      let Zone = feature.getProperty('MHA_ZONING').toUpperCase();
      let ZoneDesc = feature.getProperty('ZONELUT_DE');
      let isMHA = feature.getProperty('MHA');
      let isUpgrade = feature.getProperty('UPGRADE');

      let _color;
      let _fillOpacity;
      let _strokeColor;
      let _strokeWeight;
      let _strokeOpacity;

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

      } else if ((Zone.indexOf("MR") >= 0) || (Zone.indexOf("HR") >= 0)) {
        _color = '#f36f11';
      } else if ((Zone.indexOf("NC1") >= 0) || (Zone.indexOf("NC2") >= 0) || (Zone.indexOf("NC3") >= 0)) {
        if ((Zone.indexOf("30") >= 0))
          _color = "#c261da";
        else if ((Zone.indexOf("40") >= 0))
          _color = "#c261da";
        else if ((Zone.indexOf("55") >= 0))
          _color = "#b450cd";
        else if ((Zone.indexOf("65") >= 0))
          _color = "#a03aba";
        else if ((Zone.indexOf("75") >= 0))
          _color = "#9530ae";
        else if ((Zone.indexOf("85") >= 0))
          _color = "#8b27a4";
        else if ((Zone.indexOf("95") >= 0))
          _color = "#822699";
        else if ((Zone.indexOf("125") >= 0) || (Zone.indexOf("160") >= 0))
          _color = "#641a76";
        else
          _color = "#a03aba";
      } else if ((Zone.indexOf("SM") >= 0) || (Zone.indexOf("SM") >= 0) || (Zone.indexOf("SM") >= 0)) {
        _color = '#7b41cc';
      } else if ((Zone.indexOf("DMC") >= 0) || (Zone.indexOf("DRC") >= 0) || (Zone.indexOf("PMM") >= 0)) {
        _color = '#42329c';
      } else if ((Zone.indexOf("C1") >= 0) || (Zone.indexOf("C2") >= 0) || (Zone.indexOf("C3") >= 0)) {
        _color = '#28b6f6';
      } else if ((Zone.indexOf("IB") >= 0) || (Zone.indexOf("IG") >= 0) || (Zone.indexOf("IC") >= 0)) {
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
        //clickable: false
      };
    });
  }

  hyperLink(url) {
    window.open(url);
  }
  selectViewType(type) {
    this.tableType = type;
  }

  // ---------------------------------------------------------------------------------
  // Filter click events
  // ---------------------------------------------------------------------------------

  clickCheckbox(group, value, chkbox) {
    if (!$("#" + chkbox).prop("checked"))
      this.filters[group].push(value)
    else
      this.filters[group].splice(this.filters[group].indexOf(value), 1);

    this.refreshData();
  }
  clickFeature(group, checkbox) {
    this.filters[group][0] = !$('#' + checkbox).prop('checked')? 1 : 0;
    this.refreshData();
  }
  clickCovered(group, checkbox){
    this.filters[group][0] = !$('#' + checkbox).prop('checked') ? 1 : 0;
    this.refreshData();
    return true;
  }
  clickRadio(group, value, chkbox) {
    this.filters[group] = [value];
    this.refreshData();
  }


  loadPOIs() {
    //console.log(this.filters);
    this.appState.listingsHub.invoke('GetPOIs').done((data) => {
      console.log('Finished calling GetPOIs, result size was ', data.length);
      this.POIs = JSON.parse(data);
    }).fail((data) => {
      console.log('Failed calling GetPOIs');
    });
  }

  refreshData() {
    console.log('filters---------', this.filters);
    this.appState.listingsHub.invoke('GetListings', this.filters, 'HARDCODEDTOKENIGOTFROMAUTHPLUGIN').done((data) => {
      console.log('Finished calling GetListings, result size was ', data.length);
      this.listings = JSON.parse(data);
      console.log('listings---------------', this.listings);
      let haveNeighbourhood = true;
      let haveSNeighbourhood = true;
      for (let i = 0; i < this.listings.length; i++) {

        if (this.listings[i]["PrimaryImage"].length > 0) {
          this.listings[i]["PrimaryImage"] = "http://www.realtoranalytics.com/ImgSrv/Listings/" + this.listings[i]["MLSNumber"].substring(this.listings[i]["MLSNumber"].length - 2) + "/" + this.listings[i]["MLSNumber"] + "/" + this.listings[i]["PrimaryImage"]
        } else {
          this.listings[i]["PrimaryImage"] = "http://www.realtoranalytics.com/ImgSrv/Listings/00.png";
        }
        if (numeral(this.listings[i]["FrequentTransitScanned"]) > 0)
          this.listings[i]["FrequentTransitCSS"] = "";
        else
          this.listings[i]["FrequentTransitCSS"] = "DISPLAYNONE";

        // Price for Sold Properties
        if (this.listings[i]["ST"] == "S")
          this.listings[i]["ListingPrice"] = this.listings[i]["SellingPrice"];


        if ((this.listings[i]["UrbanVillageCurrent"] == "") || (this.listings[i]["UrbanVillageCurrent"] == "N/A") || (this.listings[i]["City"] != "Seattle"))
          this.listings[i]["UrbanVillageCSS"] = "DISPLAYNONE";
        else
          this.listings[i]["UrbanVillageCSS"] = "";

        if (("N/A" == this.listings[i]["ZoningFuture"]) || ("" == this.listings[i]["ZoningFuture"]))
          this.listings[i]["ZoningFutureCSS"] = "DISPLAYNONE";
        else
          this.listings[i]["ZoningFutureCSS"] = "";

        if ((this.listings[i]["UrbanVillageFuture"] == "N/A") || (this.listings[i]["UrbanVillageFuture"] == "") || (this.listings[i]["UrbanVillageCurrent"] == this.listings[i]["UrbanVillageFuture"]))
          this.listings[i]["UrbanVillageFutureCSS"] = "DISPLAYNONE";
        else
          this.listings[i]["UrbanVillageFutureCSS"] = "";
        if ((this.listings[i]["Neighbourhood"] == "N/A") || (this.listings[i]["Neighbourhood"] == "NO BROADER TERM") || (this.listings[i]["Neighbourhood"] == "") || (this.listings[i]["Neighbourhood"] == this.listings[i]["SNeighbourhood"]))
          haveNeighbourhood = false;
        else {
          let haveNeighbourhood = true;
          this.listings[i]["Neighbourhood"] = this.titleCase(this.listings[i]["Neighbourhood"]);
        }
        if ((this.listings[i]["SNeighbourhood"] == "N/A") || (this.listings[i]["SNeighbourhood"] == "NO BROADER TERM") || (this.listings[i]["Neighbourhood"] == ""))
          haveSNeighbourhood = false;
        else {
          let haveSNeighbourhood = true;
          this.listings[i]["SNeighbourhood"] = this.titleCase(this.listings[i]["SNeighbourhood"]);
        }
        if ((this.listings[i]["PresentUseGroup"] != "MF") || (this.listings[i]["CAP"] == "0.00") || (this.listings[i]["CAP"] == ""))
          this.listings[i]["CAPTEXT"] = "";
        else {
          this.listings[i]["CAPTEXT"] = "CAP " + this.listings[i]["CAP"] + "%";
        }


        if (haveNeighbourhood && haveSNeighbourhood)
          this.listings[i]["NeighbourhoodUnited"] = this.listings[i]["Neighbourhood"] + " / " + this.listings[i]["SNeighbourhood"];
        else if (haveNeighbourhood)
          this.listings[i]["NeighbourhoodUnited"] = this.listings[i]["Neighbourhood"];
        else if (haveSNeighbourhood)
          this.listings[i]["NeighbourhoodUnited"] = this.listings[i]["SNeighbourhood"];
        else
          this.listings[i]["NeighbourhoodUnited"] = "";
        //this.listings[i]["NeighbourhoodUnited"] = camelize(this.listings[i]["NeighbourhoodUnited"]);
        if (this.listings[i]["NeighbourhoodUnited"].length > 32)
          this.listings[i]["NeighbourhoodUnited"] = this.listings[i]["NeighbourhoodUnited"].substring(0, 32) + "...";

      }
      this.mapMarkers = this.createMarkers(this.listings);

    }).fail((data) => {
      console.log('Failed calling GetListings');
    });
  }


  // ---------------------------------------------------------------------------------
  // Map click event
  // ---------------------------------------------------------------------------------

  onClickMap(event) {
    //let latLng = event.detail.latLng,
    //    lat = latLng.lat(),
    //    lng = latLng.lng();
      
      console.log("A onClickMap "+event);
    //console.log(lat+':'+lng);
    
  }
  onClickMarker(event) {
      console.log("B onClickMarker "+event);
  //   console.log('mapdata-----',event);
  //   this.clickRow('', event['custom']['id'], '');
  //   let dif = $('#listingsTableDiv').offset().top - $('#listingsTableID').offset().top + $('#listingsTableRow_' + response['custom']['id']).position().top - 18;
  //   $('#listingsTableDiv').animate({
  //     scrollTop: dif
  //   }, 400);
   }



  titleCase(str) {
    str = str.replace("/", " ");
    str = str.replace("//", " ");
    str = str.replace("\/", " ");
    str = str.replace("  ", " ");
    str = str.replace("  ", " ");
    let words = str.toLowerCase().split(' ');
    for (let i = 0; i < words.length; i++) {
      let letters = words[i].split('');
      letters[0] = letters[0].toUpperCase();
      words[i] = letters.join('');
    }
    return words.join(' ');
  }


  changePriceRange(event) {
    //console.log('A');
    //console.log(this.filters.MinPrice[0]);
  }

  changeLotRange(event) {
    //console.log('A');
    //console.log(this.filters.MinPrice[0]);
  }


  createMarkers(listingsArray) {
    let markersArray = [];
    for (let i in listingsArray) {
      let markerTitle = "";
      if (isNaN(listingsArray[i]["ListingPrice"])) {
        markerTitle = listingsArray[i]["FullAddress"]
      } else {
        markerTitle = listingsArray[i]["FullAddress"] + ' ' + numeral(listingsArray[i]["ListingPrice"]).format('($0,0)');
      }

      let iconimg = 'img/Markers/' + listingsArray[i]["ListingStatus"] + '/'
      if (listingsArray[i]["PresentUseGroup"] != "")
        iconimg = iconimg + listingsArray[i]["PresentUseGroup"] + ".png";
      else
        iconimg = iconimg + "null.png";

      //let iconimg = 'img/Markers/'+listingsArray[i]["ListingStatus"]+'/'+listingsArray[i]["PresentUseGroup"]+".png";
      iconimg = 'img/Markers/Temp/Marker' + listingsArray[i]["ListingStatus"] + '.png'
      //iconimg = 'img/Markers/Temp/b1g4.png'

      let _fontWeight = "normal";
      let _fontSize = "12px";
      let _fontcolor = "#555555";

      if (this.currentSelectedId == listingsArray[i]["ListingID"]) {
        _fontWeight = "bold";
        _fontSize = "12px";
        _fontcolor = "#000000";
      }

      let row = {
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
        content: `
                <div id="content">    

                   <img src="` + listingsArray[i]["ListingImage"] + `" width="240">
                     <br>
                    <a href="../REPM/PropertySearch.aspx?Address=` + listingsArray[i]["FullAddress"] + `" target="_ps">` + listingsArray[i]["FullAddress"] + `</a>
                      <a href="` + listingsArray[i]["URL"] + `" target="_rf"><h3 id="firstHeading" class="firstHeading">` + numeral(listingsArray[i]["ListingPrice"]).format("$(0,0)") + `</h3></a>


                     <h5 id="secondHeading" class="firstHeading">` + listingsArray[i]["ListingBeds"] + `<small>Bed</small> | ` + listingsArray[i]["ListingBaths"] + `<small>Bath</small> | ` + listingsArray[i]["ListingSqft"] + `<small>sf</small> | ` + listingsArray[i]["SqFtLot"] + `<small>sf</small> ` + listingsArray[i]["CurrentZoning"] + `` + `</h1>
 
                    <div id="textcontent" class="col-sm-12">
                      

                  </div>
                </div>`
      };

      markersArray.push(row);

    }
    //console.log(markersArray);
    return markersArray;
  }

  // ---------------------------------------------------------------------------------
  // Row click event
  // ---------------------------------------------------------------------------------

  clickRow(event, id, address, _longitude, _latitude) {
    this.currentSelectedId = id;
    $(".listingsTableRow").removeClass("info");
    $("#listingsTableRow_" + id).addClass("info");
    this.currentAddress = address;
    // this.longitude = _longitude;
    // this.latitude = _latitude;
    this.mapMarkers = this.createMarkers(this.listings);
    //console.log(this.mapMarkers[this.lookupIndexById(this.mapMarkers,id)].icon);
    //this.mapMarkers[this.lookupIndexById(this.mapMarkers,id)].icon+="XX";
    //this.mapMarkers.splice(this.lookupIndexById(this.mapMarkers,id),1);
  }

  // ---------------------------------------------------------------------------------
  // Sort event
  // ---------------------------------------------------------------------------------
  changeSort(sortByColumn) {
    if (sortByColumn == this.sortColumn) {
      if (this.sortOrder == 'ascending')
        this.sortOrder = 'descending'
      else
        this.sortOrder = 'ascending';
    } else
      this.sortOrder = 'dscending';
    this.sortColumn = sortByColumn;
  }
  

  // ---------------------------------------------------------------------------------
  // POI Change event
  // ---------------------------------------------------------------------------------
  POIchanged() {
    this.filters['POI'] = [];
    let poiid = $('select[name=POIsSelect]').val();
    //console.log(poiid);

    let maxTime = $('select[name=POIsMaxTime]').val();
    let _map = this.GoogleMap.map;

    for (let i = 0; i < poiid.length; i++)
      this.filters['POI'].push(poiid[i]);

    //this.filters['POI']=[poiid];
    this.filters['POIMaxDriveTime'] = [maxTime];

    if ((poiid == "") || (poiid.length == 0) || (poiid[0] == "")) {
      //console.log("no poiid");
      this.refreshData();
      this.transitLayer.forEach((feature) => {
        this.transitLayer.remove(feature);
      });
      this.zoningLayer.setMap(this.GoogleMap.map);
      this.uvLayer.setMap(this.GoogleMap.map);
      this.CurrentuvLayer.setMap(this.GoogleMap.map);
      this.transitLayer.setMap(null);
    } else {


      this.zoningLayer.setMap(null);
      this.uvLayer.setMap(null);
      this.CurrentuvLayer.setMap(null);
      this.transitLayer.setMap(this.GoogleMap.map);
      this.transitLayer.forEach((feature) => {
        this.transitLayer.remove(feature);
      });
      let iCounter = 0;
      let iMax = poiid.length - 1;
      for (let i = 0; i <= iMax; i++) {
        let url = "/FrontEnd/GIS/GetJSON.aspx?poiID=" + poiid[i] + "&poiTransitType=car&poiMaxValue=" + maxTime
        //console.log(url);

        let promise = $.getJSON(url); //same as map.data.loadGeoJson();
        promise.then((data) => {
          //console.log(data);

          this.transitLayer.addGeoJson(data);


          if (iCounter == iMax) {
            let bounds = new google.maps.LatLngBounds();
            this.transitLayer.forEach((feature) => {
              feature.getGeometry().forEachLatLng((latlng) => {
                bounds.extend(latlng);
              });
            });
            console.log(bounds);
            this.GoogleMap.map.fitBounds(bounds);
          }
          iCounter++;
        });
      }
    }



  }

  lookupIndexById(markerArray, Id) {
    for (let row = 0; row < markerArray.length; row++) {

      if (markerArray[row].custom.id == Id) {
        return row;
      }
    }
    return -1;
  }

  formatKMB(value) {
    let str = "";
    let num = Number(value);
    let numlength = ("" + num).length;

    if (num >= 1000000) {
      let n1 = Math.round(num / Math.pow(10, numlength - 3));
      let d1 = n1 / Math.pow(10, 9 - numlength);
      str = (d1 + "M");
    } else
    if (num >= 1000) {
      let n1 = Math.round(num / Math.pow(10, numlength - 3));
      let d1 = n1 / Math.pow(10, 6 - numlength);
      str = (d1 + "K");
    } else
      str = num;
    return ("$" + str);
  }

  setHouseType() {
    console.log('event%%%%%%%%%%');
  }
  

}
