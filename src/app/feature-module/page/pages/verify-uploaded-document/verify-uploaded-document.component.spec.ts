import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyUploadedDocumentComponent } from './verify-uploaded-document.component';

describe('VerifyUploadedDocumentComponent', () => {
  let component: VerifyUploadedDocumentComponent;
  let fixture: ComponentFixture<VerifyUploadedDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyUploadedDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyUploadedDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
