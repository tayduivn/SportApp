import {Component, Input, OnInit} from '@angular/core';
import {Activity} from '../../models/activity';
import {ModalController} from '@ionic/angular';
import {FormBuilder, Validators} from '@angular/forms';
import {Sport} from '../../models/sport';
import {DataService} from '../../data/data.service';
import {ActivityService} from '../../services/activity.service';
import {AuthService} from '../../auth/auth.service';

@Component({
    selector: 'app-activity-detail',
    templateUrl: './activity-detail.component.html',
    styleUrls: ['./activity-detail.component.scss'],
})
export class ActivityDetailComponent implements OnInit {
    @Input() selectedActivity: Activity;
    @Input() bookable: boolean;
    sportOptions: Sport[] = [];

    activityForm = this.fb.group({
        peopleCount: ['', Validators.required],
        place: ['', Validators.required],
        topActivity: [false],
        date: ['', Validators.required],
        sport: this.fb.group({
            sportType: ['', Validators.required],
        }),
    });

    constructor(
        private modalController: ModalController,
        private fb: FormBuilder,
        private activityService: ActivityService,
        private dataService: DataService,
        private authService: AuthService,
    ) {
    }

    ngOnInit() {
        this.sportOptions = this.dataService.getSportsSk();
        this.assignValueToForm();

        console.log(this.selectedActivity);
        console.log(this.activityForm.value);

        if (this.bookable) {
            this.activityForm.disable();
        }
        else {
            this.activityForm.enable()
        }
    }

    onCancel() {
        this.modalController.dismiss({message: 'ActivityDetail closed'}, 'cancel');
    }

    assignValueToForm() {
        this.activityForm.get('peopleCount').patchValue(this.selectedActivity.peopleCount);
        this.activityForm.get('place').patchValue(this.selectedActivity.place);
        this.activityForm.get('topActivity').patchValue(this.selectedActivity.topActivity);
        this.activityForm.get('date').patchValue(this.selectedActivity.date.toISOString());
        this.activityForm.get('sport.sportType').setValue(this.selectedActivity.sport.value, {onlySelf: true});

        this.activityForm.updateValueAndValidity();
    }

    onFormSubmit() {
        this.activityService.addActivity(this.assignValueToActivity());
        this.modalController.dismiss({message: 'Add new activity!'}, 'add');
    }

    assignValueToActivity(): Activity {
        return{
            id: this.activityService.allActivitiesCount + 1,
            sport: {
                label: this.dataService.getSportNameByValue(this.activityForm.get('sport.sportType').value),
                value: this.activityForm.get('sport.sportType').value,
                tag: 1,
                userId: this.authService.userIdAuth
            },
            topActivity: this.activityForm.get('topActivity').value,
            place: this.activityForm.get('place').value,
            peopleCount: this.activityForm.get('peopleCount').value,
            date: this.activityForm.get('date').value
        };
    }
}
