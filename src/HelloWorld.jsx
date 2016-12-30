import React, {Component} from 'react';
import {Comparar} from './comparar.jsx';


export class Principal extends Component {
    constructor(props){
        super(props);
    }
    static originalImg = '/assets/procesada_photoshop.jpg';
    static imgsArray = [{
        url: "/assets/messi.jpg",
        texto: 'messi'
    }, {
        url: "/assets/neymar.jpg",
        texto: 'neymar'
    }, {
        url: "/assets/suarez.jpg",
        texto: 'suarez'
    }, {
        url: "/assets/fondo.jpg",
        texto: 'fondo'
    }
    ];
    static divisorUmbral = 20;
    static compression = 10;

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
