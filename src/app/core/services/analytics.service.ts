import { Injectable, inject, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly document = inject(DOCUMENT);
  private readonly renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  initialize(): void {
    this.loadGoogleAnalytics();
    // this.addGoogleSiteVerification();
    // this.loadMicrosoftClarity();
  }

  private loadGoogleAnalytics(): void {
    const id = environment.googleAnalyticsId;
    if (!id) return;

    const gtagScript = this.renderer.createElement('script');
    this.renderer.setAttribute(gtagScript, 'async', '');
    this.renderer.setAttribute(gtagScript, 'src', `https://www.googletagmanager.com/gtag/js?id=${id}`);
    this.renderer.appendChild(this.document.head, gtagScript);

    const initScript = this.renderer.createElement('script');
    this.renderer.setProperty(
      initScript,
      'textContent',
      `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`,
    );
    this.renderer.appendChild(this.document.head, initScript);
  }

  private addGoogleSiteVerification(): void {
    const token = environment.googleSiteVerification;
    if (!token) return;
    this.document.querySelector('meta[name="google-site-verification"]')?.remove();
    const meta = this.renderer.createElement('meta');
    this.renderer.setAttribute(meta, 'name', 'google-site-verification');
    this.renderer.setAttribute(meta, 'content', token);
    this.renderer.appendChild(this.document.head, meta);
  }

  private loadMicrosoftClarity(): void {
    const id = environment.microsoftClarityId;
    if (!id) return;

    const script = this.renderer.createElement('script');
    this.renderer.setProperty(
      script,
      'textContent',
      `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${id}");`,
    );
    this.renderer.appendChild(this.document.head, script);
  }
}
