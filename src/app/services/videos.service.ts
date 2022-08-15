import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListaVideosModel } from '../models/listaVideos.model';
import { VideoModel } from '../models/video.model';
import Swal from 'sweetalert2';
import { VistasModel } from '../models/vistas.model';

const SERVER = environment.urlServer;
const CLOUDINARY = environment.apiCloudinary;

@Injectable({
  providedIn: 'root',
})
export class VideosService {
  imagenListUrl: any;
  token: any;
  vistaLista: any;

  constructor(private http: HttpClient) { }

  getListaVideos() {
    return this.http.get(`${SERVER}/lista_videos.json`).pipe(map(this.arreglo));
  }

  private arreglo(listasObj: any) {
    const listas: ListaVideosModel[] = [];
    if (listasObj === null) {
      return null;
    }

    for (let registro in listasObj) {
      listasObj[registro].id = registro;
      listas.push(listasObj[registro]);
    }

    return listas;
  }

  getVistas() {
    return this.http.get(`${SERVER}/vistas.json`).pipe(map(this.arregloVistas));
  }


  private arregloVistas(vistasObj: any) {
    const vistas: VistasModel[] = [];
    if (vistasObj === null) {
      return null;
    }

    for (let registro in vistasObj) {
      vistasObj[registro].id = registro;
      vistas.push(vistasObj[registro]);
    }

    return vistas;
  }

  getAllVideos() {
    return this.http
      .get(`${SERVER}/videos.json`)
      .pipe(map(this.arregloAllVideos));
  }

  private arregloAllVideos(videosObj: any) {
    const videos: VideoModel[] = [];
    if (videosObj === null) {
      return null;
    }

    for (let registro in videosObj) {
      videosObj[registro].id = registro;
      videos.push(videosObj[registro]);
    }

    return videos;
  }

  getVideoId(id: any) {
    return this.http.get(`${SERVER}/videos/${id}.json`);
  }

  getListaId(id: any) {
    return this.http.get(`${SERVER}/lista_videos/${id}.json`);
  }

  getVistaNombre(nombreLista: any) {


    let vistaListaNombre = nombreLista?.replace(/ /g, "");
    return this.http.get(`${SERVER}/vistas.json?orderBy="nombre_lista"&equalTo="${vistaListaNombre}"&print=pretty`).pipe(map(this.arregloNombre));
  }

  private arregloNombre(nombreObj: any) {
    const nombre: VistasModel[] = [];

    for (let registro in nombreObj) {
      nombreObj[registro].id = registro;
      nombre.push(nombreObj[registro]);
    }

    return nombre;
  }


  getVistaId(id: any) {

    return this.http.get(`${SERVER}/vistas/${id}.json`);

  }


  obtenerVideosLista(id: any) {
    return this.http
      .get(
        `${SERVER}/videos.json?orderBy="lista_videos"&startAt="${id}"&endAt="${id}"&print=pretty`
      )
      .pipe(map(this.arregloVideos));
  }

  private arregloVideos(videosObj: any) {
    const videos: VideoModel[] = [];
    if (videosObj === null) {
      return null;
    }

    for (let registro in videosObj) {
      videosObj[registro].id = registro;
      videos.push(videosObj[registro]);
    }

    return videos;
  }



  cargarLista(lista: ListaVideosModel, imagen: any) {

    var nombreVista = lista.nombre?.replace(/[ñáéíóú ]/g, '');

    this.vistaLista = {
      nombre_lista: nombreVista,
      cantidad: '0'

    }

    this.agregarVista(this.vistaLista);


    this.http
      .post(`${CLOUDINARY}/dx7nhv75h/image/upload`, imagen)
      .subscribe((res) => {
        this.imagenListUrl = res;

        let listData = {
          id: lista.id,
          nombre: lista.nombre,
          descripcion: lista.descripcion,
          url_miniatura: this.imagenListUrl.secure_url,
          recursos: lista.recursos,
          createAt:lista.createAt

        };
        this.agregarLista(listData);
      });
  }

  agregarLista(lista: ListaVideosModel) {
    this.token = localStorage.getItem('idToken');

    return this.http
      .post(`${SERVER}/lista_videos.json?auth=${JSON.parse(this.token)}`, lista)
      .subscribe((res) => {


        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'El registro se subio correctamente',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.value) {
            location.reload();
          }
        });
      });
  }

  agregarVista(vista: VideoModel) {


    return this.http.post(`${SERVER}/vistas.json`, vista).subscribe(res => {

      console.log(res);

    })


  }

  editarVista(id: string, nombre: string) {

    let lista_nombre = {
      nombre_lista: nombre?.replace(/ /g, '')
    };

    console.log(lista_nombre.nombre_lista)

    return this.http.patch(`${SERVER}/vistas/${id}.json`, lista_nombre)


  }

  editarLista(lista: ListaVideosModel, imagen: any) {
    if (imagen === null) {
      this.token = localStorage.getItem('idToken');
      this.http
        .put(
          `${SERVER}/lista_videos/${lista.id}.json?auth=${JSON.parse(
            this.token
          )}`,
          lista
        )
        .subscribe((res) => {
          Swal.fire({
            icon: 'success',
            title: 'Exito',
            text: 'El registro se actualizo correctamente',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
          }).then((result) => {
            if (result.value) {
              location.reload();
            }
          });
        });
    } else {
      this.http
        .post(`${CLOUDINARY}/dx7nhv75h/image/upload`, imagen)
        .subscribe((res) => {
          this.imagenListUrl = res;

          let listData = {
            nombre: lista.nombre,
            descripcion: lista.descripcion,
            url_miniatura: this.imagenListUrl.secure_url,
            recursos: lista.recursos,
            createAt:lista.createAt

          };

          this.token = localStorage.getItem('idToken');
          this.http
            .put(
              `${SERVER}/lista_videos/${lista.id}.json?auth=${JSON.parse(
                this.token
              )}`,
              listData
            )
            .subscribe((res) => {
              Swal.fire({
                icon: 'success',
                title: 'Exito',
                text: 'El registro se actualizo correctamente',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false,
              }).then((result) => {
                if (result.value) {
                  location.reload();
                }
              });
            });
        });
    }
  }

  agregarVideo(video: VideoModel) {
    this.token = localStorage.getItem('idToken');

    return this.http
      .post(`${SERVER}/videos.json?auth=${JSON.parse(this.token)}`, video)
      .subscribe((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'El video se subio correctamente',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.value) {
            location.reload();
          }
        });
      });
  }

  verificaListaVideos(id: any) {
    return this.http
      .get(
        `${SERVER}/videos.json?orderBy="lista_videos"&startAt="${id}"&endAt="${id}"&print=pretty`
      )
      .pipe(map(this.arregloVideos));
  }

  eliminarLista(id: any) {
    this.token = localStorage.getItem('idToken');
    return this.http.delete(
      `${SERVER}/lista_videos/${id}.json?auth=${JSON.parse(this.token)}`
    );
  }

  editarVideo(video: VideoModel) {
    this.token = localStorage.getItem('idToken');
    this.http
      .put(
        `${SERVER}/videos/${video.id}.json?auth=${JSON.parse(this.token)}`,
        video
      )
      .subscribe((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'El video se actualizo correctamente',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.value) {
            location.reload();
          }
        });
      });
  }


  eliminarVideo(id: any) {
    this.token = localStorage.getItem('idToken');
    return this.http.delete(
      `${SERVER}/videos/${id}.json?auth=${JSON.parse(this.token)}`
    );
  }

  eliminarVista(id: string) {

    return this.http.delete(`${SERVER}/vistas/${id}.json`);


  }
}
