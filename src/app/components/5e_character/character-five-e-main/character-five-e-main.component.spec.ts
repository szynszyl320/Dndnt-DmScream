import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterFiveEMainComponent } from './character-five-e-main.component';

describe('CharacterFiveEMainComponent', () => {
  let component: CharacterFiveEMainComponent;
  let fixture: ComponentFixture<CharacterFiveEMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterFiveEMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterFiveEMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
