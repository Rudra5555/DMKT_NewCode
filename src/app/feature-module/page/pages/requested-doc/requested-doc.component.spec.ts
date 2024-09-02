import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedDocComponent } from './requested-doc.component';

describe('RequstedDoComponent', () => {
  let component: RequestedDocComponent;
  let fixture: ComponentFixture<RequestedDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestedDocComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestedDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
