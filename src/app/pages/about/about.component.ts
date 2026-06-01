import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateForRoute({
      title: 'About Our Free QR Code Generator | QR Code Generator',
      description:
        'Learn how our free online QR code generator works. Create QR codes from URLs, text, emails, and more — directly in your browser with no sign-up required.',
      canonical: '/about',
    });

    this.seo.setStructuredData({
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About QR Code Generator',
      url: `${this.seo.baseUrl}/about`,
      description: 'Learn how our free QR code generator works and how to create QR codes online.',
    });
  }
}
