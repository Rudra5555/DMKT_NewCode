import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { PlantAComponent } from './blank-page.component';
 import { PlantAComponent } from './plant-a.component';

// import {  PlantAComponent } from './plant-a.component';

describe('BlankPageComponent', () => {
  let component: PlantAComponent;
  let fixture: ComponentFixture<PlantAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
