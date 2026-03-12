import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

interface Role {
  value: string;
  label: string;
  icon: string;
  description: string;
  route: string;
}
interface RoleConfig {
  value: string; label: string; icon: string; description: string; route: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
 email = ''; password = '';
  showPass = false; rememberMe = false;
  isLoading = false; errorMsg = '';
  emailFocused = false; passFocused = false;
  selectedRole = 'BUYER';
 
  roles: RoleConfig[] = [
    { value: 'SUPER_ADMIN', label: 'Super Admin', icon: '🛡️',
      description: 'Full system control — manage admins, monitor platform.',
      route: '/superadmin/dashboard' },
    { value: 'ADMIN',  label: 'Admin',  icon: '⚙️',
      description: 'Approve properties, manage agents and appointments.',
      route: '/admin/dashboard' },
    { value: 'BUYER',  label: 'Buyer',  icon: '🔑',
      description: 'Explore listings, save favourites and book viewings.',
      route: '/buyer/dashboard' },
  ];
 
  get activeRole() { return this.roles.find(r => r.value === this.selectedRole); }
 
  constructor(private authService: AuthService, private router: Router) {}
 
  selectRole(role: string) { this.selectedRole = role; this.errorMsg = ''; }
 
  login() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Please enter your email and password.';
      return;
    }
    this.isLoading = true;
    this.errorMsg  = '';
 
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const role: string = res.data.user.role;
 
        // Guard: UI-selected role must match server role
        if (role !== this.selectedRole) {
          this.errorMsg = `You are registered as ${role.replace('_', ' ')}.`;
          this.authService.logout();
          return;
        }
 
        const matched = this.roles.find(r => r.value === role);
        if (matched) this.router.navigate([matched.route]);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = err?.error?.message || 'Invalid credentials.';
      }
    });
  }
}