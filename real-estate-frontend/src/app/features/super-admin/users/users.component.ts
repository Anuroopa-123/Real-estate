import { Component, OnInit } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { AdminService }  from '../../../core/services/admin.service';
 
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users:   any[] = [];
  meta:    any   = {};
  isLoading = true;
  showModal = false;
  isEdit    = false;
 
  filters = { role: '', status: '', search: '' };
  page    = 1;
 
  form = { name: '', email: '', password: '', role: 'BUYER', status: 'ACTIVE', phone: '' };
  editId: number | null = null;
  formError = '';
  formLoading = false;
 
  roles = [
    { value: '',           label: 'All Roles' },
    { value: 'ADMIN',      label: 'Admin' },
    { value: 'AGENT',      label: 'Agent' },
    { value: 'BUYER',      label: 'Buyer' },
  ];
 
  constructor(private adminService: AdminService) {}
 
  ngOnInit() { this.load(); }
 
  load() {
    this.isLoading = true;
    this.adminService.getUsers({ page: this.page, limit: 10, ...this.filters }).subscribe({
      next: (res: any) => { this.users = res.data; this.meta = res.meta; this.isLoading = false; },
      error: () => (this.isLoading = false),
    });
  }
 
  applyFilters() { this.page = 1; this.load(); }
 
  openCreate() {
    this.isEdit = false;
    this.form   = { name: '', email: '', password: '', role: 'BUYER', status: 'ACTIVE', phone: '' };
    this.editId = null;
    this.formError = '';
    this.showModal = true;
  }
 
  openEdit(user: any) {
    this.isEdit    = true;
    this.editId    = user.id;
    this.form      = { name: user.name, email: user.email, password: '', role: user.role, status: user.status, phone: user.phone || '' };
    this.formError = '';
    this.showModal = true;
  }
 
  submitForm() {
    this.formLoading = true;
    this.formError   = '';
    const obs = this.isEdit
      ? this.adminService.updateUser(this.editId!, this.form)
      : this.adminService.createUser(this.form);
 
    obs.subscribe({
      next: () => { this.showModal = false; this.formLoading = false; this.load(); },
      error: (err: any) => { this.formError = err?.error?.message || 'Something went wrong'; this.formLoading = false; },
    });
  }
 
  toggleStatus(user: any) {
    this.adminService.toggleUserStatus(user.id).subscribe(() => this.load());
  }
 
  deleteUser(user: any) {
    if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    this.adminService.deleteUser(user.id).subscribe(() => this.load());
  }
 
  changePage(p: number) { this.page = p; this.load(); }
  get pages() { return Array.from({ length: this.meta.pages || 1 }, (_, i) => i + 1); }
 
  roleClass(role: string) {
    return { SUPER_ADMIN: 'super-admin', ADMIN: 'admin', AGENT: 'agent', BUYER: 'buyer' }[role] || '';
  }
}
 
 