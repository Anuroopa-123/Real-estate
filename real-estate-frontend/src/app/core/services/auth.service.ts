import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router }     from '@angular/router';
import { environment } from '../../../../environment/environment';
 
@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/auth`;
 
  constructor(private http: HttpClient, private router: Router) {}
 
  login(data: any) { return this.http.post(`${this.base}/login`, data); }
 
  saveToken(token: string)     { localStorage.setItem('access_token', token); }
  saveRefresh(token: string)   { localStorage.setItem('refresh_token', token); }
  saveRole(role: string)       { localStorage.setItem('user_role', role); }
  getToken()                   { return localStorage.getItem('access_token'); }
  getRefreshToken()            { return localStorage.getItem('refresh_token'); }
  getUserRole()                { return localStorage.getItem('user_role'); }
 
  logout() {
    const refresh = this.getRefreshToken();
    if (refresh) this.http.post(`${this.base}/logout`, { refreshToken: refresh }).subscribe();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    this.router.navigate(['/login']);
  }
}
 