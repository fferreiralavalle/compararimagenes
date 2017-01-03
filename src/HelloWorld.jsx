import React, {Component} from 'react';
import {Comparar} from './comparar.jsx';


export class Principal extends Component {
    constructor(props){
        super(props);
    }
    static originalImg = 'http://elcorillord.com/wp-content/uploads/2016/02/panda.jpg';
    static imgsArray = [{
        url: "http://elcorillord.com/wp-content/uploads/2016/02/panda.jpg",
        texto: 'messi'
    },
    ];
    static divisorUmbral = 20;
    static compression = 80;

    render() {
        const {originalImg, imgsArray,divisorUmbral,compression} = Principal;
        return (
            <div>
              <h1>La mejor página hecha por los pasantes en la historia</h1>
              <Comparar width="500" original={originalImg} answers={imgsArray} umbral={divisorUmbral}
                compression={compression}/>
            </div>
        );
    }
}
