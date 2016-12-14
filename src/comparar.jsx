import React,{ Component } from 'react';


export class Comparar extends Component{
  constructor(){
    super();

  }

  componentDidMount(){
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var img = document.getElementById('myimg');
    canvas.width = 100;
    console.log("canvas width:"+canvas.width);
    canvas.height = 100;
    context.drawImage(img, 0, 0 );
    var myData = context.getImageData(0, 0, canvas.width, canvas.height);
  }
    render(){
      	return(
      		<div>
            Las imagenes a comparar son:
            <img id="myimg" src=".\assets\Ratchet_and_Clank.png"/>
        </div>
      	);
    }
}
