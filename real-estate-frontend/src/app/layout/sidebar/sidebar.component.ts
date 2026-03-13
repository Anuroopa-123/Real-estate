import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SIDEBAR_MENU, UserRole } from './sidebar.config';

@Component({
selector:'app-sidebar',
standalone:true,
imports:[CommonModule,RouterModule],
templateUrl:'./sidebar.component.html',
styleUrl:'./sidebar.component.css'
})
export class SidebarComponent{

role = (localStorage.getItem("user_role") || '') as UserRole;

menu = SIDEBAR_MENU[this.role] || [];

}