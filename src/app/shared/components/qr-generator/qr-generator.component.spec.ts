import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { QrGeneratorComponent } from './qr-generator.component';
import { QrCodeService } from '../../services/qr-code.service';
import { provideZoneChangeDetection } from '@angular/core';

const MOCK_BASE64 = 'data:image/png;base64,ABC123';

class MockQrCodeService {
  generateBase64 = jasmine.createSpy('generateBase64').and.returnValue(MOCK_BASE64);
  downloadBase64 = jasmine.createSpy('downloadBase64');
  copyToClipboard = jasmine.createSpy('copyToClipboard').and.returnValue(Promise.resolve());
}

describe('QrGeneratorComponent', () => {
  let component: QrGeneratorComponent;
  let fixture: ComponentFixture<QrGeneratorComponent>;
  let qrService: MockQrCodeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrGeneratorComponent],
      providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        { provide: QrCodeService, useClass: MockQrCodeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QrGeneratorComponent);
    component = fixture.componentInstance;
    qrService = TestBed.inject(QrCodeService) as unknown as MockQrCodeService;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Input binding', () => {
    it('should set inputValue when value input changes', () => {
      component.value = 'https://predictaleague.com';
      component.autoGenerate = false;
      component.ngOnChanges();
      expect(component.inputValue()).toBe('https://predictaleague.com');
    });

    it('should auto-generate QR when autoGenerate is true', fakeAsync(() => {
      spyOn(component, 'generateQR');
      component.value = 'https://predictaleague.com';
      component.autoGenerate = true;
      component.ngOnChanges();
      expect(component.generateQR).toHaveBeenCalled();
    }));

    it('should not auto-generate QR when autoGenerate is false', () => {
      spyOn(component, 'generateQR');
      component.value = 'https://predictaleague.com';
      component.autoGenerate = false;
      component.ngOnChanges();
      expect(component.generateQR).not.toHaveBeenCalled();
    });
  });

  describe('QR generation', () => {
    it('should set validation error and not show QR when input is empty', () => {
      component.inputValue.set('');
      component.generateQR();
      expect(component.validationError()).toBe('Please enter text to generate QR code.');
      expect(component.hasQr()).toBeFalse();
    });

    it('should set validation error when input is only whitespace', () => {
      component.inputValue.set('   ');
      component.generateQR();
      expect(component.validationError()).toBe('Please enter text to generate QR code.');
    });

    it('should generate QR code for a valid URL', fakeAsync(() => {
      component.inputValue.set('https://predictaleague.com/invite/ABC123');
      spyOn(component.qrGenerated, 'emit');
      component.generateQR();
      expect(component.qrValue()).toBe('https://predictaleague.com/invite/ABC123');
      expect(component.hasQr()).toBeTrue();
      expect(component.validationError()).toBe('');
      expect(component.qrGenerated.emit).toHaveBeenCalled();
      tick(100);
    }));

    it('should generate QR code for plain text', fakeAsync(() => {
      component.inputValue.set('Hello World');
      component.generateQR();
      expect(component.hasQr()).toBeTrue();
      tick(100);
    }));

    it('should generate QR code for JSON string', fakeAsync(() => {
      component.inputValue.set('{"eventId":12,"leagueId":4}');
      component.generateQR();
      expect(component.hasQr()).toBeTrue();
      tick(100);
    }));

    it('should emit base64Generated after generation', fakeAsync(() => {
      spyOn(component.base64Generated, 'emit');
      spyOn(component, 'getBase64').and.returnValue(MOCK_BASE64);
      component.inputValue.set('https://predictaleague.com');
      component.generateQR();
      tick(100);
      expect(component.base64Generated.emit).toHaveBeenCalledWith(MOCK_BASE64);
    }));

    it('should clear previous validation error on successful generation', fakeAsync(() => {
      component.inputValue.set('');
      component.generateQR();
      expect(component.validationError()).toBeTruthy();

      component.inputValue.set('some text');
      component.generateQR();
      expect(component.validationError()).toBe('');
      tick(100);
    }));
  });

  describe('getBase64', () => {
    it('should return empty string when qrContainer is not set', () => {
      (component as any).qrContainer = undefined;
      expect(component.getBase64()).toBe('');
    });

    it('should return empty string when no canvas element exists', () => {
      (component as any).qrContainer = { nativeElement: document.createElement('div') };
      expect(component.getBase64()).toBe('');
    });

    it('should call qrService.generateBase64 with the canvas element', () => {
      const div = document.createElement('div');
      const canvas = document.createElement('canvas');
      div.appendChild(canvas);
      (component as any).qrContainer = { nativeElement: div };

      component.getBase64();
      expect(qrService.generateBase64).toHaveBeenCalledWith(canvas);
    });
  });

  describe('downloadQRCode', () => {
    it('should show error feedback when no canvas is available', () => {
      spyOn(component, 'getBase64').and.returnValue('');
      component.downloadQRCode();
      expect(component.feedback()?.type).toBe('error');
      expect(component.feedback()?.message).toContain('Unable to download');
    });

    it('should call qrService.downloadBase64 with correct file name', () => {
      spyOn(component, 'getBase64').and.returnValue(MOCK_BASE64);
      component.downloadQRCode();
      expect(qrService.downloadBase64).toHaveBeenCalledWith(MOCK_BASE64, 'predictaleague-qr.png');
    });
  });

  describe('copyBase64', () => {
    it('should show error feedback when no canvas is available', async () => {
      spyOn(component, 'getBase64').and.returnValue('');
      await component.copyBase64();
      expect(component.feedback()?.type).toBe('error');
      expect(component.feedback()?.message).toContain('Unable to copy Base64');
    });

    it('should copy base64 to clipboard and show success feedback', async () => {
      spyOn(component, 'getBase64').and.returnValue(MOCK_BASE64);
      await component.copyBase64();
      expect(qrService.copyToClipboard).toHaveBeenCalledWith(MOCK_BASE64);
      expect(component.feedback()?.type).toBe('success');
      expect(component.feedback()?.message).toBe('Base64 copied successfully.');
    });

    it('should show error feedback when clipboard write fails', async () => {
      spyOn(component, 'getBase64').and.returnValue(MOCK_BASE64);
      qrService.copyToClipboard.and.returnValue(Promise.reject(new Error('denied')));
      await component.copyBase64();
      expect(component.feedback()?.type).toBe('error');
    });
  });

  describe('copyText', () => {
    it('should show error feedback when input is empty', async () => {
      component.inputValue.set('');
      await component.copyText();
      expect(component.feedback()?.type).toBe('error');
    });

    it('should copy input text to clipboard and show success feedback', async () => {
      component.inputValue.set('https://predictaleague.com');
      await component.copyText();
      expect(qrService.copyToClipboard).toHaveBeenCalledWith('https://predictaleague.com');
      expect(component.feedback()?.type).toBe('success');
      expect(component.feedback()?.message).toBe('Text copied successfully.');
    });
  });

  describe('Output events', () => {
    it('should emit qrGenerated when QR is generated', fakeAsync(() => {
      let emitted = false;
      component.qrGenerated.subscribe(() => (emitted = true));
      component.inputValue.set('test value');
      component.generateQR();
      expect(emitted).toBeTrue();
      tick(100);
    }));

    it('should emit base64Generated with base64 string', fakeAsync(() => {
      let receivedBase64 = '';
      spyOn(component, 'getBase64').and.returnValue(MOCK_BASE64);
      component.base64Generated.subscribe((val: string) => (receivedBase64 = val));
      component.inputValue.set('test value');
      component.generateQR();
      tick(100);
      expect(receivedBase64).toBe(MOCK_BASE64);
    }));
  });

  describe('Theme rendering', () => {
    it('should render correctly in light theme (no dark class on host)', () => {
      const card = fixture.debugElement.query(By.css('.bg-white'));
      expect(card).toBeTruthy();
    });

    it('should have dark mode classes on the card element', () => {
      const card = fixture.debugElement.query(By.css('.dark\\:bg-gray-800'));
      expect(card).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label on the text input', () => {
      const input = fixture.debugElement.query(By.css('input[aria-label]'));
      expect(input).toBeTruthy();
    });

    it('should have aria-label on the generate button', () => {
      const btn = fixture.debugElement.query(By.css('button[aria-label="Generate QR code"]'));
      expect(btn).toBeTruthy();
    });
  });

  describe('Mobile responsiveness', () => {
    it('should have w-full class on the container for full-width mobile layout', () => {
      const container = fixture.debugElement.query(By.css('.w-full.max-w-\\[500px\\]'));
      expect(container).toBeTruthy();
    });
  });
});
