import React, {Component} from 'react';
import {ComparableCanvas} from './comparableCanvas';
import {ImageTextList} from "./imageTextList.jsx"
import {searchById,getHistoriesOfType,getLoadableContent,filterDataWithType} from "./IamatHistory.jsx";

//https://api.iamat.com/atcode/iamat-muestra/history/till/now?type=sh_img,sh_poll2,poll_answered_response2,poll_final_response2

export class Principal extends Component {
    constructor(props){
        super(props);
        this.state = {
          "pollList": [],
          "index": 0
        };
        this.loadData = this.loadData.bind(this);
        this.handleIndex = this.handleIndex.bind(this);
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
      getHistoriesOfType("sh_poll2").then((data)=>{
        histories = data.history;
        console.log('la data que quiero y no toda la otra mierda');
        console.log(data);
        let historiesFiltered = [];
        historiesFiltered = filterDataWithType("ImagePattern",histories);
        console.log("histories:");
        console.log(historiesFiltered);
        historiesFiltered.map ( (history,index) =>{
          let {question,answers} = getLoadableContent(history,1);
          questionsAndAnswers.push({
            question: question,
            answers: answers
          })
          console.log("answers pushed");
        })

        let random = Math.floor (Math.random()* questionsAndAnswers.length);
        this.setState({
          pollList: questionsAndAnswers
        });

      });
    }
    handleIndex(event){
      let {target} = event;
      this.setState({
        index: parseInt(target.name, 10)
      });
      console.log(this.state.index);
    }
    render() {
        let {state,searchById,handleIndex} = this;
        let {pollList,index} = state;
        console.log(state);
        
        let component = <div/>, pollListComponent = <div/>
        if (pollList.length!=0){
          let {question,answers} = pollList[index];
          component = (<Comparar width="500" original={question} answers={answers} umbral={20}
            compression={80}/>);

          let questions = pollList.map( (quesAndAns) =>{
            return quesAndAns.question;
          })
          pollListComponent = <ImageTextList list={questions} handleIndex={handleIndex}/>
          }
        return (
            <div>
              <h1>La mejor página hecha por los pasantes en la historia</h1>
              
              {component}
              {pollListComponent}
            </div>
        );
    }
}
