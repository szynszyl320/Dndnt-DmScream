import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDamageInputComponent } from './custom-damage-input.component';

describe('CustomDamageInputComponent', () => {
  let component: CustomDamageInputComponent;
  let fixture: ComponentFixture<CustomDamageInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDamageInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomDamageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
