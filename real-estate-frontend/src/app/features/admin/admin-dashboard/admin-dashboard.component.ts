import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
    selector:'app-admin-dashboard',
    standalone:true,
    imports:[CommonModule,FormsModule],
    templateUrl:'./admin-dashboard.component.html',
    styleUrl:'./admin-dashboard.component.css'
})

export class AdminDashboardComponent{
    
}