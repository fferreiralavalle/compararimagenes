import React,{ Component } from 'react';


const imgOriginal = '/assets/messi_original.small.jpeg';
const pelota = "/assets/messi_fondo.small.jpeg";
const divisorUmbral = 20;

export class Comparar extends Component{
  constructor(){
    super();
    this.state= {
      "recargar": 0
    };
  }

  componentDidMount(){

    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    var img = document.getElementById("myimg");
    ctx.drawImage(img, 10, 10);
}



    render(){
      	return(
      		<div>
            Las imagenes a comparar son:<br/>
            <canvas id="canvas" width="auto" height="auto"/>
            <canvas id="pelota" />
            <canvas id="graficoOfBall" />
            <script>

              {  window.onload = function() {

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
                let array = [];
                loadImage (pelota, ctx2, function(data1) {
                  array.push(data1);
                  loadImage (imgOriginal, ctx, function(data2) {
                    array.push(data2);
                    let datadiff = [];
                    let max = 0;
                    for ( var i = 0, l = data1.length; i < l; i += 4 ) {
                      let diffActual = (data1[i]-data2[i]) * (data1[i]-data2[i]) +
                      (data1[i+ 1]-data2[i+ 1]) * (data1[i+ 1]-data2[i+1]) +
                      (data1[i+ 2]-data2[i+ 2]) * (data1[i+ 2]-data2[i+ 2]) +
                      (data1[i+ 3]-data2[i+ 3]) * (data1[i+ 3]-data2[i+ 3]);
                      datadiff.push(diffActual);
                      max = Math.max(max,diffActual);

                    }
                    console.log(datadiff);
                    // max = Math.max(datadiff);
                    console.log(max);

                    let graficoOfBall = document.getElementById("graficoOfBall");
                    let contextGrafico = graficoOfBall.getContext('2d');
                    let imgdatanew = contextGrafico.createImageData(320,200);


                    for ( var i = 0; i < datadiff.length; i ++ ) {
                      if (max/divisorUmbral < datadiff[i]){
                        imgdatanew.data[i*4]=0;
                        imgdatanew.data[i*4+1]=0;
                        imgdatanew.data[i*4+2]=0;
                        imgdatanew.data[i*4+3]=255;
                        //CALCULAR LA DISTANCIA SEGUN CLICK
                      }
                      else{
                        imgdatanew.data[i*4]=255;
                        imgdatanew.data[i*4+1]=255
                        imgdatanew.data[i*4+2]=255;
                        imgdatanew.data[i*4+3]=0;
                      }

                    }
                    contextGrafico.putImageData(imgdatanew,0,0);
                  });
                });



              }





              }
            </script>
          </div>
      	);
    }
}
