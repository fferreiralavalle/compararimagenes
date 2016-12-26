import React,{ Component } from 'react';

var divisorUmbral = 20;
var divisorimg = 1;
var imgWidth = 2440;
var imgHeight = 1639;

var BnWCanvas = [];

export const compareImgs = (evt,imgO,aswArr, umb, divisorimagen) => {
  BnWCanvas = [];
  imgWidth=evt.target.width;
  imgHeight=evt.target.height;
  if (typeof umb !== undefined){
    divisorUmbral  = umb;
   }
   if (typeof divisorimagen !== undefined){
      divisorimg = divisorimagen;
    }
    //console.log("width: "+imgWidth + " height: "+imgHeight);
    return initCompare(evt,imgO,aswArr);
}

const initCompare = (event, originalImg, answersArray) =>{
  let {x,y} = getClickPosition(event);
  //console.log('click en :'+x+', '+y);
  let imgDataArray= [];

  return new Promise( (resolve,reject) => {
    loadImages(originalImg,answersArray, imgDataArray, x, y,0).then(
      (closestElementIndex) => {
        resolve({
          index: closestElementIndex,
          width: imgWidth,
          height: imgHeight
        });
      }
    );
  })

}

const getClickPosition = (event)=>{
    let canvas = document.getElementById("canvasPrincipal");
    let rect = canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left);
    let y = (event.clientY - rect.top);
    //console.log("x: "+x+" y: "+y);
    return {x,y};
}


const loadImages = (originalImg, answersArray, imgDataArray, x, y,index)  =>{
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
        resolve(getClosestElement(originalImg1, imgDataArray, x, y));
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
        loadImages(originalImg, answersArray,imgDataArray, x, y,index+1).then(
          (resolved) => {
            resolve(resolved);
          }
        );
      };
      img.src = answersArray[index].url;
    }
  });

}

const getClosestElement = (originalImg, imgDataArray, x, y) => {
  let closestDistance= -1;//error checker
  let closestImgIndex;
  let minDists = [];
  let dataArrayOriginal = originalImg.dataArray;

  //set array of distances
  for (let i=0; i<imgDataArray.length;i++){
    let dataArrayAnswers = imgDataArray[i].dataArray;
    let {datadiff, max} = getDiffDotsAndMax(dataArrayOriginal,dataArrayAnswers);
    let resultado = getMinDistance(datadiff, max, x, y);

    let {minDist,imgBnW} = resultado;

    minDists.push(minDist);
    BnWCanvas.push(imgBnW);
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
    //console.log("Error: cannot get closest distance");
    return null;
  }

  //console.log("closestDistance: " + closestDistance);
  return closestImgIndex;

}

const getDiffDotsAndMax = (imgDataOriginal, imgDataMod) => {
  let datadiff = [];
  let max = 0;
  let i=0;
  for (i = 0; i < imgDataMod.length; i += 4 ) {
    if (i==0) {
      //console.log("getting max difference between pixels...");
      //console.log("length mod: " + imgDataMod.length + " orig lenght: "+ imgDataOriginal.length);
    }

    let diffPixel =
    (imgDataMod[i]-imgDataOriginal[i]) * (imgDataMod[i]-imgDataOriginal[i]) +
    (imgDataMod[i + 1]-imgDataOriginal[i + 1]) * (imgDataMod[i + 1]-imgDataOriginal[i + 1]) +
    (imgDataMod[i + 2]-imgDataOriginal[i + 2]) * (imgDataMod[i + 2]-imgDataOriginal[i + 2]) +
    (imgDataMod[i + 3]-imgDataOriginal[i + 3]) * (imgDataMod[i + 3]-imgDataOriginal[i + 3]);

    datadiff.push(diffPixel);
    max = Math.max(max,diffPixel);

  }
  //console.log("max: "+max);
  //console.log("termino diffdots con i="+i);
  return {datadiff, max};
}

const getMinDistance = (imgDataDiff,max, mouseX, mouseY) =>{
  let minDist = 99999999;//error checker

  let calculatedGraph = document.createElement("canvas");

  calculatedGraph.width=imgWidth;
  calculatedGraph.height=imgHeight;
  //console.log("calculated graph width "+calculatedGraph.width+" height: "+calculatedGraph.height);
  let contextGraph = calculatedGraph.getContext('2d');
  let imgBnW = contextGraph.createImageData(imgWidth,imgHeight);

  var i;
  //console.log("imgdatadiff length: "+imgDataDiff.length+" divisorUmbral: "+divisorUmbral)
  //console.log("MAX: "+max)
  for (i = 0; i < imgDataDiff.length; i ++ ) {
    if (max/divisorUmbral < imgDataDiff[i]){
      let dist = getDistance(mouseX,mouseY,getPixelPosition(i));

      imgBnW.data[i*4] = 0;
      imgBnW.data[i*4+1] = 0;
      imgBnW.data[i*4+2] = 0;
      imgBnW.data[i*4+3] = 255;

      minDist = Math.min(minDist, dist);
    }else{
      imgBnW.data[i*4] = 255;
      imgBnW.data[i*4+1] = 0;
      imgBnW.data[i*4+2] = 0;
      imgBnW.data[i*4+3] = 255;
    }
  }
  // contextGraph.putImageData(imgBnW,0,0);
  //console.log("salio de for con i="+i)
  //console.log(imgBnW);

  if (minDist>=99999999) {
    //console.log("Error getting min distance of image");
  }
  //console.log("Min distance: " + minDist);
  return {
      minDist: minDist,
      imgBnW: imgBnW
    };
}

const getDistance = (mouseX,mouseY,blackDotCoord) => {
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
