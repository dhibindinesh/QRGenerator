import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Free QR Code Generator Online | Create & Download QR Codes Instantly',
  },
  {
    path: 'qr-generator',
    loadComponent: () =>
      import('./pages/qr-generator/qr-generator-page.component').then(
        m => m.QrGeneratorPageComponent,
      ),
    title: 'QR Code Generator | Generate QR Codes from Text, URLs & More',
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'About Our Free QR Code Generator',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
