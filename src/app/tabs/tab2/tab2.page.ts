import {AfterContentInit, AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';

import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Cluster, OSM, Vector as VectorSource} from 'ol/source';
import {fromLonLat} from 'ol/proj';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import BingMaps from 'ol/source/BingMaps';
import {ToastController} from '@ionic/angular';
import Circle from 'ol/geom/Circle';
import 'ol/ol.css';
import Overlay from 'ol/Overlay';

import {ActivityService} from "../../services/activity.service";
import {Activity} from "../../models/activity";
import {ActivityDetailComponent} from "../../components/activities/activity-detail/activity-detail.component";
import {ModalController} from '@ionic/angular';
import {AuthService} from "../../auth/auth.service";
import {Router} from '@angular/router';
import {DataService} from 'src/app/data/data.service';
import {Circle as CircleStyle, Fill, Stroke, Style, Text, Icon} from 'ol/style';
import {forEach} from "@angular-devkit/schematics";
import {isBoolean} from "util";
import {ActivityRatingComponent} from "../../components/activities/activity-rating/activity-rating.component";
import {ActivityListComponent} from "../../components/activities/activity-list/activity-list.component";
import {EventService} from "../../services/event.service";


declare var ol: any;
// tslint:disable-next-line:prefer-const

declare var vectorSource;
declare var markerVectorLayer;
let markiza;
let sportName = 'futbal';
let pomocVpoliPriMarkeroch = false;
let nenasliSaRovnakeMarke = false;
const mapLat = -33.829357;
const mapLng = 150.961761;
const mapDefaultZoom = 10;
const positionFeature = new Feature();
const washingtonLonLat = [21.23408, 48.69809];
const washingtonWebMercator = fromLonLat(washingtonLonLat);
let a1;
let b1;
let pocet;
let markre: [];

const pomoc: number[] = []; // do pola zapisem hodnoty ktore sa rovnaju, a potom na konci ich budem kontrolovat ci uz nahodou neboli pridane
let rovnaky = false;
let k = 0;
const markresEvent = [];
pocet = 0;
declare var $: any;
var idDoButtonu = [];
var idDoButtonuEvent = [];
const popup2 = new Overlay({
    element: document.getElementById('popup')
});

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']

})
export class Tab2Page implements OnInit, AfterViewInit {

    map: Map;
    user: any = {};
    featureName: any = {};
    image: any = '';
    private win: any = window;
    activityList: Activity[];
    result: any = [[]];
    clustre;

    vectorLayer;

    vectorSourceMarkrov;

    clusterSource;

    activityAndMarkers;

    markresActiviti = [];
    markresEvents = [];
    // // @ts-ignore
    // @ViewChild('mapElement') mapElement;

    constructor(
        private router: Router,
        private authService: AuthService,
        private activityService: ActivityService,
        private eventService: EventService,
        private modalController: ModalController,
        private geolocation: Geolocation,
        public toastController: ToastController,
        private dataService: DataService
    ) {
    }

    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 5000
        });
        toast.present();
    }

    ngAfterViewInit(): void {
        var mapa = document.getElementById('map');
        mapa.setAttribute("style","touch-action: none");
        this.map = new Map({
            layers: [
                new TileLayer({
                    source: new OSM()
                })],
            target: mapa,

            view: new View({
                center: [0, 0],
                zoom: 8
            })
        });
        if (document.getElementById('popover')!=null)
        document.getElementById('popover').style.background = 'blue';
        const popup = new Overlay({
            element: document.getElementById('popup'),
            positioning: 'bottom-center',
            stopEvent: false,
            offset: [0, -50],
        });



        this.map.addOverlay(popup);

        // tslint:disable-next-line:only-arrow-functions
        var totaMapa = this.map;
        this.map.on('click', function (evt) {
            $(document.getElementById('popup')).popover('destroy');
            document.getElementById('testButton').style.display = "none";
            document.getElementById('testButton3').style.display = "none";
            idDoButtonu = [];
            const feature = totaMapa.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                var features = feature.get('features');
                if (features.length == 1) { // jedna aktivita
                    return features[0];
                }
                if (features.length > 1) { // viacej aktivit pod klastrom
                    return features;
                }
                return feature;
            });



            if (feature) {
                idDoButtonu = [];
                idDoButtonuEvent = [];

                if (feature.length >= 2) {
                    var coordinates = feature[0].getGeometry().getCoordinates();
                    popup.setPosition(coordinates);

                    var vsetkyRovnake = feature[0].values_.zdroj;
                    for (var i = 0; i < feature.length; i++) { // rozdelujem idcka podla zdroja ... aktivitu do id buttona  a event do iddobutttonaevent... necakane
                        if (vsetkyRovnake != feature[i].values_.zdroj) { //ak sa nahodou nejaka nebude rovnat 1. prvu nastavi  sa na false
                            vsetkyRovnake = false;
                        }
                        if (feature[i].values_.zdroj == "aktivita") {
                            try {
                                idDoButtonu.push(feature[i].get('id'))
                            } catch (error) {
                                console.error(error);
                                // idDoButtonu = [];
                            }
                        }
                        if (feature[i].values_.zdroj == "event") {
                            try {
                                idDoButtonuEvent.push(feature[i].get('id'))
                            } catch (error) {
                                console.error(error);
                                // idDoButtonuEvent = [];
                            }
                        }
                    }

                    if (vsetkyRovnake && feature[0].values_.zdroj == "aktivita") {
                        $(document.getElementById('popup')).popover({
                            placement: 'top',
                            html: true,
                            content: "Viacero športov",
                            animation: false,
                        });
                        var rect = document.getElementById('popup').getBoundingClientRect();

                        document.getElementById('testButton').style.display = "block";
                        document.getElementById('testButton').style.position = "absolute";
                        document.getElementById('testButton').style.top = rect.top - 55 + "px";
                        document.getElementById('testButton').style.left = rect.left - 40 + "px";
                    }
                    if (vsetkyRovnake && feature[0].values_.zdroj == "event") {
                        $(document.getElementById('popup')).popover({
                            placement: 'top',
                            html: true,
                            content: "Viacero eventov",
                            animation: false,
                        });
                        var rect = document.getElementById('popup').getBoundingClientRect();
                        document.getElementById('testButton3').style.display = "block";
                        document.getElementById('testButton3').style.position = "absolute";
                        document.getElementById('testButton3').style.top = rect.top - 55 + "px";
                        document.getElementById('testButton3').style.left = rect.left - 40 + "px";
                    }
                    if (!vsetkyRovnake) {
                        $(document.getElementById('popup')).popover({
                            placement: 'top',
                            html: true,
                            content: "Športy a aktivity",
                            animation: false,
                        });
                        var rect = document.getElementById('popup').getBoundingClientRect();
                        console.log("toto je voncooo");

                        document.getElementById('testButton').style.display = "block";
                        document.getElementById('testButton').style.position = "absolute";
                        document.getElementById('testButton').style.top = rect.top - 55 + "px";
                        document.getElementById('testButton').style.left = rect.left - 88 + "px";


                        document.getElementById('testButton3').style.display = "block";
                        document.getElementById('testButton3').style.position = "absolute";
                        document.getElementById('testButton3').style.top = rect.top - 55 + "px";
                        document.getElementById('testButton3').style.left = rect.left - 1 + "px";
                    }


                } else {
                    var coordinates = feature.getGeometry().getCoordinates();
                    popup.setPosition(coordinates);
                    // this.featureName = feature.get('name');
                    $(document.getElementById('popup')).popover({
                        placement: 'top',
                        html: true,
                        title: feature.get('name'),
                        animation: false,
                        // content: ['<div style="background: #0ec254" class="place">'+feature.get('place')+'</div>',
                        //     '<div class="people">'+ feature.get('peopleCount')+'</div>',
                        //     ].join(''),

                        content: feature.get('place') + `<br>`+ feature.get('peopleCount'), //bu takto ,alebo tak ako to je dole to nastylovat
                        // content: ['<div class="popover-header">pro</div>',
                        //     '<div class="popover-body">pro1</div>',
                        //     ].join(''),
                        //
                        template: 	'<div class="popover" role="tooltip">' +
                            '<div style="color: #0ec254" class="popover-title"></div>' + //neche to stylovaty :{
                            '<div style="background: #0ec254" class="popover-content"></div>' +
                            '</div>'
                    });
                    idDoButtonu = feature.get('id');
                    idDoButtonuEvent = feature.get('id');
                    var rect = document.getElementById('popup').getBoundingClientRect();
                    if (feature.values_.zdroj == "aktivita") {
                        document.getElementById('testButton').style.display = "block";
                        document.getElementById('testButton').style.position = "absolute";
                        document.getElementById('testButton').style.top = rect.top - 55 + "px";
                        document.getElementById('testButton').style.left = rect.left - 40 + "px";
                    }
                    else if (feature.values_.zdroj == "event") {
                        document.getElementById('testButton3').style.display = "block";
                        document.getElementById('testButton3').style.position = "absolute";
                        document.getElementById('testButton3').style.top = rect.top - 55 + "px";
                        document.getElementById('testButton3').style.left = rect.left - 40 + "px";
                    } else {
                        console.error("mame nieco ine ako event/aktrivita?")
                    }
                }

                $(document.getElementById('popup')).popover('show');


            } else {
                idDoButtonu = [];
                idDoButtonuEvent = [];
                $(document.getElementById('popup')).popover('destroy');
                document.getElementById('testButton').style.display = "none";
                document.getElementById('testButton3').style.display = "none";
            }
        });

        this.map.on('pointermove',  (e) => {
                idDoButtonu = [];
                idDoButtonuEvent = [];
                $(document.getElementById('popup')).popover('destroy');
                document.getElementById('testButton').style.display = "none";
                document.getElementById('testButton3').style.display = "none";

            const pixel = this.map.getEventPixel(e.originalEvent);
            const hit = this.map.hasFeatureAtPixel(pixel);
            this.map.getTarget().style.cursor = hit ? 'pointer' : '';
        });
        setTimeout(() => {
            this.map.updateSize();
        }, 500);

        this.skuskaAsync();
        if (a1 == null) {
            this.locate();
        } else {
        }

    }

    ionViewDidEnter(){
        setTimeout(() => {
            this.map.updateSize();
        }, 500);
    }

    prejdiDoTab1() {
        this.dataService.idZMapy = idDoButtonu;
        $(document.getElementById('popup')).popover('destroy');
        document.getElementById('testButton').style.display = "none";
        document.getElementById('testButton3').style.display = "none";
        idDoButtonu = [];
        idDoButtonuEvent = [];
        this.filteredActivitiesList(this.dataService.getIdZMapy(),true); //true aktivity
    }

    prejdiDoTab3() {
        this.dataService.idEventZMapy = idDoButtonuEvent;
        $(document.getElementById('popup')).popover('destroy');
        document.getElementById('testButton').style.display = "none";
        document.getElementById('testButton3').style.display = "none";
        idDoButtonu = [];
        idDoButtonuEvent = [];
        this.filteredActivitiesList(this.dataService.getidEventZMapy(), false); //false eventy
    }

   async pridanieMarkerov(activiti, events) {
       var actualDate = new Date()
        if (events != null) {
            const resEvent = Array.from(Object.values(events), //eventy
                ({lattitude, longtitude, sport, id, peopleCount,place, date}) =>
                    [parseFloat(longtitude), parseFloat(lattitude), sport, id,peopleCount,place, date]);

                        for (let o = 0; o < resEvent.length; o++) {
                            if (resEvent[o][6] > actualDate.getTime()) {
                                if (resEvent[o][5].toString().length > 12) {
                                    resEvent[o][5] = resEvent[o][5].toString().substring(0, 12) + "..."
                                }
                                markiza = new Feature({
                                    geometry: new Point(fromLonLat([resEvent[o][0], resEvent[o][1]])),
                                    name: this.dataService.getSportNameByValue(Number(resEvent[o][2])),
                                    id: resEvent[o][3],
                                    zdroj: 'event',
                                    place: resEvent[o][5],
                                    peopleCount: resEvent[o][4]
                                });
                                this.markresEvents.push(markiza);
                            }
                        }
        }

       if (activiti != null){
            const res = Array.from(Object.values(activiti), //aktivity
            ({lattitude, longtitude, sport, id, peopleCount,place, date}) =>
                [parseFloat(longtitude), parseFloat(lattitude), sport, id,peopleCount,place, date]);

                    for (let o = 0; o < res.length; o++) {
                        if (res[o][6] > actualDate.getTime()) {
                            if (res[o][5].toString().length > 12) {
                                res[o][5] = res[o][5].toString().substring(0, 12) + "..."
                            }
                            markiza = new Feature({
                                geometry: new Point(fromLonLat([res[o][0], res[o][1]])),
                                name: this.dataService.getSportNameByValue(Number(res[o][2])),
                                id: res[o][3],
                                zdroj: 'aktivita',
                                place: res[o][5],
                                peopleCount: res[o][4]
                            });
                            this.markresActiviti.push(markiza);
                        }
                    }
        }

       this.activityAndMarkers = this.markresEvents.concat(this.markresActiviti);

       this.vectorSourceMarkrov = new VectorSource({
           features: this.activityAndMarkers
       })
    }

    skuskaAsync(){
        this.activityService.activities$.subscribe(aktivity => {
            this.markresActiviti = [];
            this.pridanieMarkerov(aktivity, null).then((value) => this.createClusters())
        });

        this.eventService.activities$.subscribe(events => {
            this.markresEvents = [];
            this.pridanieMarkerov(null, events).then((value) => this.createClusters())
        })
    }

    createClusters(){
        if (this.clusterSource != undefined)
        this.clusterSource.clear();
        this.clusterSource = new Cluster({
            distance: parseInt("20", 10),
            source: this.vectorSourceMarkrov
        });


        var styleCache = {};
        if (this.clustre != undefined && this.map != undefined){
        }

        if (this.clustre != undefined){
            this.map.removeLayer(this.clustre);
        }

        this.clustre = new VectorLayer({
            source: this.clusterSource,
            style: function (feature) {
                var size = feature.get('features').length;
                var style = styleCache[size];
                var coordinates = feature.getGeometry().getCoordinates();
                var vsetkyRovnake = true;
                if (feature.get('features').length > 1) {
                    var prvy = feature.values_.features[0].values_.zdroj;
                    for (var i = 1; i < feature.get('features').length; i++) {
                        if (prvy != feature.values_.features[i].values_.zdroj) {
                            vsetkyRovnake = false;
                            break
                        }
                    }
                }

                if (vsetkyRovnake == true) { //ked su v klastri len eventy/aktivity
                    if (!style && feature.values_.features[0].values_.zdroj == 'aktivita') {
                        style = new Style({
                            image: new CircleStyle({
                                radius: 10,
                                stroke: new Stroke({
                                    color: '#fff'
                                }),
                                fill: new Fill({
                                    color: '#0000FF'
                                })
                            }),
                            text: new Text({
                                text: size.toString(),
                                fill: new Fill({
                                    color: '#fff'
                                })
                            })
                        });
                    }
                    if (!style && feature.values_.features[0].values_.zdroj == 'event') {
                        style = new Style({
                            image: new CircleStyle({
                                radius: 10,
                                stroke: new Stroke({
                                    color: '#fff'
                                }),
                                fill: new Fill({
                                    color: '#6D0DAF'
                                })
                            }),
                            text: new Text({
                                text: size.toString(),
                                fill: new Fill({
                                    color: '#fff'
                                })
                            })
                        });
                    }
                    return style;
                } else { // ked je v klastri aj aktivita aj event
                    if (!style) {
                        style = new Style({
                            image: new Icon({
                                color: '#8959A8',
                                crossOrigin: 'anonymous',
                                src: 'assets/sports/multisport.png',
                                scale: 0.03

                            }),
                            text: new Text({
                                text: size.toString(),
                                fill: new Fill({
                                    color: '#fff'
                                })
                            })
                        });
                    }
                    return style;
                }
            }
        });

        this.map.addLayer(this.clustre);
    }

    locate() {
        this.geolocation.getCurrentPosition().then((resp) => {
            a1 = resp.coords.latitude;
            b1 = resp.coords.longitude;
            this.map.getView().setCenter(fromLonLat([b1, a1]));
        }).catch((error) => {
            console.log('Error getting location', error);
        });
    }



    ngOnInit() {
        this.user = this.dataService.getSignInUser();
    }
    filteredActivitiesList(activitiesId, aktivityChcem){
        this.modalController
            .create({component: ActivityListComponent,
                componentProps:{
                    idSportsFromMap: activitiesId,
                    fromMap: true,
                    aktivita: aktivityChcem,
                    fromEvent: !aktivityChcem
                }

            })
            .then(modalEl => {
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then(result => {

            });
    }
}
