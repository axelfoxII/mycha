import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';

import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { VideosService } from 'src/app/services/videos.service';


import Swal from 'sweetalert2';
import { VideoModel } from 'src/app/models/video.model';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements  OnInit, AfterViewInit {

  displayedColumns: string[] = ['titulo', 'id_video', 'actions'];
  dataSource = new MatTableDataSource();

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

  videosForm=this.fb.group({
    id:[''],
    idVideo:['',[Validators.required]],
    titulo:['', [Validators.required]],
    lista_videos:[''],
    orden:['']
  })

  constructor(private videoSvc: VideosService, private fb:FormBuilder) { }



  ngOnInit(){
    this.videosAll();
  }

  ngAfterViewInit(){

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  applyFilter(filterValue: string) {

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  videosAll(){

    this.videoSvc.getAllVideos().subscribe((res:any)=>{
      this.dataSource.data = res;

    })
  }

  obtenerVideo(id:string){

    this.videoSvc.getVideoId(id).subscribe((res:VideoModel)=>{

      this.videosForm.setValue({
        id:id,
        idVideo:res.id_video,
        titulo:res.titulo,
        lista_videos:res.lista_videos,
        orden:res.orden,

      })

    })

  }

  eliminarVideo(id: string){
    Swal.fire({
      icon:'question',
      title:'Desea Eliminar el video',
      text:'Se eliminar el registro',
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

  editarVideo(){

    let videoEdit: VideoModel={

      id:this.videosForm.value.id,
      id_video:this.videosForm.value.idVideo,
      titulo:this.videosForm.value.titulo,
      lista_videos:this.videosForm.value.lista_videos,
      orden:this.videosForm.value.orden,

    }


    this.videoSvc.editarVideo(videoEdit);

  }



}
