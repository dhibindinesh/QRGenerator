import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

interface Faq {
  question: string;
  answer: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface UseCase {
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly seo = inject(SeoService);

  readonly faqs: Faq[] = [
    {
      question: 'What is a QR Code?',
      answer:
        'A QR Code (Quick Response Code) is a two-dimensional barcode that stores information such as URLs, text, contact details, or other data. When scanned with a smartphone camera, it instantly opens the encoded content — making sharing links, WiFi credentials, or business information quick and easy.',
    },
    {
      question: 'How do I create a QR Code online?',
      answer:
        'To create a QR code online, visit our QR Generator page, enter any text, URL, email, phone number, or JSON data into the input field, and click Generate. Your QR code is created instantly in your browser — no account or sign-up required.',
    },
    {
      question: 'Can I download QR codes as PNG?',
      answer:
        'Yes. Once your QR code is generated, click the Download PNG button to save a high-quality PNG image to your device. The image is ready to use in print materials, presentations, websites, and more.',
    },
    {
      question: 'Can I generate QR codes from URLs?',
      answer:
        'Absolutely. Simply paste any URL into the QR generator, click Generate, and your URL is instantly encoded into a scannable QR code. Visitors who scan the code will be taken directly to your website or web page.',
    },
    {
      question: 'Is this QR code generator free?',
      answer:
        'Yes, our QR code generator is completely free to use. There are no subscriptions, no hidden fees, and no watermarks. You can generate and download as many QR codes as you need at no cost.',
    },
    {
      question: 'What types of content can I convert to a QR code?',
      answer:
        'You can convert any text-based content to a QR code, including website URLs, plain text, email addresses, phone numbers, JSON data, and WiFi credentials. Our generator supports any content that fits within a QR code capacity.',
    },
  ];

  readonly features: Feature[] = [
    {
      icon: '🔗',
      title: 'URL to QR Code',
      description: 'Convert any website URL into a scannable QR code. Share links instantly without typing.',
    },
    {
      icon: '📝',
      title: 'Text to QR Code',
      description: 'Encode plain text messages, notes, or information into QR codes for quick sharing.',
    },
    {
      icon: '📧',
      title: 'Email to QR Code',
      description: 'Generate QR codes that open an email compose window when scanned.',
    },
    {
      icon: '📱',
      title: 'Phone Number QR',
      description: 'Create QR codes that dial a phone number automatically when scanned.',
    },
    {
      icon: '📦',
      title: 'JSON to QR Code',
      description: 'Encode structured JSON data into compact QR codes for data sharing.',
    },
    {
      icon: '⬇️',
      title: 'Download as PNG',
      description: 'Download your generated QR code as a high-quality PNG image instantly.',
    },
  ];

  readonly useCases: UseCase[] = [
    { title: 'Business Cards', description: 'Replace long URLs with a QR code on your business card.' },
    { title: 'Restaurant Menus', description: 'Link customers to your digital menu with a table QR code.' },
    { title: 'Event Tickets', description: 'Embed ticket data in a QR code for fast event check-in.' },
    { title: 'Product Packaging', description: 'Add QR codes to packaging to link to product pages or manuals.' },
    { title: 'WiFi Sharing', description: 'Share your WiFi credentials without typing the password.' },
    { title: 'Website Links', description: 'Drive traffic to any URL with a printable QR code.' },
  ];

  openFaqIndex: number | null = null;

  ngOnInit(): void {
    const title = 'Free QR Code Generator Online | Create & Download QR Codes Instantly';
    const description =
      'Generate QR codes online for free. Convert URLs, text, emails, phone numbers, JSON, and more into downloadable QR code images instantly. No sign-up required.';

    this.seo.updateForRoute({
      title,
      description,
      keywords:
        'QR code generator, free QR generator, create QR code, QR code maker, download QR code, online QR generator, QR image generator',
      canonical: '/',
    });

    this.seo.setStructuredData([
      this.buildOrganizationSchema(),
      this.buildWebApplicationSchema(),
      this.buildFaqSchema(),
    ]);
  }

  toggleFaq(index: number): void {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }

  private buildOrganizationSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'QR Code Generator',
      url: this.seo.baseUrl,
      logo: `${this.seo.baseUrl}/assets/images/qr-preview.png`,
      description: 'Free online QR code generator — create and download QR codes from URLs, text, emails, and more.',
    };
  }

  private buildWebApplicationSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'QR Code Generator',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      url: this.seo.baseUrl,
      description:
        'Generate QR codes online for free. Convert URLs, text, emails, phone numbers, JSON, and more into downloadable QR code images.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Generate QR codes from URLs',
        'Generate QR codes from text',
        'Download QR codes as PNG',
        'Copy QR code as Base64',
        'No sign-up required',
        'Mobile-friendly interface',
      ],
    };
  }

  private buildFaqSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }
}
