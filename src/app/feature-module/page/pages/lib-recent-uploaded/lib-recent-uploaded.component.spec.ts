import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibRecentUploadedComponent } from './lib-recent-uploaded.component';

describe('RequstedDoComponent', () => {
  let component: LibRecentUploadedComponent;
  let fixture: ComponentFixture<LibRecentUploadedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibRecentUploadedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibRecentUploadedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
