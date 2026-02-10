import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

export type AppLanguage = 'de' | 'en';
export type ThemeMode = 'light' | 'dark' | 'system';
export type TimeFormat = '24h' | '12h';

const STORAGE_KEYS = {
  language: 'app_language',
  theme: 'theme',
  timeFormat: 'time_format'
} as const;

const DICT: Record<AppLanguage, Record<string, string>> = {
  en: {
    nav_tasks: 'Tasks',
    nav_archive: 'Archive',
    nav_config: 'Config',
    app_subtitle: 'active tasks',
    btn_new: 'New',
    today: 'Today',
    your_tasks: 'Your Tasks',
    your_tasks_sub: 'Plan, prioritize and finish with one tap.',
    create_task: 'Create Task',
    no_active_tasks: 'No active tasks',
    no_active_tasks_sub: 'Create your first card and it will appear here.',
    create_now: 'Create Now',
    task_editor: 'Task Editor',
    edit_task: 'Edit Task',
    new_task: 'Create Task',
    description: 'Description',
    time_range: 'Time range',
    color: 'Color',
    priority: 'Priority',
    priority_low: 'Low',
    priority_medium: 'Medium',
    priority_high: 'High',
    quick_input: 'Quick input',
    quick_placeholder: 'e.g. Call Alex tomorrow 14:30 +30m !! #blue',
    parse_fill: 'Apply',
    smart_presets: 'Smart presets',
    preset_now: 'Now',
    preset_today_pm: 'Today 18:00',
    preset_tomorrow_am: 'Tomorrow 09:00',
    preset_tomorrow_evening: 'Tomorrow 20:00',
    quick_duration: 'Duration',
    duration_30: '+30m',
    duration_60: '+60m',
    duration_90: '+90m',
    duplicate: 'Duplicate',
    filter_title: 'Filters',
    filter_when: 'When',
    filter_priority: 'Priority',
    filter_all: 'All',
    filter_today: 'Today',
    filter_morning: 'This morning',
    filter_afternoon: 'This afternoon',
    filter_week: 'This week',
    cancel: 'Cancel',
    save: 'Save',
    create: 'Create',
    delete_confirm: 'Delete this task and move it to archive?',
    yes: 'Yes',
    archive_title: 'Archive',
    archive_sub: 'Completed and deleted tasks live here.',
    clear: 'Clear',
    archive_empty: 'Archive is empty',
    archive_empty_sub: 'Done tasks and deleted tasks will appear here.',
    restore: 'Restore',
    done: 'DONE',
    deleted: 'DELETED',
    status_open: 'OPEN',
    status_progress: 'IN PROGRESS',
    status_done: 'DONE',
    config_title: 'Configuration',
    config_sub: 'Set language, theme and time display.',
    language: 'Language',
    language_de: 'German',
    language_en: 'English',
    theme: 'Theme',
    theme_light: 'Light',
    theme_dark: 'Dark',
    theme_system: 'System',
    time_model: 'Time model',
    time_24h: '24-hour',
    time_12h: '12-hour',
    help: 'Help',
    help_priority_title: 'Priority legend',
    help_low: 'Low: not urgent',
    help_medium: 'Medium: standard task',
    help_high: 'High: urgent item',
    help_flow_title: 'Task flow',
    help_flow_1: 'Create a task from the top bar or main button.',
    help_flow_2: 'Edit with pencil, archive with trash.',
    help_flow_3: 'Status cycles: open -> in-progress -> done.',
    help_flow_4: 'Done tasks are moved to archive automatically.',
    help_data_title: 'Data handling',
    help_data_text: 'All todos are stored locally on this device. Mobile and desktop keep separate local data unless you add sync later.'
  },
  de: {
    nav_tasks: 'Aufgaben',
    nav_archive: 'Archiv',
    nav_config: 'Config',
    app_subtitle: 'aktive Aufgaben',
    btn_new: 'Neu',
    today: 'Heute',
    your_tasks: 'Deine Aufgaben',
    your_tasks_sub: 'Planen, priorisieren und mit einem Tap erledigen.',
    create_task: 'Aufgabe erstellen',
    no_active_tasks: 'Keine aktiven Aufgaben',
    no_active_tasks_sub: 'Erstelle deine erste Karte, dann erscheint sie hier.',
    create_now: 'Jetzt erstellen',
    task_editor: 'Aufgaben-Editor',
    edit_task: 'Aufgabe bearbeiten',
    new_task: 'Aufgabe erstellen',
    description: 'Beschreibung',
    time_range: 'Zeitspanne',
    color: 'Farbe',
    priority: 'Prioritat',
    priority_low: 'Niedrig',
    priority_medium: 'Mittel',
    priority_high: 'Hoch',
    quick_input: 'Schnelleingabe',
    quick_placeholder: 'z.B. Alex anrufen morgen 14:30 +30m !! #blau',
    parse_fill: 'Uebernehmen',
    smart_presets: 'Smart Presets',
    preset_now: 'Jetzt',
    preset_today_pm: 'Heute 18:00',
    preset_tomorrow_am: 'Morgen 09:00',
    preset_tomorrow_evening: 'Morgen 20:00',
    quick_duration: 'Dauer',
    duration_30: '+30m',
    duration_60: '+60m',
    duration_90: '+90m',
    duplicate: 'Duplizieren',
    filter_title: 'Filter',
    filter_when: 'Zeitraum',
    filter_priority: 'Prioritaet',
    filter_all: 'Alle',
    filter_today: 'Heute',
    filter_morning: 'Heute vormittag',
    filter_afternoon: 'Heute nachmittag',
    filter_week: 'Diese Woche',
    cancel: 'Abbrechen',
    save: 'Speichern',
    create: 'Erstellen',
    delete_confirm: 'Diese Aufgabe loschen und ins Archiv verschieben?',
    yes: 'Ja',
    archive_title: 'Archiv',
    archive_sub: 'Erledigte und geloschte Aufgaben liegen hier.',
    clear: 'Leeren',
    archive_empty: 'Archiv ist leer',
    archive_empty_sub: 'Erledigte und geloschte Aufgaben erscheinen hier.',
    restore: 'Wiederherstellen',
    done: 'ERLEDIGT',
    deleted: 'GELOSCHT',
    status_open: 'OFFEN',
    status_progress: 'IN ARBEIT',
    status_done: 'ERLEDIGT',
    config_title: 'Konfiguration',
    config_sub: 'Sprache, Theme und Zeitdarstellung einstellen.',
    language: 'Sprache',
    language_de: 'Deutsch',
    language_en: 'Englisch',
    theme: 'Theme',
    theme_light: 'Hell',
    theme_dark: 'Dunkel',
    theme_system: 'System',
    time_model: 'Zeitmodell',
    time_24h: '24-Stunden',
    time_12h: '12-Stunden',
    help: 'Hilfe',
    help_priority_title: 'Prioritaten',
    help_low: 'Niedrig: nicht dringend',
    help_medium: 'Mittel: normale Aufgabe',
    help_high: 'Hoch: dringend',
    help_flow_title: 'Ablauf',
    help_flow_1: 'Aufgabe oben oder uber den Hauptbutton erstellen.',
    help_flow_2: 'Mit Stift bearbeiten, mit Mulleimer archivieren.',
    help_flow_3: 'Status wechselt: offen -> in Arbeit -> erledigt.',
    help_flow_4: 'Erledigte Aufgaben wandern automatisch ins Archiv.',
    help_data_title: 'Daten',
    help_data_text: 'Alle Todos werden nur lokal auf diesem Gerat gespeichert. Mobile und Desktop haben getrennte lokale Daten, solange kein Sync eingebaut ist.'
  }
};

@Injectable({providedIn: 'root'})
export class SettingsService {
  language: AppLanguage = 'en';
  themeMode: ThemeMode = 'system';
  timeFormat: TimeFormat = '24h';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.load();
  }

  t(key: string): string {
    return DICT[this.language][key] ?? key;
  }

  setLanguage(language: AppLanguage): void {
    this.language = language;
    this.persist(STORAGE_KEYS.language, language);
  }

  setThemeMode(themeMode: ThemeMode): void {
    this.themeMode = themeMode;
    this.persist(STORAGE_KEYS.theme, themeMode);
    this.applyTheme();
  }

  setTimeFormat(timeFormat: TimeFormat): void {
    this.timeFormat = timeFormat;
    this.persist(STORAGE_KEYS.timeFormat, timeFormat);
  }

  formatTime(time: string): string {
    if (!time) {
      return '';
    }
    if (this.timeFormat === '24h') {
      return time;
    }
    const [hhRaw, mmRaw] = time.split(':');
    const hh = Number(hhRaw);
    const mm = Number(mmRaw);
    if (Number.isNaN(hh) || Number.isNaN(mm)) {
      return time;
    }
    const suffix = hh >= 12 ? 'PM' : 'AM';
    const hour12 = hh % 12 === 0 ? 12 : hh % 12;
    const minute = mm.toString().padStart(2, '0');
    return `${hour12}:${minute} ${suffix}`;
  }

  locale(): string {
    return this.language === 'de' ? 'de-DE' : 'en-US';
  }

  private load(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const language = localStorage.getItem(STORAGE_KEYS.language);
    if (language === 'de' || language === 'en') {
      this.language = language;
    }

    const storedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    if (storedTheme === 'dark' || storedTheme === 'light' || storedTheme === 'system') {
      this.themeMode = storedTheme;
    }

    const timeFormat = localStorage.getItem(STORAGE_KEYS.timeFormat);
    if (timeFormat === '12h' || timeFormat === '24h') {
      this.timeFormat = timeFormat;
    }

    this.applyTheme();
  }

  private applyTheme(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    let isDark = false;
    if (this.themeMode === 'dark') {
      isDark = true;
    } else if (this.themeMode === 'system') {
      isDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    }

    document.documentElement.classList.toggle('dark', isDark);
  }

  private persist(key: string, value: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.setItem(key, value);
  }
}
