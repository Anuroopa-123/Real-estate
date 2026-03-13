import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
    selector:'app-agent-dashboard',
    standalone:true,
    imports:[CommonModule,FormsModule],
    templateUrl:'./agent-dashboard.component.html',
    styleUrl:'./agent-dashboard.component.css'
})
export class AgentDashboard{
    
}