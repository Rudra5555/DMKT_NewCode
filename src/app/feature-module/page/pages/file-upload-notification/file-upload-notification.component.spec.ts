import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadNotificationComponent } from './file-upload-notification.component';

describe('RequstedDoComponent', () => {
  let component: FileUploadNotificationComponent;
  let fixture: ComponentFixture<FileUploadNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileUploadNotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FileUploadNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
