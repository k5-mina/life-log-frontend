import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Calendar } from './features/calendar/calendar';
import { NoiseLogForm } from './features/noise-log/noise-log-form/noise-log-form';
import { NoiseLogSearch } from './features/noise-log/noise-log-search/noise-log-search';

export const routes: Routes = [
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'records',
    component: Calendar,
  },
  {
    path: 'register',
    component: NoiseLogForm,
  },
  {
    path: 'search',
    component: NoiseLogSearch,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
