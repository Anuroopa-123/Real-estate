import { Injectable }  from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
 
@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = `${environment.apiUrl}/admin`;
 
  constructor(private http: HttpClient) {}
 
  // Dashboard
  getDashboardStats() { return this.http.get(`${this.base}/dashboard`); }
  getActivityLogs(params?: any) { return this.http.get(`${this.base}/activity-logs`, { params }); }
 
  // Users
  getUsers(filters: any) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params = params.set(k, v as string); });
    return this.http.get(`${this.base}/users`, { params });
  }
  getUserById(id: number)          { return this.http.get(`${this.base}/users/${id}`); }
  createUser(data: any)            { return this.http.post(`${this.base}/users`, data); }
  updateUser(id: number, data: any){ return this.http.put(`${this.base}/users/${id}`, data); }
  deleteUser(id: number)           { return this.http.delete(`${this.base}/users/${id}`); }
  toggleUserStatus(id: number)     { return this.http.patch(`${this.base}/users/${id}/toggle`, {}); }
 
  // Properties
  getProperties(filters: any) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params = params.set(k, v as string); });
    return this.http.get(`${this.base}/properties`, { params });
  }
  approveProperty(id: number)  { return this.http.patch(`${this.base}/properties/${id}/approve`, {}); }
  rejectProperty(id: number)   { return this.http.patch(`${this.base}/properties/${id}/reject`, {}); }
  deleteProperty(id: number)   { return this.http.delete(`${this.base}/properties/${id}`); }
 
  // Appointments
  getAppointments(filters?: any) {
    let params = new HttpParams();
    if (filters) Object.entries(filters).forEach(([k, v]) => { if (v) params = params.set(k, v as string); });
    return this.http.get(`${this.base}/appointments`, { params });
  }
  cancelAppointment(id: number, reason: string) {
    return this.http.patch(`${this.base}/appointments/${id}/cancel`, { reason });
  }
}
 