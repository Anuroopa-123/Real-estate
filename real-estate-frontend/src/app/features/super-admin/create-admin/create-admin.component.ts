// FILE: src/app/features/super-admin/create-admin/create-admin.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-create-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-admin.component.html',
  styleUrl: './create-admin.component.css',
})
export class CreateAdminComponent {
  form = {
    name: '', email: '', phone: '',
    password: '', confirmPassword: '',
    role: 'ADMIN', status: 'ACTIVE'
  };

  showPass    = false;
  isLoading   = false;
  errorMsg    = '';
  successMsg  = '';

  nameFocus  = false; emailFocus = false;
  phoneFocus = false; passFocus  = false; conf2Focus = false;

  get strength(): number {
    const p = this.form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)          s++;
    if (/[A-Z]/.test(p))        s++;
    if (/[0-9]/.test(p))        s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }

  get strengthLabel(): string {
    return ['', 'Weak', 'Fair', 'Good', 'Strong'][this.strength] ?? '';
  }

  isValid(): boolean {
    return !!(this.form.name && this.form.email && this.form.password &&
      this.form.password === this.form.confirmPassword && this.form.password.length >= 8);
  }

  constructor(private adminService: AdminService) {}

  createAdmin() {
    if (!this.isValid()) return;
    this.isLoading = true; this.errorMsg = ''; this.successMsg = '';

    const payload = {
      name: this.form.name, email: this.form.email,
      phone: this.form.phone, password: this.form.password,
      role: 'ADMIN', status: this.form.status
    };

    this.adminService.createUser(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMsg = `Admin account created successfully for ${this.form.name}!`;
        this.resetForm();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMsg = err?.error?.message || 'Failed to create admin. Please try again.';
      }
    });
  }

  resetForm() {
    this.form = { name:'', email:'', phone:'', password:'', confirmPassword:'', role:'ADMIN', status:'ACTIVE' };
    this.errorMsg = '';
  }
}