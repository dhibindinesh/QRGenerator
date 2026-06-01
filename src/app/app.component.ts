import { Component, OnInit, signal } from '@angular/core';
import { QrGeneratorComponent } from './shared/components/qr-generator/qr-generator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QrGeneratorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  isDark = signal(false);

  ngOnInit(): void {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.setDark(stored === 'dark' || (!stored && prefersDark));
  }

  toggleTheme(): void {
    this.setDark(!this.isDark());
  }

  onQrGenerated(base64: string): void {
    console.log('QR Base64 ready, length:', base64.length);
  }

  private setDark(dark: boolean): void {
    this.isDark.set(dark);
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
}
