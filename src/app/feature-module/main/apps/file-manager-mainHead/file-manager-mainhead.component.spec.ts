import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerMainheadComponent } from './file-manager-mainhead.component';

describe('FileManagerMainheadComponent', () => {
  let component: FileManagerMainheadComponent;
  let fixture: ComponentFixture<FileManagerMainheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileManagerMainheadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileManagerMainheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
