import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Calendar } from './features/calendar/calendar';
import { Create } from './features/create/create';
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
    path: 'create',
    component: Create,
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
