import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';

import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ListaVideosModel } from 'src/app/models/listaVideos.model';
import { VideosService } from 'src/app/services/videos.service';


import Swal from 'sweetalert2';
import { VideoModel } from 'src/app/models/video.model';
import { FormBuilder, Validators } from '@angular/forms';
import { VistasModel } from 'src/app/models/vistas.model';

declare const $:any

@Component({
  selector: 'app-subir-videos',
  templateUrl: './subir-videos.component.html',
  styleUrls: ['./subir-videos.component.css']
})
export class SubirVideosComponent implements OnInit, AfterViewInit {


  displayedColumns: string[] = ['vistas','imagen', 'nombre', 'videos', 'actions'];
  dataSource = new MatTableDataSource();
  listVideos:any[]=[];
  listSelect:any;
  videos:any =[];
  titulos:any =[];
  mostrarVistas:VistasModel[]=[];
  cantidad:any=[];
  imagen:any;
  imgURL = '../../../assets/image/noimage.png';
  imgenUrl:any;
  file:any;
  cambioImg=false;
  verificaVideo=false;

  idLista='';
  idVista:any;
  arrayNuevo:any=[];


  @ViewChild(MatPaginator,{static:true}) paginator!:MatPaginator;
  @ViewChild('pagination') set pagination(pager:MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = "Items por pagina";
      this.dataSource.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 à ${length }`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        // If the start index exceeds the list length, do not try and fix the end index to the end.
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };



    }
  }
  @ViewChild(MatSort,{static:true}) sort!:MatSort;



  listaForm=this.fb.group({
    id:[''],
    nombre:['', [Validators.required]],
    descripcion:['',[Validators.required]],
    url_miniatura:[''],
    recursos:['',[Validators.required]],
    createAt:[''],

  })

  videosForm=this.fb.group({
    id:[''],
    idVideo:['',[Validators.required]],
    titulo:['', [Validators.required]],
    idListaVideos:[''],
    orden:['']
  })


  constructor(private videoSvc: VideosService, private fb:FormBuilder) {}

  ngOnInit(){
    this.listaVideos();

  }

  ngAfterViewInit(){

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  applyFilter(filterValue: string) {

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  listaVideos(){


    this.videoSvc.getListaVideos().subscribe((res:any)=>{

      this.dataSource.data = res;




    });

  }


  obtenerVideos(id:any){

    this.verificaVideo=false;

    this.videoSvc.obtenerVideosLista(id).subscribe((res:any)=>{

      if (res.length > 0) {
      this.verificaVideo=true;
      this.titulos = res;

      }else{

        $('#obVideos').toggle();

        Swal.fire({
          title:'NO HAY VIDEOS EN LISTA',
          text:'Agregue videos a la lista',
          icon: 'info',
          confirmButtonText:'Aceptar'
        }).then((result) => {
          if (result) {

           location.reload();

          }
        })

      }


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

        this.cambioImg=true;
      }


    }else{

      this.imgURL;


    }

  }

  registrarLista(){

    let lista={
      nombre:this.listaForm.value.nombre,
      descripcion:this.listaForm.value.descripcion,
      recursos:this.listaForm.value.recursos,
      createAt:Date.now(),

    };

    const data = new FormData();

    data.append('file', this.imagen);
    data.append('upload_preset', 'proyecto-canal');
    data.append('cloud_name', 'dx7nhv75h');



    this.videoSvc.cargarLista(lista, data );

  }


  obtenerListaId(id: string){


    this.videoSvc.getListaId(id).subscribe((res:ListaVideosModel)=>{

      this.obteneridVista(res.nombre);

      if (!this.cambioImg) {

        this.listaForm.setValue({
          id:id,
          nombre:res.nombre,
          descripcion:res.descripcion,
          url_miniatura:res.url_miniatura,
          recursos:res.recursos,
          createAt:res.createAt,


        })

        this.imgenUrl= res.url_miniatura
      }else{
        this.cambioImg=true;
        this.imgURL

      }




    })

  }


  obteneridVista(nombre_lista:any){

    this.videoSvc.getVistaNombre(nombre_lista).subscribe((res:any)=>{

      this.idVista=res[0].id;

      console.log(this.idVista);



    })

  }


  editarLista(){

    if (!this.cambioImg) {

      let listaVid={

        id:this.listaForm.value.id,
        nombre:this.listaForm.value.nombre,
        descripcion:this.listaForm.value.descripcion,
        url_miniatura:this.listaForm.value.url_miniatura,
        recursos:this.listaForm.value.recursos,
        createAt:this.listaForm.value.createAt,


      }

      this.videoSvc.editarLista(listaVid, null)
      this.videoSvc.editarVista(this.idVista, listaVid.nombre).subscribe();


    }else{

      let listaVid2={

        id:this.listaForm.value.id,
        nombre:this.listaForm.value.nombre,
        descripcion:this.listaForm.value.descripcion,
        recursos:this.listaForm.value.recursos,
        createAt:this.listaForm.value.createAt,



      }

      const data = new FormData();

    data.append('file', this.imagen);
    data.append('upload_preset', 'proyecto-canal');
    data.append('cloud_name', 'dx7nhv75h');


    this.videoSvc.editarVista(this.idVista, listaVid2.nombre).subscribe();
    this.videoSvc.editarLista(listaVid2, data);


    }

  }


  listaId(id:string) {

    this.idLista=id

  }

  registrarVideo(){

    let subirVideo:VideoModel={

    id_video:this.videosForm.value.idVideo,
    titulo:this.videosForm.value.titulo,
    lista_videos:this.idLista,
    orden:this.videosForm.value.orden,

    }

    this.videoSvc.agregarVideo(subirVideo)

  }


  eliminaLista(id:string) {

    this.videoSvc.getListaId(id).subscribe((resp:ListaVideosModel)=>{

      this.obteneridVista(resp.nombre);

    })

    this.videoSvc.verificaListaVideos(id).subscribe(res=>{

      if(res!.length > 0){

        Swal.fire('Error','Debe eliminar los videos de la lista','error')

      }else{
        Swal.fire({
          icon:'question',
          title:'Desea Eliminar la lista',
          text:'Se eliminar el registro?',
          showCancelButton: true,
          cancelButtonText:'Cancelar',
          confirmButtonText:'Aceptar',
          allowOutsideClick:false
        }).then((result)=>{
          if(result.isConfirmed){

            this.videoSvc.eliminarVista(this.idVista).subscribe();

            this.videoSvc.eliminarLista(id).subscribe(res=>{
              Swal.fire({
                icon: 'success',
                title:'Exito',
                text: 'Las lista fue eliminada correctamente',
                confirmButtonText:'Aceptar'
              }).then((result) => {
                if (result){
                  location.reload();
                }
              })
            })

          }
        })

      }

    })

  }

  eliminarVideo(id: string){



    Swal.fire({
      icon:'question',
      title:'Desea Eliminar el video?',
      text:'Se eliminar de la base de datos',
      showCancelButton: true,
      cancelButtonText:'Cancelar',
      confirmButtonText:'Aceptar',
      allowOutsideClick:false
    }).then((result)=>{


      if (result.isConfirmed) {



        this.videoSvc.eliminarVideo(id).subscribe(res=>{

          Swal.fire({
            icon: 'success',
            title:'Exito',
            text: 'El video fue eliminado correctamente',
            confirmButtonText:'Aceptar'
          }).then((result) => {
            if (result){
              location.reload();
            }
          })

        })

      }


    })

  }



  cantidadVistas(nombre:string){

    this.videoSvc.getVistaNombre(nombre).subscribe((res:any)=>{

      this.cantidad = res[0].cantidad;
      Swal.fire({

        title:`El tutorial tiene "${this.cantidad}" vistas`

      })
    })


  }

  close(){
    location.reload();
  }






}
