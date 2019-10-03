import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IonImg} from '@ionic/angular';
import {LanguageService} from '../../services/language.service';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  // @ts-ignore
  @ViewChild('sk') sk: ElementRef;
  // @ts-ignore
  @ViewChild('en') en: ElementRef;
  constructor(
      private languageService: LanguageService,
      private storage: Storage
  ) { }

  ngOnInit() {
    this.storage.get(this.languageService.getLangKey).then(lang => {
      if (lang === 'sk') {
        this.sk.nativeElement.className = 'active';
        this.en.nativeElement.className = 'none';
      }
      else if (lang === 'en') {
        this.sk.nativeElement.className = 'none';
        this.en.nativeElement.className = 'active';
      }
      else {
        this.sk.nativeElement.className = 'active';
        this.en.nativeElement.className = 'none';
        this.languageService.setLanguage('sk');
      }
    })
  }

  onLogout() {
    console.log("Logout");
  }

  onLanguageIconClicked(lang: String) {
    if (lang === 'sk') {
      this.sk.nativeElement.className = 'active';
      this.en.nativeElement.className = 'none';
      this.languageService.setLanguage('sk');
    }
    else {
      this.sk.nativeElement.className = 'none';
      this.en.nativeElement.className = 'active';
      this.languageService.setLanguage('en');
    }
  }
}