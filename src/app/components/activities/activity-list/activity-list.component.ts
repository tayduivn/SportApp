import {Component, Input, OnInit} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Activity} from '../../../models/activity';
import {ModalController, ToastController} from '@ionic/angular';
import {ActivityDetailComponent} from '../activity-detail/activity-detail.component';
import {Sport} from '../../../models/sport';
import {DataService} from '../../../data/data.service';
import {AuthService} from '../../../auth/auth.service';
import * as firebase from "firebase";

@Component({
    selector: 'app-activity-list',
    templateUrl: './activity-list.component.html',
    styleUrls: ['./activity-list.component.scss'],
})
export class ActivityListComponent implements OnInit {

    @Input() filteredList: Activity[];
    sportOptions: Sport[] = [];
    user: any = {};
    constructor(
        private activityService: ActivityService,
        private modalController: ModalController,
        private toastController: ToastController,
        private dataService: DataService,
    ) {
    }

    ngOnInit() {
        this.user = this.dataService.getSignInUser();
        console.log("som v liste, lol");
    }

    onActivityClicked(id: string) {
        console.log("Klikol som na aktivitu" + id);
        this.user= this.dataService.getSignInUser();
        var logged= this.dataService.getSignInUser();
        if (this.dataService.logged != false) {
            this.modalController
                .create({
                    component: ActivityDetailComponent,
                    componentProps: {
                        selectedActivity: this.activityService.getActivityById(id),
                        bookable: !(this.activityService.getActivityById(id).createdBy === this.user.user.uid),
                        reserved: (this.activityService.getActivityById(id).bookedBy.find(function (prihlaseny) {
                            return prihlaseny.includes(logged.user.uid)

                        })),
                        overdue: (new Date(this.activityService.getActivityById(id).date).getTime() < new Date().getTime()),
                        unSigned: (this.user.user.uid == 0)
                    }
                })
                .then(modalEl => {
                    modalEl.present();
                    return modalEl.onDidDismiss();
                })
                .then(result => {
                    console.log(result);
                });
        }else {
            this.modalController
                .create({
                    component: ActivityDetailComponent,
                    componentProps: {
                        selectedActivity: this.activityService.getActivityById(id),
                        bookable: !(this.activityService.getActivityById(id).createdBy === "guest"),
                        reserved: (this.activityService.getActivityById(id).bookedBy.find(function (prihlaseny) {
                            return prihlaseny.includes("guest")

                        })),
                        overdue: (new Date(this.activityService.getActivityById(id).date).getTime() < new Date().getTime()),
                        unSigned: (this.dataService.logged == false)
                    }
                })
                .then(modalEl => {
                    modalEl.present();
                    return modalEl.onDidDismiss();
                })
                .then(result => {
                    console.log(result);
                });
        }
    }



    getCssClass(activity: Activity) {
        return "item-content " + this.dataService.getSportIconByValue(activity.sport);
    }
}