import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterFiveEBaseplateComponent } from './character-five-e-baseplate.component';

describe('CharacterFiveEBaseplateComponent', () => {
  let component: CharacterFiveEBaseplateComponent;
  let fixture: ComponentFixture<CharacterFiveEBaseplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterFiveEBaseplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterFiveEBaseplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
