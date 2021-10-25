import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/user/authentication.service';
import { PlayerService } from 'src/app/user/player.service';
import { SlotsInformationWindowComponent } from '../slots-information-window/slots-information-window/slots-information-window.component';
import { MULTIPLIERS, PAYLINES } from './paylines';

/* import{
  fadeInDownAnimation,
  slideInDownAnimation,
  slideOutDownAnimation
}from 'angular-animations';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations'; */
@Component({
  selector: 'app-game-slots',
  templateUrl: './game-slots.component.html',
  styleUrls: ['./game-slots.component.css']
  /* animations: [
    fadeInDownAnimation(),
    slideInDownAnimation(),
    slideOutDownAnimation(),
    trigger('spinCard', [
      state('inactive', style({
          transform: 'translateY(0px)'
      })),
      state('active', style({
          transform: 'translateY(100%)'
      })),
      transition('inactive => active', animate('200ms ease-in-out')),
      transition('active => inactive', animate('200ms ease-in-out'))
    ])
  ] */
})
export class GameSlotsComponent implements OnInit {

  readonly amountOfWheels = 5;
  readonly minimumMatchingForPayout = 3;

  public betSize : FormGroup;
  loggedInUser$ = this._authenticationService.user$;
  playerBalance$ = this._playerService.balance$;

  private _winningValues : boolean[][] = new Array(this.amountOfWheels).fill(new Array(3).fill(false));
  private _allValues : number[][] = new Array(this.amountOfWheels).fill(new Array(3).fill(1));
  public winningValues: BehaviorSubject<boolean[][]>;
  public clickEvent: Subject<void> = new Subject<void>();

  public clicked : boolean = false;
  public durations : number[] = new Array(this.amountOfWheels).fill(1);
  public delays : number[] = new Array(this.amountOfWheels).fill(1);

  public playerLostAllMoney : boolean = false;

  constructor(private _authenticationService: AuthenticationService,
              private _playerService: PlayerService,
              private fb: FormBuilder,
              public dialog: MatDialog) 
  { 
    //_playerService.balance$.subscribe(newBalance => this.playerBalance$.next(newBalance));
    this.setWheelValues();
    this.winningValues = new BehaviorSubject<boolean[][]>(this._winningValues);
  }

  ngOnInit(): void {
    this.betSize = this.fb.group({
      amount: [0, [Validators.required, Validators.max(this.playerBalance$.value), Validators.min(1)]]
    });
    this.playerBalance$.subscribe(
      val => 
      this.betSize.controls["amount"].setValidators([Validators.required, Validators.max(val), Validators.min(1)])
    );
  }

  private resetWinningValues() : void{ //update winning values so wheel components can see which borders to show
    for (let i = 0; i < this._winningValues.length; i++){
      this._winningValues[i] = new Array(3).fill(false);
    }
    this.winningValues.next([...this._winningValues]);
  }

  click(){
    this.clicked = true;
    this.resetWinningValues();
    setTimeout(() => {
      this.clicked = false;
    }, Math.max(...this.durations)*30 + 500 + this.amountOfWheels*200);
    this.clickEvent.next();
  }

  setWheelValues(){
    //this.durations = this.durations.map(() => this.randomIntFromInterval(30, 50));
    for (let i = this.durations.length; i >= 0; i--) {
      this.durations[i] = 75 + i*15;
    }
    for (let i = this.delays.length; i >= 0; i--) {
      this.delays[i] = 500 + i*200;
    }
    // this.delays = this.delays.map(() => this.randomIntFromInterval(100, 400));
    // this.delays[0] = this.randomIntFromInterval(0, 200);
  }

  onFinished(wheelInfo : {values: number[], wheelNr: number}) {
    this._allValues[wheelInfo.wheelNr-1] = wheelInfo.values;
    if((wheelInfo.wheelNr == this._winningValues.length) && this.loggedInUser$.getValue()) this.calculateWin();  //if last wheel is done spinning calculate the win
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SlotsInformationWindowComponent, {
      width: '750px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  getErrorMessage(errors: any): string {
    if (errors.required) {
      return 'is required';
    } else if (errors.min) {
      return `need at least 1`;
    } else if (errors.max){
      return "You don't have enough money for this bet size."
    }
  }

  private calculateWin(){
    let originalBalance = this.playerBalance$.value;
    PAYLINES.forEach(line => 
      {
        let matchingLines = this.checkLine(line);
        let winningLine: boolean = matchingLines >= this.minimumMatchingForPayout;
        if(winningLine){
          this.updateWinningLines(line);
          let multipliers = MULTIPLIERS[matchingLines-this.minimumMatchingForPayout];
          let symbol = this._allValues[line[0][1]][line[0][0]];
          let multiplierForSymbol = multipliers[symbol-1]; //symbols go from 1...6
          let winValue = Math.ceil(this.betSize.value.amount*multiplierForSymbol);
          console.log(`you won: ${winValue}`);
          this.incrementPlayerBalance(winValue);
        }
      }
    );
    this.winningValues.next([...this._winningValues]);
    if(originalBalance === this.playerBalance$.value){//no wins registered
      this.incrementPlayerBalance(-this.betSize.value.amount);
    } 
  }

  private incrementPlayerBalance(money : number){
    let newBalance = this.playerBalance$.value + money;

    if(newBalance <= 0){
      newBalance = 1000; //give the player some new money to play with
      this.playerLostAllMoney = true;
    }else{
      this.playerLostAllMoney = false;
    }

    this._playerService.updateBalance(newBalance)
      .subscribe(
        (val) => {
          if(val){
            console.log(val);
            console.log("balance updated!");
          }else{
            console.log(val);
            console.log("updateBalance returned false");
          }
        }, (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
    
  }

  private checkLine(line: number[][]) : number {
    let firstValue : number = this._allValues[line[0][1]][line[0][0]];
    let keepgoing : boolean = true;
    let index : number = 1; //check if following values equal the first one
    while(keepgoing && (index < line.length)){
      let coordinate = line[index];
      if(this._allValues[coordinate[1]][coordinate[0]] == firstValue){
        index++;
      }else{
        keepgoing = false;
      }
    }
    return index;
  }

  private updateWinningLines(line: number[][]){
    line.forEach(coordinate => {
      let reel = this._winningValues[coordinate[1]];
      //reel = new Array(reel.length).fill(false);
      reel[coordinate[0]] = true;
      this._winningValues[coordinate[1]] = reel;
    });
    this.winningValues.next([...this._winningValues]);
  }

  private randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}