// FILE: src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router }     from '@angular/router';
import { tap }        from 'rxjs/operators';
import { environment } from '../../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {}

  login(data: any) {
    return this.http.post(`${this.base}/login`, data).pipe(
      tap((res: any) => {
        if (res?.data?.token) {
          this.saveToken(res.data.token);
          this.saveRole(res.data.user.role);
          if (res.data.refreshToken) this.saveRefresh(res.data.refreshToken);
        }
      })
    );
  }

  saveToken(token: string)   { localStorage.setItem('access_token', token); }
  saveRefresh(token: string) { localStorage.setItem('refresh_token', token); }
  saveRole(role: string)     { localStorage.setItem('user_role', role); }

  getToken()       { return localStorage.getItem('access_token'); }
  getRefreshToken(){ return localStorage.getItem('refresh_token'); }
  getUserRole()    { return localStorage.getItem('user_role'); }

  isLoggedIn()     { return !!this.getToken(); }

  logout() {
    const refresh = this.getRefreshToken();
    if (refresh) {
      this.http.post(`${this.base}/logout`, { refreshToken: refresh }).subscribe();
    }
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}