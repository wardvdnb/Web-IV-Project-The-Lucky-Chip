import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormBuilder,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PlayerService } from '../player.service';

function patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      return null;
    }

    // test the value of the control against the regexp supplied
    const valid = regex.test(control.value);
    // if true, return no error (no error), else return error passed in the second parameter
    return valid ? null : error;
  };
}

function comparePasswords(control: AbstractControl): { [key: string]: any } {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password.value === confirmPassword.value
    ? null
    : { passwordsDiffer: true };
}

function serverSideValidateUsername(
  checkAvailabilityFn: (n: string) => Observable<boolean>
): ValidatorFn {
  return (control: AbstractControl): Observable<{ [key: string]: any }> => {
    return checkAvailabilityFn(control.value).pipe(
      map((available) => {
        if (available) {
          return null;
        }
        return { userAlreadyExists: true };
      })
    );
  };
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public user: FormGroup;
  public errorMessage: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private playerService: PlayerService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.user = this.fb.group({
      nickname: [
        '',
        [Validators.required, Validators.minLength(1)],
        serverSideValidateUsername(this.authService.checkUserNameAvailability),
      ],
      email: [
        '',
        [Validators.required, Validators.email],
      ],
      passwordGroup: this.fb.group(
        {
          password: [
            '',
            [
              Validators.required,
              Validators.minLength(8),
              patternValidator(/\d/, { hasNumber: true }),
              patternValidator(/[A-Z]/, { hasUpperCase: true }),
              patternValidator(/[a-z]/, { hasLowerCase: true }),
            ],
          ],
          confirmPassword: ['', Validators.required],
        },
        { validator: comparePasswords }
      ),
    });
  }

  getErrorMessage(errors: any) {
    if (!errors) {
      return null;
    }
    if (errors.required) {
      return 'is required';
    } else if (errors.minlength) {
      return `needs at least ${errors.minlength.requiredLength} characters (got ${errors.minlength.actualLength})`;
    } else if (errors.hasNumber) {
      return `needs at least 1 number`;
    } else if (errors.hasUpperCase) {
      return `needs at least 1 upper case letter`;
    } else if (errors.hasNumber) {
      return `needs at least 1 lower case letter`;
    } else if (errors.userAlreadyExists) {
      return `user already exists`;
    } else if (errors.email) {
      return `not a valid email address`;
    } else if (errors.passwordsDiffer) {
      return `passwords are not the same`;
    }
  }

  onSubmit() {
    this.authService
      .register(
        this.user.value.nickname,
        this.user.value.email,
        this.user.value.passwordGroup.password
      )
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
            this.errorMessage = `Error while trying to login user ${this.user.value.nickname}: ${err.error.message}`;
          } else {
            this.errorMessage = `Error ${err.status} while trying to login user ${this.user.value.nickname}: ${err.error}`;
          }
        }
      );
  }
}
