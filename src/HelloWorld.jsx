import React, {Component} from 'react';
import {Comparar} from './comparar.jsx';
import {getHistoriesOfType,getLoadableContent,filterDataWithType} from "./IamatHistory.jsx";

//https://api.iamat.com/atcode/iamat-muestra/history/till/now?type=sh_img,sh_poll2,poll_answered_response2,poll_final_response2

export class Principal extends Component {
    constructor(props){
        super(props);
        this.state = {
          "originalImg": {
            url: '',
            texto: ""
          },
          "imgsArray": {
            url: '',
            texto: ""
          }
        };
        this.loadData = this.loadData.bind(this);
    }


    static divisorUmbral = 20; //los dejo de tomar nose por que
    static compression = 80;

    componentDidMount (){
      let {loadData} = this;
      loadData();
      console.log(this);
    }

    loadData() {
      let histories = [];
      let questionsAndAnswers = [];
      let {state,setState} = this;
      getHistoriesOfType("poll_answered_response2").then((data)=>{
        histories = data.history;
        console.log(data);
        let historiesFiltered = [];
        historiesFiltered = filterDataWithType("imagePattern",histories);
        console.log(historiesFiltered);
        historiesFiltered.map ( (history,index) =>{
          let {question,answers} = getLoadableContent(history,1);
          questionsAndAnswers.push({
            question: question,
            answers: answers
          })
        })

        let random = Math.floor (Math.random()* questionsAndAnswers.length);
        this.setState({
          originalImg: questionsAndAnswers[random].question,
          imgsArray: questionsAndAnswers[random].answers
        });
        console.log(state);

      });
    }

    render() {
        let {divisorUmbral,compression,state} = this;
        let {originalImg,imgsArray} = state;
        let component = <div/>
        console.log("compression = "+compression);
        console.log("divisorUmbral = "+divisorUmbral);
        if (originalImg.url!=""){
          component = (<Comparar width="500" original={originalImg} answers={imgsArray} umbral={20}
            compression={80}/>)
          }
        return (
            <div>
              <h1>La mejor página hecha por los pasantes en la historia</h1>
              {component}

            </div>
        );
    }
}
