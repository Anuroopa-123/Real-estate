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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email = '';
  password = '';
  showPass = false;
  rememberMe = false;
  isLoading = false;
  errorMsg = '';

  emailFocused = false;
  passFocused = false;

  selectedRole = 'BUYER';

  roles: Role[] = [
    {
      value: 'SUPER_ADMIN',
      label: 'Super Admin',
      icon: '🛡️',
      description: 'Full system control — manage admins, monitor platform, configure settings.',
      route: '/superadmin/dashboard'
    },
    {
      value: 'ADMIN',
      label: 'Admin',
      icon: '⚙️',
      description: 'Approve properties, manage agents and oversee appointments.',
      route: '/admin/dashboard'
    },
    {
      value: 'AGENT',
      label: 'Agent',
      icon: '🏠',
      description: 'List properties, track leads and manage assigned appointments.',
      route: '/agent/dashboard'
    },
    {
      value: 'BUYER',
      label: 'Buyer',
      icon: '🔑',
      description: 'Explore premium listings, save favorites and book viewings.',
      route: '/buyer/dashboard'
    }
  ];

  get activeRole(): Role | undefined {
    return this.roles.find(r => r.value === this.selectedRole);
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  selectRole(role: string): void {
    this.selectedRole = role;
    this.errorMsg = '';
  }

  login(): void {
    if (!this.email || !this.password) {
      this.errorMsg = 'Please enter your email and password.';
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';

    const payload = { email: this.email, password: this.password };

    this.authService.login(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        const token = res.data.token;
        const role: string = res.data.user.role;

        this.authService.saveToken(token);

        // Role-based redirect
        const matchedRole = this.roles.find(r => r.value === role);

        if (matchedRole) {
          // Guard: ensure selected UI role matches server-returned role
          if (role !== this.selectedRole) {
            this.errorMsg = `Access denied. You are registered as ${matchedRole.label}.`;
            this.authService.logout();
            return;
          }
          this.router.navigate([matchedRole.route]);
        } else {
          this.errorMsg = 'Unknown role. Please contact support.';
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = err?.error?.message || 'Invalid credentials. Please try again.';
      }
    });
  }
}