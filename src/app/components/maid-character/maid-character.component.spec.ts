import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaidCharacterComponent } from './maid-character.component';

describe('MaidCharacterComponent', () => {
  let component: MaidCharacterComponent;
  let fixture: ComponentFixture<MaidCharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaidCharacterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaidCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
