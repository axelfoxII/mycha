import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UsuarioModel } from '../models/usuario.model';

const SERVER = environment.urlServer;
const AUTH = environment.urlLogin;
const GETUSERDATA = environment.getUserData;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  LoginAuth(usuario:UsuarioModel){

    return this.http.post(`${AUTH}`, usuario);

  }



  authActivate(){

    return new Promise(resolve=>{

      let tokenID= localStorage.getItem('idToken')

      if (tokenID) {

        let body ={
          idToken:JSON.parse(tokenID),
        }

        this.http.post(`${GETUSERDATA}`, body).subscribe({

          next:(res)=>{

            if (localStorage.getItem('expiresIn')) {

              let expiresIn = Number(localStorage.getItem('expiresIn'));

              let expiresDate = new Date();

              expiresDate.setTime(expiresIn);

              if (expiresDate > new Date()) {
                resolve(true);
              }else{
                localStorage.removeItem('idToken');
                localStorage.removeItem('expiresIn');
                resolve(false);
              }

            }else{
              localStorage.removeItem('idToken');
              localStorage.removeItem('expiresIn');
              resolve(false);
            }


            resolve(true);
          },
          error:(err)=>{
            localStorage.removeItem('idToken');
            localStorage.removeItem('expiresIn');
            resolve(false);
          }

        })

      }else{
        localStorage.removeItem('idToken');
        localStorage.removeItem('expiresIn');
        resolve(false);
      }

    })


  }



}
