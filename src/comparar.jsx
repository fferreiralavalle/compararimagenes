import React,{ Component } from 'react';
import {compareImgs} from './compareImgs.jsx';

var imgWidth = 320;
var imgHeight = 200;

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

      imgOriginalUrlArray.push(imgOriginal);
      context.push(document.getElementById("canvasPrincipal"));
      arrayContext.push(context[0].getContext('2d'));

      loadImage (imgOriginalUrlArray, arrayContext);
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

    loadImage = (arrayImgs,contextos) => {
      arrayImgs.map( (url, index) => {
          let img = new Image();
          img.onload = () => {
            contextos[index].drawImage(img, 0, 0);
          };
          img.src = url;
      });
    }

    actualizarEstado(event){
      compareImgs(event,imgOriginal,arrayImgs,imgWidth,imgHeight).then(
        (resolve) => {
          imgWidth=resolve.width;
          imgHeight=resolve.height;
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
              width={imgWidth} height={imgHeight}/>
              <h1> {h1} </h1>
              <canvas></canvas>
          </div>
      	);
    }
}
