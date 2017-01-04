import React, {Component} from 'react';
import {Comparar} from './comparar.jsx';


export class Principal extends Component {
    constructor(props){
        super(props);
    }
    static originalImg = 'http://static.iamat.com/media/58359cf3790a71079a009bdc.small.jpeg';
    static imgsArray = [
        {
            url: "/assets/messi_bocha.small.jpeg",
            texto: 'bocha'
        },
        {
            url: "assets/messi_cuerpo.small.jpeg",
            texto: 'messi'
        },
        {
            url: "assets/messi_fondo.small.jpeg",
            texto: 'fondo'
        }
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
