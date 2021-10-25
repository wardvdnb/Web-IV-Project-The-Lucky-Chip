import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSlotsComponent } from './game-slots/game-slots.component';
import { MaterialModule } from '../material/material.module';
import { GameSlotsWheelComponent } from './game-slots-wheel/game-slots-wheel.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'slots', component: GameSlotsComponent}
];

@NgModule({
  declarations: [GameSlotsComponent, GameSlotsWheelComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports:[GameSlotsComponent]
})
export class GameModule { }
