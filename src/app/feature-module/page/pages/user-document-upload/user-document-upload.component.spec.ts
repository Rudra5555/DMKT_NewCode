import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDocumentUpload } from './user-document-upload.component';

describe('UserDocumentUpload', () => {
  let component: UserDocumentUpload;
  let fixture: ComponentFixture<UserDocumentUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDocumentUpload ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDocumentUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
