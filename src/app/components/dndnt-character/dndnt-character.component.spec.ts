import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DndntCharacterComponent } from './dndnt-character.component';

describe('DndntCharacterComponent', () => {
  let component: DndntCharacterComponent;
  let fixture: ComponentFixture<DndntCharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DndntCharacterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DndntCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
