import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastrService: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // let errorMessage: string;

        // if (error.error instanceof ErrorEvent) {
        //   errorMessage = 'Error message: ' + error.error.message;
        // } else {
        //   errorMessage = error.status + ': ' + error.message;
        // }
        // this.toastrService.error(errorMessage);
        // return throwError(errorMessage);

        if (error) {
          switch (error.status) {
            case 400:
              if (error.error.errors) {
                const modalStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modalStateErrors.push(error.error.errors[key]);
                  }
                }
                throw modalStateErrors.flat();
              } else {
                this.toastrService.error(error.error, error.status.toString());
              }
              break;
            case 401:
              this.toastrService.error(error.error, error.status.toString());
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: error.error },
              };
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.router.navigateByUrl('Something unexpected went wrong');
              break;
          }
        }
        console.log(error);
        return throwError(error);
      })
    );
  }
}
