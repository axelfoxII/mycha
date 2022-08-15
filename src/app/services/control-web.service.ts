import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PortadaModel } from '../models/portada.model';
import Swal from 'sweetalert2';

const SERVER = environment.urlServer;
const CLOUDINARY = environment.apiCloudinary;

@Injectable({
  providedIn: 'root'
})
export class ControlWebService {

  token: any;
  imgPortada:any

  constructor(private http: HttpClient) { }

getPortada(){

  return this.http.get(`${SERVER}/portada/-N9ADEqmmJhn1H2ptiav.json`)


}

editPortada(data:PortadaModel, imagenData:any){

  this.token = localStorage.getItem('idToken');

  this.http.post(`${CLOUDINARY}/dx7nhv75h/image/upload`, imagenData)
      .subscribe((res) => {
        this.imgPortada = res;

        let portadaData = {
          descripcion: data.descripcion,
          imagen: this.imgPortada.secure_url,

        };

        this.http.put(`${SERVER}/portada/-N9ADEqmmJhn1H2ptiav.json?auth=${JSON.parse(this.token)}`,portadaData).subscribe(res=>{
          Swal.fire({
            icon:'success',
            title:'EXITO',
            text:'Los datos se subieron correctamente',
            confirmButtonText: 'Aceptar'
          }).then((result) => {
            if (result) {
              location.reload();
            }
          })
        })

      });



}

}
