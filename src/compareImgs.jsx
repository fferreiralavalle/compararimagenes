import React,{ Component } from 'react';

var divisorUmbral = 20;
var divisorimg = 1;
var imgWidth;
var imgHeight;
var mouseX = 0;
var mouseY = 0;


var BnWCanvas = [];

export const getImgOriginalSize = () =>{
  return {imgWidth,imgHeight};
}

export const getAllBnWCanvas = () =>{

  if (BnWCanvas.length>0){
    return (
      BnWCanvas
    );
  }
  else{
    return [];
  }
}

// getBnW --Heber--
export const getBnWImages = (originalImg, answersArray, umbral) => {
  if(umbral !== undefined){
    divisorUmbral = umbral;
  }
  return initCompareBnW(originalImg,answersArray);
}

export const compareImgs = (evt,imgO,aswArr, umb, divisorimagen) => {

  imgWidth=evt.target.width;
  imgHeight=evt.target.height;
  if (typeof umb !== undefined){
    divisorUmbral  = umb;
   }
   if (typeof divisorimagen !== undefined){
      divisorimg = divisorimagen;
    }
    return initCompare(evt,imgO,aswArr);
}

const initCompare = (event, originalImg, answersArray) =>{
  setClickPosition(event);
  let imgDataArray= [];

  return new Promise( (resolve,reject) => {
    loadImages(originalImg,answersArray, imgDataArray,0).then(
      (object) => {
        let closestElementIndex = getClosestElement(object.originalImg1,object.imgDataArray);
        resolve({
          index: closestElementIndex,
          width: imgWidth,
          height: imgHeight
        });
      }
    );
  })

}

const setClickPosition = (event)=>{
    let canvas = document.getElementById("canvasPrincipal");
    let rect = canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left);
    let y = (event.clientY - rect.top);
    mouseX = x;
    mouseY = y
}

const loadImages = (originalImg, answersArray, imgDataArray,index)  =>{
  return new Promise( (resolve,reject) => {
    if (index>=answersArray.length){
      let img = new Image();
      let canvas = document.createElement("canvas")
      let context = canvas.getContext('2d');
      img.onload = () => {
        canvas.width=img.width;
        canvas.height=img.height;
        context.drawImage(img, 0, 0);
        let originalImg1 = {
            dataArray: context.getImageData(0,0,img.width,img.height).data,
            width: img.width,
            height: img.height
          };
        resolve({
          originalImg1 : originalImg1,
          imgDataArray : imgDataArray
        });
      }
      img.src = originalImg;
    }else{
      let img = new Image();
      let canvas = document.createElement("canvas")
      let context = canvas.getContext('2d');
      img.onload = () => {
        canvas.width=img.width;
        canvas.height=img.height;
        context.drawImage(img, 0, 0);
        imgDataArray.push({
            dataArray: context.getImageData(0,0,img.width,img.height).data,
            width: img.width,
            height: img.height
          });
        imgWidth=img.width;
        imgHeight=img.height;
        loadImages(originalImg, answersArray,imgDataArray,index+1).then(
          (resolved) => {
            resolve(resolved);
          }
        );
      };
      img.src = answersArray[index].url;
    }
  });

}

const getClosestElement = (originalImg, imgDataArray) => {
  let closestDistance= -1;//error checker
  let closestImgIndex;
  let minDists = [];
  let dataArrayOriginal = originalImg.dataArray;

  //set array of distances
  for (let i=0; i<imgDataArray.length;i++){
    let dataArrayAnswers = imgDataArray[i].dataArray;
    let {datadiff, max} = getDiffDotsAndMax(dataArrayOriginal,dataArrayAnswers);
    let resultado = getMinDistance(datadiff, max);

    let {minDist} = resultado;

    minDists.push(minDist);
  }

  //get closest distance
  closestDistance = Math.min(...minDists);

  //get closest element index
  minDists.map((value,index) => {
    if (value==closestDistance) {
      closestImgIndex=index;
    }
  })

  //validate
  if (closestDistance<0) {
    console.log("Error: cannot get closest distance");
    return null;
  }

  return closestImgIndex;

}

const getDiffDotsAndMax = (imgDataOriginal, imgDataMod) => {
  let datadiff = [];
  let max = 0;
  let i=0;
  for (i = 0; i < imgDataMod.length; i += 4 ) {
    let diffPixel =
    (imgDataMod[i]-imgDataOriginal[i]) * (imgDataMod[i]-imgDataOriginal[i]) +
    (imgDataMod[i + 1]-imgDataOriginal[i + 1]) * (imgDataMod[i + 1]-imgDataOriginal[i + 1]) +
    (imgDataMod[i + 2]-imgDataOriginal[i + 2]) * (imgDataMod[i + 2]-imgDataOriginal[i + 2]) +
    (imgDataMod[i + 3]-imgDataOriginal[i + 3]) * (imgDataMod[i + 3]-imgDataOriginal[i + 3]);

    datadiff.push(diffPixel);
    max = Math.max(max,diffPixel);

  }
  return {datadiff, max};
}

const getMinDistance = (imgDataDiff,max) =>{
  let minDist = -1;//error checker

  for (let i = 0; i < imgDataDiff.length; i ++ ) {
    if (max/divisorUmbral < imgDataDiff[i]){
      let dist = getDistance(getPixelPosition(i));
      if (minDist==-1) {
        minDist = dist;
      }else{
        minDist = Math.min(minDist, dist);
      }
    }
  }
  if (minDist==-1) {
    console.log("Error getting min distance of image");
  }
  return {
      minDist: minDist,
    };
}

const getDistance = (blackDotCoord) => {
  const distX = Math.pow((mouseX - blackDotCoord.x),2);
  const distY =  Math.pow((mouseY - blackDotCoord.y),2);
  return Math.sqrt((distX+distY));
}

const getPixelPosition = (indice) => {
  let x,y;
  y = Math.floor(indice/imgWidth);
  x = Math.floor(indice - y*imgWidth);
  return {x,y};

}

const initCompareBnW = (originalImg, answersArray) =>{
  let imgDataArray= [];
  return new Promise( (resolve,reject) => {
    loadImages(originalImg,answersArray,imgDataArray, 0).then(
      (object) => {
        setBnWDataArray(object.originalImg1.dataArray,object.imgDataArray)
        resolve(BnWCanvas);
      }
    );
  })
}

const setBnWDataArray = (dataArrayOriginal, imgDataArray) => {

  for (let i=0; i<imgDataArray.length;i++){
    let dataArrayAnswers = imgDataArray[i].dataArray;
    let {datadiff, max} = getDiffDotsAndMax(dataArrayOriginal,dataArrayAnswers);
    setBnWData(datadiff, max);
  }
}

const setBnWData = (imgDataDiff,max) =>{ //similar to getMinDistance
  let context = document.createElement("canvas").getContext('2d');
  let imgBnW = context.createImageData(imgWidth,imgHeight);
  for ( var i = 0; i < imgDataDiff.length; i ++ ) {
    if (max/divisorUmbral < imgDataDiff[i]){
      imgBnW.data[i*4]=0;
      imgBnW.data[i*4+1]=0;
      imgBnW.data[i*4+2]=0;
      imgBnW.data[i*4+3]=255;
    }
    else{
      imgBnW.data[i*4]=255;
      imgBnW.data[i*4+1]=255
      imgBnW.data[i*4+2]=255;
      imgBnW.data[i*4+3]=255;
    }
  }
  console.log(imgBnW);
  BnWCanvas.push(imgBnW);
}
