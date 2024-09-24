import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedRejectDocListComponent } from './approvedReject-doc-list.component';

describe('ApprovedRejectDocListComponent', () => {
  let component: ApprovedRejectDocListComponent;
  let fixture: ComponentFixture<ApprovedRejectDocListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedRejectDocListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedRejectDocListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
