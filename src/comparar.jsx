import React,{ Component } from 'react';
import {compareImgs,getAllBnWCanvas,getImgOriginalSize} from './compareImgs.jsx';

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

const arrayImgs = arrayMessi;
const imgOriginal = originalMessi;

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
      compareImgs(event,imgOriginal,arrayImgs, divisorUmbral, 1,true).then(
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
            {
              this.drawEmptyCanvas()
            }
            {
              this.drawCanvas()
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
      let showBnWImgData = getAllBnWCanvas();
      //console.log("showBnWImgData length:"+showBnWImgData.length);
      if (showBnWImgData.length>0){
          showBnWImgData.map((imgBnW,index)=>{
            let canvas = document.getElementById('c'+index);
            let {imgWidth,imgHeight} = getImgOriginalSize();
            canvas.width = imgWidth;
            canvas.height = imgHeight;
            canvas.getContext('2d').putImageData(imgBnW,0,0);
            //console.log(imgBnW);

        });
      }
    }
}
