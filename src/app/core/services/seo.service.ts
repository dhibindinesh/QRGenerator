import { Injectable, inject, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  robots?: string;
  ogType?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly renderer: Renderer2;

  private readonly siteName = 'QR Code Generator';
  private readonly defaultOgImage = '/assets/images/qr-preview.png';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  get baseUrl(): string {
    const view = this.document.defaultView;
    return view ? view.location.origin : environment.siteUrl;
  }

  setTitle(value: string): void {
    this.titleService.setTitle(value);
    this.meta.updateTag({ property: 'og:title', content: value });
    this.meta.updateTag({ name: 'twitter:title', content: value });
  }

  setDescription(value: string): void {
    this.meta.updateTag({ name: 'description', content: value });
    this.meta.updateTag({ property: 'og:description', content: value });
    this.meta.updateTag({ name: 'twitter:description', content: value });
  }

  setKeywords(value: string): void {
    this.meta.updateTag({ name: 'keywords', content: value });
  }

  setCanonicalUrl(path = '/'): void {
    const url = `${this.baseUrl}${path}`;
    this.meta.updateTag({ property: 'og:url', content: url });

    const existing = this.document.querySelector('link[rel="canonical"]');
    if (existing) {
      this.renderer.setAttribute(existing, 'href', url);
    } else {
      const link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'canonical');
      this.renderer.setAttribute(link, 'href', url);
      this.renderer.appendChild(this.document.head, link);
    }
  }

  setRobots(value: string): void {
    this.meta.updateTag({ name: 'robots', content: value });
  }

  setOpenGraph(config: {
    title: string;
    description: string;
    url: string;
    image?: string;
    type?: string;
  }): void {
    const image = config.image ?? `${this.baseUrl}${this.defaultOgImage}`;
    this.meta.updateTag({ property: 'og:type', content: config.type ?? 'website' });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: config.url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:image:alt', content: 'QR Code Generator — Create QR Codes Online for Free' });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:locale', content: 'en_US' });
  }

  setTwitterCard(config: { title: string; description: string; image?: string }): void {
    const image = config.image ?? `${this.baseUrl}${this.defaultOgImage}`;
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    this.meta.updateTag({ name: 'twitter:image:alt', content: 'QR Code Generator — Create QR Codes Online for Free' });
  }

  setStructuredData(schema: object | object[]): void {
    this.document.querySelectorAll('script[data-seo-schema]').forEach(el => el.remove());

    const schemas = Array.isArray(schema) ? schema : [schema];
    for (const s of schemas) {
      const script = this.renderer.createElement('script');
      this.renderer.setAttribute(script, 'type', 'application/ld+json');
      this.renderer.setAttribute(script, 'data-seo-schema', 'true');
      this.renderer.setProperty(script, 'textContent', JSON.stringify(s));
      this.renderer.appendChild(this.document.head, script);
    }
  }

  updateForRoute(config: SeoConfig): void {
    const canonical = config.canonical ?? '/';
    const url = `${this.baseUrl}${canonical}`;
    const image = config.ogImage ? `${this.baseUrl}${config.ogImage}` : undefined;

    this.setTitle(config.title);
    this.setDescription(config.description);

    if (config.keywords) {
      this.setKeywords(config.keywords);
    }

    this.setCanonicalUrl(canonical);
    this.setRobots(config.robots ?? 'index, follow');
    this.setOpenGraph({ title: config.title, description: config.description, url, image, type: config.ogType });
    this.setTwitterCard({ title: config.title, description: config.description, image });
  }
}
