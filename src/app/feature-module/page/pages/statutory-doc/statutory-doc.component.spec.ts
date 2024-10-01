import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatutoryDocComponent } from './statutory-doc.component';

describe('RequstedDoComponent', () => {
  let component: StatutoryDocComponent;
  let fixture: ComponentFixture<StatutoryDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatutoryDocComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatutoryDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
