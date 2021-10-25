import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthenticationService } from '../user/authentication.service';
import { Router } from '@angular/router';
import { PlayerService } from '../user/player.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {
  loggedInUser$ = this._authenticationService.user$;
  playerBalance$ = this._playerService.balance$;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
    private _authenticationService: AuthenticationService,
    private _playerService: PlayerService,
    private _router: Router
  ) {
    //_playerService.balance$.subscribe(newBalance => this.playerBalance$.next(newBalance));
  }

  logout() {
    this._authenticationService.logout();
  }
  login() {
    this._router.navigate(['/login']);
  }
}
