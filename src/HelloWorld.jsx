import React, {Component} from 'react';
import {Comparar} from './comparar.jsx';


export class Principal extends Component {
    constructor(props){
        super(props);

        this.getRender = this.getRender.bind(this);
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
    }, {
        url: "/assets/messi_bocha.small.jpeg",
        texto: 'cubo'
    }
    ];
    static divisorUmbral = 20;
    static compression = 10;

    getRender(originalImg, imgsArray) {
        let errorsize = false;
        let image = new Image();
        image.onload = () => {
            const originalWidth = image.width;
            const originalHeight = image.height;
            console.log(originalWidth);
            console.log(originalHeight);
            console.log("antes original, ahora las del array");
            imgsArray.map((img) => {
               let imageFromArray = new Image();
               imageFromArray.onload = () => {
                   const arrayWidth = imageFromArray.width;
                   const arrayHeight = imageFromArray.height;
                   console.log(arrayWidth);
                   console.log(arrayHeight);
                   if(arrayWidth !== originalWidth || arrayHeight !== originalHeight){
                       errorsize = true;
                   }
               };
               imageFromArray.src = img.url;
            })
        };
        image.src = originalImg;

        if (errorsize) {
            return (
                <div>
                    <h1>Images do not have the same size - Verify</h1>
                </div>
            );
        } else {
            const { divisorUmbral, compression } = Principal;
            return (
                <div>
                    <h1>Image</h1>
                    <Comparar width="500" original={originalImg} answers={imgsArray} umbral={divisorUmbral}
                              compression={compression}/>
                </div>
            );
        }
    }

    render() {
        const {originalImg, imgsArray} = Principal;
        const {getRender} = this;
        return getRender(originalImg, imgsArray);
    }
}
