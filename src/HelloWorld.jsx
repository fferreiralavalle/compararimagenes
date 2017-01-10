import React, {Component} from 'react';
import {Comparar} from './comparar.jsx';
import {getHistoriesOfType,getLoadableContent,filterDataWithType} from "./IamatHistory.jsx";



export class Principal extends Component {
    constructor(props){
        super(props);
        this.state = {
          originalImg: {
            url: '',
            texto: ""
          },
          imgsArray: {
            url: '',
            texto: ""
          }
        };
        this.loadData = this.loadData.bind(this);

    }
    //https://api.iamat.com/atcode/iamat-muestra/history/till/now?type=sh_img,sh_poll2,poll_answered_response2,poll_final_response2
    static originalImg = {
      url:'http://static.iamat.com/media/583ddd7315e0813bd1eb67d0.small.png',
      texto: "Apretame?"
    };

    static imgsArray = [
        {
            url: "http://static.iamat.com/media/583ddd8315e0813bd1eb67d3.small.png",
            texto: 'bocha'
        },{
          url: "http://static.iamat.com/media/583ddda215e0813bd1eb67d7.small.png",
          texto: 'bocha'
        }
    ];
    static divisorUmbral = 20;
    static compression = 80;
    componentDidMount (){
      let {loadData} = this;
      loadData();
    }
    loadData() {
      let histories = [];
      getHistoriesOfType("poll_answered_response2").then((data)=>{
        histories = data.history;
        console.log(data);
        let historiesFiltered = [];
        historiesFiltered = filterDataWithType("imagePattern",histories);
        console.log(historiesFiltered);
      });
    }

    render() {
        let {divisorUmbral,compression,state} = this;
        let {originalImg,imgsArray} = state;
        let component = <div/>
        if (originalImg.url!=""){
          component = (<Comparar width="500" original={originalImg} answers={imgsArray} umbral={divisorUmbral}
            compression={compression}/>)
          }
        return (
            <div>
              <h1>La mejor página hecha por los pasantes en la historia</h1>
              {component}

            </div>
        );
    }
}
