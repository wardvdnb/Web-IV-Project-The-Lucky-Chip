import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-slots-information-window',
  templateUrl: './slots-information-window.component.html',
  styleUrls: ['./slots-information-window.component.css']
})
export class SlotsInformationWindowComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SlotsInformationWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onOkClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
