import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { RouterModule }      from '@angular/router';
import { AdminService }      from '../../../core/services/admin.service';

 
@Component({
  selector: 'app-superadmin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  isLoading = true;
 
  constructor(private adminService: AdminService) {}
 
  ngOnInit() {
    this.adminService.getDashboardStats().subscribe({
      next: (res: any) => {
        this.stats = res.data;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }
    getPct(part: number, total: number): number {
    if (!total || !part) return 0;
    return Math.round((part / total) * 100);
  }
}