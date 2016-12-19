import React,{ Component } from 'react';
import {compareImgs, getDistance, getBlackDotsCoord} from './compareImgs.jsx';


const imgOriginal = '/assets/messi_original.small.jpeg';
const pelota = "/assets/messi_bocha.small.jpeg";
const divisorUmbral = 20;

export class Comparar extends Component{

    render(){
      	return(
      		<div>
            Las imagenes a comparar son:<br/>
            <canvas id="canvas" width="auto" height="auto"/>
            <canvas id="pelota" />
            <canvas id="graficoOfBall" />
            <script>

              {
                window.onload = function() {

                  window.loadImage=function(url,contexto, callback){
                    let img = new Image();

                    img.onload = function(){
                      contexto.drawImage(img, 0, 0);

                      callback(contexto.getImageData(0,0,img.width,img.height).data);
                    };
                    img.src = url;
                  }

                  var c = document.getElementById("canvas");
                  var ctx = c.getContext("2d");

                  var c2 = document.getElementById("pelota");
                  var ctx2 = c2.getContext("2d");
                  let imgDataArray = [];
                  loadImage (pelota, ctx2, function(imgDataMod) {
                    imgDataArray.push(imgDataMod);
                    loadImage (imgOriginal, ctx, function(imgDataOriginal) {
                      imgDataArray.push(imgDataOriginal);
                      compareReturn = compareImgs(imgDataArray);

                      let {datadiff,max} = compareReturn;

                      console.log(datadiff);
                      // max = Math.max(datadiff);
                      console.log(max);

                      let graficoOfBall = document.getElementById("graficoOfBall");
                      let contextGrafico = graficoOfBall.getContext('2d');
                      let imgBnW = contextGrafico.createImageData(320,200);


                      for ( var i = 0; i < datadiff.length; i ++ ) {
                        if (max/divisorUmbral < datadiff[i]){
                          imgBnW.data[i*4]=0;
                          imgBnW.data[i*4+1]=0;
                          imgBnW.data[i*4+2]=0;
                          imgBnW.data[i*4+3]=255;
                          getDistance(mouseX,mouseY,getBlackDotsCoord(i*4));
                          //CALCULAR LA DISTANCIA SEGUN CLICK getDistance
                        }
                        else{
                          imgBnW.data[i*4]=255;
                          imgBnW.data[i*4+1]=255
                          imgBnW.data[i*4+2]=255;
                          imgBnW.data[i*4+3]=0;
                        }

                      }
                      contextGrafico.putImageData(imgBnW,0,0);
                    });
                  });



                }

              }
            </script>
          </div>
      	);
    }
}
