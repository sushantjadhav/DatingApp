import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = 'https://localhost:5001/api/';

  private currentUserSubject = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((responce: User) => {
        const user = responce;
        if (user) {
          this.currentUserSubject.next(user);
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
    );
  }

  logout() {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
  }

  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
  }

  register(model: any) {
    return this.http
      .post(this.baseUrl + 'account/register', model)
      .pipe(map((user: User) => this.currentUserSubject.next(user)));
  }
}
