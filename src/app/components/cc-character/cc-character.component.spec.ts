import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcCharacterComponent } from './cc-character.component';

describe('CcCharacterComponent', () => {
  let component: CcCharacterComponent;
  let fixture: ComponentFixture<CcCharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CcCharacterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CcCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
