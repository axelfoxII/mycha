import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authSvc:AuthService, private router:Router){

  }

  canActivate(): Promise<boolean> {

    return new Promise<boolean>(resolve => {

      this.authSvc.authActivate().then(res=>{

        if (!res) {

          this.router.navigateByUrl('/login');
          resolve(false)

        }else{

          resolve(true);
        }

      })

    })


  }

}
