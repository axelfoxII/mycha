import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PortadaModel } from 'src/app/models/portada.model';
import { ControlWebService } from 'src/app/services/control-web.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-control-web',
  templateUrl: './control-web.component.html',
  styleUrls: ['./control-web.component.css']
})
export class ControlWebComponent implements OnInit {

  imagen:any;
  imgURL = '../../../assets/image/noimage.png';
  imgenUrl:any;
  file:any;
  datosPortada:any={};



  portadaForm=this.fb.group({
    id:[''],
    descripcion:['',[Validators.required]],
    imagen:[''],

  })

  constructor(private portadaScv:ControlWebService, private fb:FormBuilder) { }

  ngOnInit(): void {

    this.portadaScv.getPortada().subscribe((res:PortadaModel)=>{
      this.datosPortada={
        id:res.id,
        descripcion:res.descripcion,
        imagen:res.imagen

      }
      console.log(res)
    })

  }

  selectChange(event:any){

    if (event.target.files.length > 0) {

      this.file = event.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(this.file[0]);
      reader.onloadend = (event:any)=>{

        this.imgURL = event.target.result;

        this.imagen=this.file[0];


      }


    }else{

      this.imgURL;


    }

  }

  portada(){

    if (this.portadaForm.value.descripcion && this.portadaForm.value.imagen) {
      let dataPortada={

        id:this.datosPortada.id,
        descripcion:this.portadaForm.value.descripcion,

      }

      const data = new FormData();

      data.append('file', this.imagen);
      data.append('upload_preset', 'portada');
      data.append('cloud_name', 'dx7nhv75h');

      this.portadaScv.editPortada(dataPortada, data );

    }else{
      Swal.fire({
        icon: 'info',
        title: 'DEBE LLENAR TODOS LOS CAMPOS',
        confirmButtonText:'Aceptar'
      }).then((result) => {
        if (result) {
          this.portadaForm.reset();
          this.imgURL = '../../../assets/image/noimage.png';

        }
      })
    }




  }



}
