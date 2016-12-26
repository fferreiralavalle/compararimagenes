import React,{ Component } from 'react';
import {getBnWImages} from './bnwTest.jsx';

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

const arrayImgs = arrayJugadores;
const imgOriginal = originalJugadores;

export class CompararBnw extends Component{
  constructor(props){
    super(props);
    this.state = {
      bnwImages : {}
    }
    this.actualizarEstado = this.actualizarEstado.bind(this);
    this.loadImage = this.loadImage.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
  }

  componentDidMount(){
      let {loadImage} = this;
      let imgOriginalUrlArray = [];
      let arrayContext = [];
      imgOriginalUrlArray.push(imgOriginal);
      arrayImgs.map( (value, index) => {
          arrayContext.push(document.getElementById(index).getContext('2d'));
      })
      loadImage (imgOriginalUrlArray, arrayContext);
  }

  loadImage = (arrayImgs,contextos) => {
    contextos.map( (contexto) => {
          let img = new Image();
          img.onload = () => {
            contexto.drawImage(img, 0, 0);
          };
          img.src = arrayImgs[0];
      });
  }

  actualizarEstado(){
    getBnWImages(imgOriginal,arrayImgs).then(
      (bnwImages) => {
        console.log(bnwImages);
        this.setState({
          bnwImages : bnwImages
        });
      }
    );
  }

  componentDidUpdate(){
    this.updateCanvas();
  }

  updateCanvas = () => {
    let {bnwImages} = this.state;
    arrayImgs.map( (value,index) => {
      let canvas = document.getElementById(index);
      let contexto = canvas.getContext('2d');
      contexto.canvas.width=bnwImages.width;
      contexto.canvas.height=bnwImages.height;
      let newImageData = contexto.createImageData(bnwImages.width,bnwImages.height);
      let x = 0;
      bnwImages.dataArray[index].map((value,index)=>{
        newImageData.data[index]=value;
      })
      contexto.putImageData(newImageData,0,0);
    })
  }

  render(){
    let {actualizarEstado} = this;
    	return(
    		<div>
          <button onClick = {()=>{actualizarEstado()}}>Get Img BnW</button>
          <br/>
          {
            arrayImgs.map( (value, index) => {
              return (
                <canvas id={index} key={index} width='2440' height='1639'></canvas>
              );
            })
          }
        </div>
    	);
  }
}
