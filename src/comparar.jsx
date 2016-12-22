import React,{ Component } from 'react';
import {compareImgs} from './compareImgs.jsx';


const imgOriginal = '/assets/messi_original.small.jpeg';
const arrayImgs = ["/assets/messi_bocha.small.jpeg","assets/messi_cuerpo.small.jpeg"];
const divisorUmbral = 20;


export class Comparar extends Component{
  constructor(props){
          super(props);
          this.state = {
          	 "imageDataClicked":[]
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

    updateCanvas = () => {
      let canvasPrincipal = document.getElementById("canvasPrincipal");
      let contexto = canvasPrincipal.getContext('2d');
      let newImageData = contexto.createImageData(320,200);
      let {imageDataClicked} = this.state;
      imageDataClicked.map((value,index)=>{
        newImageData.data[index]=value;
      })
      contexto.putImageData(newImageData,0,0);
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
      compareImgs(event,imgOriginal,arrayImgs).then(
        (resolve) => {
          this.setState({
            imageDataClicked : resolve
        });
        }
      )
    }

    render(){
        let {actualizarEstado} = this;
      	return(
      		<div>
            <canvas
              id="canvasPrincipal"
              onMouseDown={
                (event)=>{
                  actualizarEstado(event)
                }
              }
              width="auto" height="auto"/>
          </div>
      	);
    }
}
