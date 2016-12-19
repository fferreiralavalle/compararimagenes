import React,{ Component } from 'react';


const imgOriginal = '/assets/messi_original.small.jpeg';
const pelota = "/assets/messi_bocha.small.jpeg";
const imgWidth = 320;
const imgHeight = 200;
export const polls = () =>{
}

export const compareImgs = (originalImg, imgDataArray) =>{
  let datadiff = [];
  let max = 0;

  for ( var i = 0, l = imgDataMod.length; i < l; i += 4 ) {
    let diffPixel = (imgDataMod[i]-imgDataOriginal[i]) * (imgDataMod[i]-imgDataOriginal[i]) +
    (imgDataMod[i + 1]-imgDataOriginal[i + 1]) * (imgDataMod[i + 1]-imgDataOriginal[i + 1]) +
    (imgDataMod[i + 2]-imgDataOriginal[i + 2]) * (imgDataMod[i + 2]-imgDataOriginal[i + 2]) +
    (imgDataMod[i + 3]-imgDataOriginal[i + 3]) * (imgDataMod[i + 3]-imgDataOriginal[i + 3]);
    datadiff.push(diffPixel);
    max = Math.max(max,diffPixel);

    return {datadiff,max};
  }


}


export const getDistance = (mouseX,mouseY,blackDotCoord) => {
  const distX = Math.pow((mouseX - blackDotCoord.x),2);
  const distY =  Math.pow((mouseY - blackDotsCoord.y),2);
  return Math.sqrt((distX+distY));
}

export const getBlackDotsCoord = (indice) => {
  let x,y;
  y = Math.floor(indice/imgWidth);
  x = Math.floor(indice/imgHeight);
  return {x,y};

}
