import React,{ Component } from 'react';
import {compareImgs} from './compareImgs.jsx';

const originalMessi = '/assets/messi_original.small.jpeg';
const arrayMessi = [
{
  url: "/assets/messi_bocha.small.jpeg",
  texto: 'bocha'
},
{
  url: "assets/messi_cuerpo.small.jpeg",
  texto: 'messi'
},
{
  url: "assets/messi_fondo.small.jpeg",
  texto: 'fondo'
}
];
const originalJugadores = '/assets/procesada_photoshop.jpg';
const arrayJugadores = [
{
  url: "/assets/messi.jpg",
  texto: 'messi'
},
{
  url: "/assets/neymar.jpg",
  texto: 'neymar'
},
{
  url: "/assets/suarez.jpg",
  texto: 'suarez'
},
{
  url: "/assets/fondo.jpg",
  texto: 'fondo'
}
];
const divisorUmbral = 20;

const arrayImgs = arrayJugadores;
const imgOriginal = originalJugadores;

export class Comparar extends Component{
  constructor(props){
          super(props);
          this.state = {
          	 "chosenAnswerIndex": -1
          };
          this.actualizarEstado = this.actualizarEstado.bind(this);
          this.loadImage = this.loadImage.bind(this);
          this.updateCanvas = this.updateCanvas.bind(this);
        }

    componentDidMount(){
      let {loadImage} = this;
      let imgOriginalUrlArray = [];
      let context = [];
      let arrayContext = [];

      let canvas = document.getElementById("canvasPrincipal");
      loadImage (imgOriginal, canvas);
    }

    componentDidUpdate(){
      this.updateCanvas();
    }

    updateCanvasBnW = () => {
      let canvasPrincipal = document.getElementById("canvasPrincipal");
      let contexto = canvasPrincipal.getContext('2d');
      let newImageData = contexto.createImageData(320,200);
      let {chosenAnswerIndex} = this.state;
      chosenAnswerIndex.map((value,index)=>{
        newImageData.data[index]=value;
      })
      contexto.putImageData(newImageData,0,0);
    }

    updateCanvas = () => {
      let canvasPrincipal = document.getElementById("canvasPrincipal");
      let contexto = canvasPrincipal.getContext('2d');
      let {chosenAnswerIndex} = this.state;
      let newImage = new Image();
      newImage.onload = () => {
        contexto.drawImage(newImage,0,0);
      }
      newImage.src = arrayImgs[chosenAnswerIndex].url;




    }

    loadImage = (url,canvas) => {
        let img = new Image();
        img.onload = () => {
          let context = canvas.getContext('2d');
          canvas.width=img.width;
          canvas.height=img.height;
          context.drawImage(img, 0, 0);
        };
        img.src = url;

    }

    actualizarEstado(event){
      console.log(event.target);
      let component = event.target;
      let {width,height} = component;
      compareImgs(event,imgOriginal,arrayImgs,width,height).then(
        (resolve) => {
          component.width=resolve.width;
          component.height=resolve.height;
          this.setState({
            chosenAnswerIndex : resolve.index
        });

        }
      )
    }

    render(){
        let {actualizarEstado} = this;
        let {chosenAnswerIndex} = this.state;
        let h1;
        if (chosenAnswerIndex==-1){
          h1 = 'Elija una opcion';
        }
        else{
          h1 = 'usted ha elegido: '+ arrayImgs[chosenAnswerIndex].texto
        }
      	return(
      		<div>
            <canvas
              id="canvasPrincipal"
              onMouseDown={
                (event)=>{
                  actualizarEstado(event)
                }
              }
            />
            <h1> {h1} </h1>
          </div>
      	);
    }
}
