import React,{ Component } from 'react';
import {Comparar} from './comparar.jsx';

const originalMessi = '/assets/messi_original.small.jpeg';
const arrayMessi = [
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
const originalJugadores = '/assets/procesada_photoshop.jpg';
const arrayJugadores = [{
  url: "/assets/messi.jpg",
  texto: 'messi'
},{
  url: "/assets/neymar.jpg",
  texto: 'neymar'
},{
  url: "/assets/suarez.jpg",
  texto: 'suarez'
},{
  url: "/assets/fondo.jpg",
  texto: 'fondo'
}
];
const originalCubo = '/assets/1.jpg';
const arrayCubos = [
{
  url: "/assets/2.jpg",
  texto: 'messi'
},
{
  url: "/assets/3.jpg",
  texto: 'neymar'
},
{
  url: "/assets/4.jpg",
  texto: 'suarez'
},
{
  url: "/assets/5.jpg",
  texto: 'fondo'
}];

const divisorUmbral = 20;
const compression = 10;

const original = originalJugadores;
const arrayImgs = arrayJugadores;

export class Principal extends Component{
    render(){
      	return(
      		<div>
            Hello word!
            <Comparar width="500" original={original} answers={arrayImgs} umbral={divisorUmbral} compression={compression}/>

          </div>
      	);
    }
}
