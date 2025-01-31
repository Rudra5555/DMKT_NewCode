import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatutoryDocNotificationComponent } from './statutory-doc-notification.component';

describe('RequstedDoComponent', () => {
  let component: StatutoryDocNotificationComponent;
  let fixture: ComponentFixture<StatutoryDocNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatutoryDocNotificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatutoryDocNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
