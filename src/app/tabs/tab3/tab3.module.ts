import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Tab3Page} from './tab3.page';
import {ActivityListComponent} from '../../components/activity-list/activity-list.component';
import {SharedModule} from '../../modules/shared/shared.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: Tab3Page}]),
        SharedModule,
    ],
    declarations: [
        Tab3Page,
    ]
})
export class Tab3PageModule {
}
