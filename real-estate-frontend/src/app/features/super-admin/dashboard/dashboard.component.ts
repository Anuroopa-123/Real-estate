    // FILE: src/app/features/super-admin/dashboard/dashboard.component.ts
    import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
    import { CommonModule }   from '@angular/common';
    import { RouterModule }   from '@angular/router';
    import { AdminService }   from '../../../core/services/admin.service';

    @Pipe({ name: 'roleLabel', standalone: true })
    export class RoleLabelPipe implements PipeTransform {
    transform(role: string): string {
        return { SUPER_ADMIN: 'Super Admin', ADMIN: 'Admin', AGENT: 'Agent', BUYER: 'Buyer' }[role] ?? role;
    }
    }

    @Component({
    selector: 'app-superadmin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, RoleLabelPipe],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    })
    export class DashboardComponent implements OnInit {
    stats: any = null;
    isLoading = true;
    greeting = '';
    today = '';

    constructor(private adminService: AdminService) {}

    ngOnInit() {
        const h = new Date().getHours();
        this.greeting = h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
        this.today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        this.adminService.getDashboardStats().subscribe({
        next: (res: any) => { this.stats = res.data; this.isLoading = false; },
        error: () => (this.isLoading = false),
        });
    }

    getPct(part: number, total: number): number {
        if (!total || !part) return 0;
        return Math.round((part / total) * 100);
    }

    roleClass(role: string): string {
        return { SUPER_ADMIN: 'super-admin', ADMIN: 'admin', AGENT: 'agent', BUYER: 'buyer' }[role] ?? '';
    }

    getAvatarBg(role: string): string {
        return {
        SUPER_ADMIN: 'rgba(155,109,255,0.15)',
        ADMIN:       'rgba(77,184,255,0.15)',
        AGENT:       'rgba(77,255,166,0.15)',
        BUYER:       'rgba(201,169,110,0.15)',
        }[role] ?? 'rgba(255,255,255,0.08)';
    }

    getLogClass(action: string): string {
        if (!action) return '';
        if (action.includes('CREATE') || action.includes('APPROVE')) return 'log-success';
        if (action.includes('DELETE') || action.includes('REJECT'))  return 'log-danger';
        return 'log-info';
    }
    }