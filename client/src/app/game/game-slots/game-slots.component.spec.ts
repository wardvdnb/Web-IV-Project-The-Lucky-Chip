import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSlotsComponent } from './game-slots.component';

describe('GameSlotsComponent', () => {
  let component: GameSlotsComponent;
  let fixture: ComponentFixture<GameSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameSlotsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
