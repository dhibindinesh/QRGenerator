import { Component, OnInit, inject } from '@angular/core';
import { QrGeneratorComponent } from '../../shared/components/qr-generator/qr-generator.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-qr-generator-page',
  standalone: true,
  imports: [QrGeneratorComponent],
  templateUrl: './qr-generator-page.component.html',
})
export class QrGeneratorPageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateForRoute({
      title: 'QR Code Generator | Generate QR Codes from Text, URLs & More',
      description:
        'Generate QR codes from text, URLs, emails, phone numbers, JSON, and custom data. Download as PNG or copy as Base64. Free, instant, no sign-up required.',
      keywords:
        'QR code generator, generate QR code, URL to QR code, text to QR code, download QR PNG, Base64 QR code, free QR maker',
      canonical: '/qr-generator',
    });

    this.seo.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'QR Code Generator',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      url: `${this.seo.baseUrl}/qr-generator`,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    });
  }
}
