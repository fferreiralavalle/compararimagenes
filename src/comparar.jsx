import React,{ Component } from 'react';
import {compareImgs, getDistance, getBlackDotsCoord,getPosition} from './compareImgs.jsx';


const imgOriginal = '/assets/messi_original.small.jpeg';
const arrayImgs = ["/assets/messi_bocha.small.jpeg","assets/messi_cuerpo.small.jpeg"];
const divisorUmbral = 20;


export class Comparar extends Component{
  constructor(props){
          super(props);
          this.state = {
          	 "imageDataClicked":[]
          };





  componentDidMount(){

  }

  loadImage = () => {

  }
  ImgClicked(){

  }

  actualizarEstado(event){
      this.setState({
        imageDataClicked = compareImgs(event,imgOriginal,arrayImgs);
    });
  }

    render(){
      	return(
      		<div>
            Las imagenes a comparar son:<br/>
            <canvas
              id="canvasPrincipal"
              onMouseDown={
                (event)=>{
                  actualizarEstado(event)
                }
              }
              width="auto" height="auto"/>
            <canvas id="canvasPelota" />
            <canvas id="calculatedGraph" />
            <img>{ImgClicked()}</img>
            <script>

              {
                window.onload = function() {

                  window.loadImage=function(url,contexto,callback){
                    let img = new Image();
                    img.onload = function(){
                      contexto.drawImage(img, 0, 0);
                      callback(contexto.getImageData(0,0,img.width,img.height).data);
                    };
                    img.src = url;
                  }

                  var c = document.getElementById("canvasPrincipal");
                  var ctx = c.getContext("2d");

                  var c2 = document.getElementById("canvasPelota");
                  var ctx2 = c2.getContext("2d");
                  let imgDataArray = [];

                  loadImage (arrayImgs[0], ctx2, function(imgDataMod) {
                    imgDataArray.push(imgDataMod);
                    loadImage (imgOriginal, ctx, null);
                  });
                }
              }
            </script>
          </div>
      	);
    }
}
