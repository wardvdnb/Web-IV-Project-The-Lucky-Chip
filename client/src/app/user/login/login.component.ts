import { AuthenticationService } from '../authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PlayerService } from '../player.service';

function comparePasswords(control: AbstractControl): { [key: string]: any } {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password.value === confirmPassword.value
    ? null
    : { passwordsDiffer: true };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public user: FormGroup;
  public errorMessage: string = '';

  constructor(
    private authService: AuthenticationService,
    private playerService: PlayerService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.user = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.authService
      .login(this.user.value.username, this.user.value.password)
      .subscribe(
        (val) => {
          if (val) {
            this.playerService.fetchBalance().subscribe(val => this.playerService.balance$.next(val));
            if (this.authService.redirectUrl) {
              this.router.navigateByUrl(this.authService.redirectUrl).then(_ => location.reload());
              this.authService.redirectUrl = undefined;
            } else {
              this.router.navigate(['/shop/list']);
            }
          } else {
            this.errorMessage = `Could not login`;
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          if (err.error instanceof Error) {
            this.errorMessage = `Error while trying to login user ${this.user.value.username}: ${err.error.message}`;
          } else {
            this.errorMessage = `Error ${err.status} while trying to login user ${this.user.value.username}: ${err.error}`;
          }
        }
      );
  }
}
