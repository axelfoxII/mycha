import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario:UsuarioModel;

  loginForm = this.fb.group({
    email:['', Validators.required],
    password:['', Validators.required]
  })

  constructor(private authSvc:AuthService, private fb:FormBuilder, private router:Router) {
    this.usuario = new UsuarioModel();
  }

  ngOnInit(): void {
    localStorage.removeItem('idToken');
  }

  onLogin(){
    if (this.loginForm.value.email && this.loginForm.value.password) {

      let user = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
        returnSecureToken:true

      }
      this.authSvc.LoginAuth(user).subscribe({
        next:(res:UsuarioModel)=>{
          this.usuario.returnSecureToken=true;

          let today = new Date();
          today.setSeconds(Number(res.expiresIn));

          localStorage.setItem('idToken', JSON.stringify(res.idToken));
          localStorage.setItem('expiresIn', today.getTime().toString());
          this.router.navigateByUrl('/home');
        },
        error:err=>{
          this.usuario.returnSecureToken=false;
          Swal.fire({
            icon:'error',
            title:'ERROR',
            text:err.error.error.message,
            allowOutsideClick:false
          })

        }

      })

    }else{
      Swal.fire('ERROR', 'Debe llenar todos los campos', 'error');
    }
  }

}
