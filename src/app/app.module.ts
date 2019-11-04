import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy, ToastController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import { FilePath } from '@ionic-native/file-path/ngx';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MenuComponent} from './components/menu/menu.component';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {IonicStorageModule} from '@ionic/storage';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoder} from '@ionic-native/native-geocoder/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';


export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
    declarations: [AppComponent, MenuComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })

    ],
    providers: [
        Geolocation,
        NativeGeocoder,
        StatusBar,
        SplashScreen,
        WebView,
        FilePath,
        ToastController,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
