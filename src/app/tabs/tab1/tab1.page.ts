import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MenuController, ModalController, ToastController} from '@ionic/angular';
import {ActivityNewComponent} from '../../components/activity-new/activity-new.component';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

    // @ts-ignore
    GoogleAutocomplete: google.maps.places.AutocompleteService;
    autocomplete: { input: string; };
    autocompleteItems: any[];
    location: any;
    placeid: any;

    constructor(
        public zone: NgZone,
        private fb: FormBuilder,
        private modalController: ModalController,
        private toastController: ToastController,
    ) {
        // @ts-ignore
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = {input: ''};
        this.autocompleteItems = [];
    }

    ngOnInit() {
    }

    presentModal() {
        this.modalController
            .create({component: ActivityNewComponent})
            .then(modalEl => {
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then(result => {
                console.log(result);
                if (result.role !== 'cancel') {
                    this.presentToast();
                }
            });
    }
    async presentToast() {
        const toast = await this.toastController.create({
            message: 'Aktivita bola úspešne pridaná.',
            duration: 2000,
            color: 'medium'
        });
        toast.present();
    }









    // private objekt: any;

    // updateSearchResults() {
    //     if (this.autocomplete.input === '') {
    //         this.autocompleteItems = [];
    //         return;
    //     }
    //     this.GoogleAutocomplete.getPlacePredictions({input: this.autocomplete.input},
    //         (predictions, status) => {
    //             this.autocompleteItems = [];
    //             this.zone.run(() => {
    //                 predictions.forEach((prediction) => {
    //                     this.autocompleteItems.push(prediction);
    //                 });
    //             });
    //         });
    // }
    //
    // selectSearchResult(item) {
    //     console.log('ja som item' + item);
    //     this.location = item;
    //     this.placeid = this.location.place_id;
    //     JSON.stringify(item);   // tu potrebujem priradit vyber mesta po kliknuti, v iteme je object a ja potrebujem item.description
    //     this.autocomplete.input = JSON.stringify(item, ['description']);
    //     this.objekt = JSON.parse(this.autocomplete.input);
    //     this.autocomplete.input = this.objekt.description;
    //     for (let i = 0; i < 6; i++) {
    //         this.autocompleteItems.pop();
    //     }
    // }
}
