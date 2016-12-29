import React,{ Component } from 'react';
import {compareImgs,getBnWImages} from './compareImgs.jsx';

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
      let {original} = this.props;
      let canvas = document.getElementById("canvasPrincipal");
      loadImage (original, canvas);
    }

    componentDidUpdate(){
      this.updateCanvas();
    }

    updateCanvas = () => {
      let {loadImage} = this;
      let {chosenAnswerIndex} = this.state;
      let {answers} = this.props;
      let {url} = answers[chosenAnswerIndex];
      let canvasPrincipal = document.getElementById("canvasPrincipal");
      loadImage(url,canvasPrincipal);

    };

    loadImage = (url,canvas) => {
       let img = new Image();
       img.onload = () => {
         let {props} = this;
         let context = canvas.getContext('2d');
         let {width,height} = img;

         let desiredWidth = props.width;
         let desiredWidthWidthRelation = desiredWidth/width;
         let heightWidthRelation = height/width;
         let newHeight = desiredWidth*heightWidthRelation;
         let newHeightHeightRelation = newHeight/height;
         canvas.width=desiredWidth;
         canvas.height=newHeight;
         context.scale(
           desiredWidthWidthRelation,
           newHeightHeightRelation
         );
         context.drawImage(img, 0, 0);
       };
       img.src = url;
   };

    actualizarEstado(event){
      let {original,answers,umbral,compression} = this.props;
      compareImgs(event,original,answers, umbral,compression).then(
        (resolve) =>
        {
          let {index} = resolve;
          this.setState({
            chosenAnswerIndex : index
          });
        }
      );
    }

    render(){
        let {actualizarEstado,drawCanvas} = this;
        let {chosenAnswerIndex} = this.state;
        let {answers} = this.props;
        let h1;

        if (chosenAnswerIndex==-1){
          h1 = 'Elija una opcion';
        }
        else{
          h1 = 'usted ha elegido: '+ answers[chosenAnswerIndex].texto
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
      let {answers} = this.props;
      if (answers.length>0){
        return (
          answers.map((component,index)=>{
          return (
            <div key={index}>
              <br/>
              <canvas width="0" height="0" key={index} id={'c'+index}/>
            </div>

          );
        })
      );
      }
      return (
        <div/>
      )
    };

    drawCanvas(){
      let {original,answers,umbral,compression} = this.props;
      getBnWImages(original,answers,umbral,compression).then(
        (bnwImages) => {
          bnwImages.map( (value,index) => {
            let canvas = document.getElementById("c"+index);
            let contexto = canvas.getContext('2d');
            contexto.canvas.width=value.width;
            contexto.canvas.height=value.height;
            contexto.putImageData(value,0,0);
          });
        }
      );
    }
}
