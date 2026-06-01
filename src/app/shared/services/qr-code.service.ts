import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QrCodeService {
  generateBase64(canvas: HTMLCanvasElement): string {
    return canvas.toDataURL('image/png');
  }

  downloadBase64(base64: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = base64;
    link.download = fileName;
    link.click();
  }

  async copyToClipboard(value: string): Promise<void> {
    await navigator.clipboard.writeText(value);
  }
}
