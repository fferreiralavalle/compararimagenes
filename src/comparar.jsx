import React,{ Component } from 'react';
import {compareImgs,getBnWImages} from './compareImgs.jsx';
import {getHistoriesOfType,getLoadableContent} from "./IamatHistory.jsx";

export class Comparar extends Component{
  constructor(props){
          super(props);
          this.state = {
          	 "chosenAnswerIndex": -1,
              "sizeError": false
          };
          this.actualizarEstado = this.actualizarEstado.bind(this);
          this.loadImage = this.loadImage.bind(this);
          this.updateCanvas = this.updateCanvas.bind(this);
          this.drawCanvas = this.drawCanvas.bind(this);
          this.checkForSizeError = this.checkForSizeError.bind(this);
        }

    componentDidMount(){
        let {loadImage} = this;
        let {original,answers} = this.props;
        let {url} = original;
        let canvas = document.getElementById("canvasPrincipal");
        loadImage (url, canvas);
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
     }

    actualizarEstado(event){
      let {checkForSizeError} = this;
      let {original,answers,umbral,compression} = this.props;
      let originalUrl = original.url;
      compareImgs(event,originalUrl,answers, umbral,compression).then(
        (resolve) =>
        {
          console.log(resolve.errors);
          let {index,errors} = resolve;
          let sizeError = checkForSizeError(errors);
          this.setState({
            chosenAnswerIndex : index,
            sizeError: sizeError
          });
          getHistoriesOfType("poll_answered_response2").then((data) =>{
            console.log(data);
          })
        }
      );
    }

    checkForSizeError = (errors)=> {
      for (let i=0 ; i<errors.length ; i++){
        if (errors[i].id == "imgSize"){
          return true;
        }
      }
      return false;
    }

    render(){
        let {actualizarEstado,drawCanvas} = this;
        let {chosenAnswerIndex, sizeError} = this.state;
        let {answers,original} = this.props;
        console.log(answers,original);
        let h1;
        if (chosenAnswerIndex==-1){
          h1 = original.text;
        }
        else{
          h1 = 'usted ha elegido: '+ answers[chosenAnswerIndex].text
        }
        if (sizeError){
            return (
                <div>
                  <h1>Images size differ from the original - Please verify</h1>
                </div>
            );
        } else {
            return (
                <div>
                  <canvas
                    id="canvasPrincipal"
                    onMouseDown={
                      (event) => {
                        actualizarEstado(event)
                      }
                    }
                  />
                  <button onClick={() => {
                    drawCanvas()
                  }}>Get Img BnW
                  </button>
                  {
                    this.drawEmptyCanvas()
                  }
                  <h1> {h1} </h1>
                </div>
            );
        }
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
      let originalUrl = original.url;
      getBnWImages(originalUrl,answers,umbral,compression).then(
        (bnwImages) => {
          bnwImages.map( (value,index) => {
            let canvas = document.getElementById("c"+index);
            let context = canvas.getContext('2d');
            context.canvas.width=value.width;
            context.canvas.height=value.height;
            context.putImageData(value,0,0);
          });
        }
      );
    }
}
