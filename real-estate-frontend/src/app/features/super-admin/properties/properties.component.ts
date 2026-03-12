import { Component, OnInit } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { AdminService }  from '../../../core/services/admin.service';
 
@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.css',
})
export class PropertiesComponent implements OnInit {
  properties: any[] = [];
  meta:        any  = {};
  isLoading  = true;
  filters    = { status: '', city: '', search: '' };
  page       = 1;
 
  constructor(private adminService: AdminService) {}
 
  ngOnInit() { this.load(); }
 
  load() {
    this.isLoading = true;
    this.adminService.getProperties({ page: this.page, limit: 10, ...this.filters }).subscribe({
      next: (res: any) => { this.properties = res.data; this.meta = res.meta; this.isLoading = false; },
      error: () => (this.isLoading = false),
    });
  }
 
  approve(id: number) { this.adminService.approveProperty(id).subscribe(() => this.load()); }
  reject(id: number)  { this.adminService.rejectProperty(id).subscribe(() => this.load()); }
  delete(id: number)  {
    if (!confirm('Delete this property?')) return;
    this.adminService.deleteProperty(id).subscribe(() => this.load());
  }
 
  changePage(p: number) { this.page = p; this.load(); }
  get pages() { return Array.from({ length: this.meta.pages || 1 }, (_, i) => i + 1); }
}