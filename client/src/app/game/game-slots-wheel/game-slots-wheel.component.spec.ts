import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSlotsWheelComponent } from './game-slots-wheel.component';

describe('GameSlotsWheelComponent', () => {
  let component: GameSlotsWheelComponent;
  let fixture: ComponentFixture<GameSlotsWheelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameSlotsWheelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSlotsWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
