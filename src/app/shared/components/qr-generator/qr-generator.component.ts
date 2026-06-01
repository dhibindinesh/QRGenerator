import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import { QrCodeService } from '../../services/qr-code.service';

type FeedbackType = 'success' | 'error';

interface Feedback {
  message: string;
  type: FeedbackType;
}

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, QRCodeComponent],
  templateUrl: './qr-generator.component.html',
  styleUrl: './qr-generator.component.scss',
})
export class QrGeneratorComponent implements OnChanges {
  @Input() value = '';
  @Input() size = 250;
  @Input() autoGenerate = true;

  @Output() base64Generated = new EventEmitter<string>();
  @Output() qrGenerated = new EventEmitter<void>();

  @ViewChild('qrContainer') qrContainer!: ElementRef<HTMLDivElement>;

  private readonly qrService = inject(QrCodeService);

  inputValue = signal('');
  qrValue = signal('');
  validationError = signal('');
  feedback = signal<Feedback | null>(null);
  hasQr = signal(false);

  private feedbackTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnChanges(): void {
    if (this.value) {
      this.inputValue.set(this.value);
      if (this.autoGenerate) {
        this.generateQR();
      }
    }
  }

  generateQR(): void {
    const val = this.inputValue().trim();

    if (!val) {
      this.validationError.set('Please enter text to generate QR code.');
      this.qrValue.set('');
      this.hasQr.set(false);
      return;
    }

    this.validationError.set('');
    this.qrValue.set(val);
    this.hasQr.set(true);
    this.qrGenerated.emit();

    // Allow canvas to render before extracting Base64
    setTimeout(() => {
      const base64 = this.getBase64();
      if (base64) {
        this.base64Generated.emit(base64);
      }
    }, 100);
  }

  getBase64(): string {
    const canvas = this.qrContainer?.nativeElement?.querySelector('canvas');
    if (!canvas) {
      return '';
    }
    return this.qrService.generateBase64(canvas as HTMLCanvasElement);
  }

  downloadQRCode(): void {
    const base64 = this.getBase64();
    if (!base64) {
      this.showFeedback('Unable to download QR code.', 'error');
      return;
    }
    this.qrService.downloadBase64(base64, 'predictaleague-qr.png');
  }

  async copyBase64(): Promise<void> {
    const base64 = this.getBase64();
    if (!base64) {
      this.showFeedback('Unable to copy Base64.', 'error');
      return;
    }
    try {
      await this.qrService.copyToClipboard(base64);
      this.showFeedback('Base64 copied successfully.', 'success');
    } catch {
      this.showFeedback('Unable to copy Base64.', 'error');
    }
  }

  async copyText(): Promise<void> {
    const val = this.inputValue().trim();
    if (!val) {
      this.showFeedback('Unable to copy content.', 'error');
      return;
    }
    try {
      await this.qrService.copyToClipboard(val);
      this.showFeedback('Text copied successfully.', 'success');
    } catch {
      this.showFeedback('Unable to copy content.', 'error');
    }
  }

  private showFeedback(message: string, type: FeedbackType): void {
    if (this.feedbackTimer) {
      clearTimeout(this.feedbackTimer);
    }
    this.feedback.set({ message, type });
    this.feedbackTimer = setTimeout(() => this.feedback.set(null), 3000);
  }
}
