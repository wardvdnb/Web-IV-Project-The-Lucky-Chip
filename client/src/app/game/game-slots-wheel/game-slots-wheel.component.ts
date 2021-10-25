import { Component, OnInit, Output, EventEmitter, Input, Inject  } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-game-slots-wheel',
  templateUrl: './game-slots-wheel.component.html',
  styleUrls: ['./game-slots-wheel.component.css']
})
export class GameSlotsWheelComponent implements OnInit {

  private values : number[] = [1, 2, 3, 4, 5, 6];
  borderStyles : BehaviorSubject<boolean[]> = new BehaviorSubject<boolean[]>([false, false, false]);
  get shown(){
    return this.values.slice(0, 3);
  }
  private readonly wait : number = 30; //wait time between value shift (in milliseconds)

  @Input() wheelNr : number;
  @Input() duration : number; //amount of times the wheel shifts 1 frame
  @Input() delay : number; //slight delay on start
  @Input() winningValues : BehaviorSubject<boolean[][]>;
  @Input() clickEvent: Subject<void>;
  @Output() onFinishEvent = new EventEmitter<{values: number[], wheelNr: number}>();

  constructor() { }

  ngOnInit(): void {
    this.winningValues.subscribe(allValues => {
        this.borderStyles.next(allValues[this.wheelNr-1]);
      }
    )
    this.clickEvent.subscribe(() =>
       this.shiftValues()
    )
  }

  shiftValues() : void{
    setTimeout(() => {
      this.shuffle(this.values);
      for (let i = 0; i < this.duration; i++) {
        setTimeout(i => 
        {
          this.values = this.values.slice(-1).concat(this.values.slice(0, 4));
        },
        this.wait*i);
      }
      setTimeout(() => this.onFinishEvent.emit({values: [...this.shown], wheelNr: this.wheelNr}), this.duration*this.wait);
    }, this.delay);
    
  }

  private randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private shuffle(array) : void{
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
