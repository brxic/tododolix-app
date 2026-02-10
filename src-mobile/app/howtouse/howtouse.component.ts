import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppLanguage, SettingsService, ThemeMode, TimeFormat} from '../settings/settings.service';

@Component({
  selector: 'app-howtouse',
  imports: [
    FormsModule
  ],
  templateUrl: './howtouse.component.html',
  styleUrl: './howtouse.component.css'
})
export class HowtouseComponent {
  helpOpen = false;

  constructor(public settings: SettingsService) {}

  get language(): AppLanguage {
    return this.settings.language;
  }

  set language(value: AppLanguage) {
    this.settings.setLanguage(value);
  }

  get themeMode(): ThemeMode {
    return this.settings.themeMode;
  }

  set themeMode(value: ThemeMode) {
    this.settings.setThemeMode(value);
  }

  get timeFormat(): TimeFormat {
    return this.settings.timeFormat;
  }

  set timeFormat(value: TimeFormat) {
    this.settings.setTimeFormat(value);
  }

  toggleHelp(): void {
    this.helpOpen = !this.helpOpen;
  }
}
