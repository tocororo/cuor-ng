import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShowErrorService } from '../_services/show-error.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnDestroy {

  @Input() title: string; //an optional title if not is blankc
  @Input() status: string; //the number of the error
  @Input() message: string; //error description , what was the problem or error

  subscription: Subscription;

  constructor(
    private router: Router,
    private errorService: ShowErrorService
    ) {
    // subscribe to error component service
    this.subscription = this.errorService.getErrors().subscribe(error => {
      console.log(" antes de comprobar ", error);

      if (error) {
        this.title = error.title;
        this.status = error.status;
        this.message = error.message;
        console.log("error entrado a ver si llega ", this.title, this.status, this.message);

      } else {
        // with errors then redirecting to home page
        this.router.navigate(['/']);
      }
    });

  }

  ngOnDestroy(){
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
    this.router.navigate(['/']);
  }

}
