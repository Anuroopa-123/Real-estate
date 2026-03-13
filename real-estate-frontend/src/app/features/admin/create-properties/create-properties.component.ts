import { Component } from "@angular/core";
import { AdminService } from "../../../core/services/admin.service";
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
@Component({
    selector:'app-create-properties',
    standalone:true,
    imports:[CommonModule,FormsModule],
    templateUrl:'./create-properties.component.html',
    styleUrl:'./create-properties.component.css'
})
export class CreatePropertiesComponent{
    isLoading = false;
  successMsg = '';
  errorMsg = '';

  property = {
    title: '',
    description: '',
    price: '',
    city: '',
    address: '',
    category_id: ''
  };

  categories = [
    { id: 1, name: 'Apartment' },
    { id: 2, name: 'Villa' },
    { id: 3, name: 'Plot' },
    { id: 4, name: 'Commercial' }
  ];

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  createProperty() {

    if (!this.property.title || !this.property.price || !this.property.category_id) {
      this.errorMsg = "Title, Price and Category are required";
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.adminService.createProperty(this.property).subscribe({

      next: () => {

        this.successMsg = "Property created successfully!";
        this.isLoading = false;

        setTimeout(()=>{
          this.router.navigate(['/superadmin/properties']);
        },1000)

      },

      error: (err) => {

        this.errorMsg = err?.error?.message || "Failed to create property";
        this.isLoading = false;

      }

    });

  }
}