import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {

  email = "";
  password = "";

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(){

    const payload = {
      email: this.email,
      password: this.password
    };

    this.authService.login(payload).subscribe((res:any)=>{

      const token = res.data.token;
      const role = res.data.user.role;

      this.authService.saveToken(token);

      if(role === "SUPER_ADMIN"){
        this.router.navigate(['/superadmin/dashboard']);
      }

    });

  }

}