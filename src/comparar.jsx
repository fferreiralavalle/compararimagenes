import React,{ Component } from 'react';
import {compareImgs,getAllBnWCanvas,getImgOriginalSize,getBnWImages} from './compareImgs.jsx';

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
const originalCubo = '/assets/1.jpg';
const arrayCubos = [
{
  url: "/assets/2.jpg",
  texto: 'messi'
},
{
  url: "/assets/3.jpg",
  texto: 'neymar'
},
{
  url: "/assets/4.jpg",
  texto: 'suarez'
},
{
  url: "/assets/5.jpg",
  texto: 'fondo'
}];
const divisorUmbral = 20;

const imgOriginal = originalJugadores;
const arrayImgs = arrayJugadores;

export class Comparar extends Component{
  constructor(props){
          super(props);
          this.state = {
          	 "chosenAnswerIndex": -1
          };
          this.actualizarEstado = this.actualizarEstado.bind(this);
          this.loadImage = this.loadImage.bind(this);
          this.updateCanvas = this.updateCanvas.bind(this);
          this.drawCanvas = this.drawCanvas.bind(this);
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
      //console.log(event.target);
      let component = event.target;
      compareImgs(event,imgOriginal,arrayImgs, divisorUmbral, 10,true).then(
        (resolve) => {
          // component.width=resolve.width;
          // component.height=resolve.height;
          this.setState({
            chosenAnswerIndex : resolve.index
        });

        }
      )
    }

    render(){
        let {actualizarEstado,drawCanvas} = this;
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
            <button onClick = {()=>{drawCanvas()}}>Get Img BnW</button>
            {
              this.drawEmptyCanvas()
            }


            <h1> {h1} </h1>
          </div>
      	);
    }

    drawEmptyCanvas(){
      if (arrayImgs.length>0){
        return (
          arrayImgs.map((component,index)=>{
          return (
            <canvas width="0" height="0" key={index} id={'c'+index}/>
          );
        })
      );
      }
      return (
        <div/>
      )
    }

    drawCanvas(){
      getBnWImages(imgOriginal,arrayImgs).then(
        (bnwImages) => {
          console.log(bnwImages);
          bnwImages.map( (value,index) => {
            let canvas = document.getElementById("c"+index);
            let contexto = canvas.getContext('2d');
            console.log(value);
            contexto.canvas.width=value.width;
            contexto.canvas.height=value.height;
            contexto.putImageData(value,0,0);
          });
        }
      );
      console.log("EWEEEEEEEEEE");
    }
}
