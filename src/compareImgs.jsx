import React,{ Component } from 'react';

//Default values
let divisorUmbral = 20;
let wantedSize = 80;
let imgWidth;
let imgHeight;
let mouseX = 0;
let mouseY = 0;

let errorStructure = {
  id: '',
  text: ''
}

let BnWCanvas = [];

export const getBnWImages = (originalImg, answersArray, umbral,compression) => {
  if(umbral !== undefined){
    divisorUmbral = umbral;
  }
  if (compression !== undefined){
      wantedSize=compression;
  }
  return initCompareBnW(originalImg,answersArray);
};

export const compareImgs = (evt,imgO,aswArr, umb, divisorimagen) => {

  if (typeof umb !== undefined){
    divisorUmbral  = umb;
   }
   if (typeof divisorimagen !== undefined){
       wantedSize = divisorimagen;
    }
    return initCompare(evt,imgO,aswArr);
};

const initCompare = (event, originalImg, answersArray) =>{
  let imgDataArray= [];
  event.persist();
  return new Promise( (resolve,reject) => {
    loadImages(originalImg,answersArray, imgDataArray,0).then(
      (object) => {
        let errors = [];
        errors.push (...object.errors);
        setClickPosition(event);
        let closestElementIndex = getClosestElement(object.originalImg1,object.imgDataArray);
        errors.push (...closestElementIndex.errors);
        resolve({
          index: closestElementIndex.index,
          width: imgWidth,
          height: imgHeight,
          errors: errors
        });
      }
    );
  })
};

const setClickPosition = (event)=>{
    let canvas = event.target;
    let rect = canvas.getBoundingClientRect();
    let x = Math.floor(event.clientX - rect.left);
    let y = Math.floor(event.clientY - rect.top);
    let coordXY = {
      x: x,
      y: y
    }, oldSize = {
      width: canvas.width,
      height: canvas.height
    }, newSize = {
      width: imgWidth,
      height: imgHeight
    };
    let newCoordMouse = convertCoord(coordXY,oldSize,newSize);
    mouseX =  Math.floor(newCoordMouse.x);
    mouseY =  Math.floor(newCoordMouse.y);
};

const convertCoord = (coordXY,oldSize,newSize) =>{
  let oldWidth = oldSize.width;
  let oldHeight = oldSize.height;
  let newWidth = newSize.width;
  let newHeight = newSize.height;
  let widthRelation = newWidth/oldWidth;
  let heightRelation = newHeight/oldHeight;
  return {
    x: coordXY.x*widthRelation,
    y: coordXY.y*heightRelation
  }
};

const loadImages = (originalImg, answersArray, imgDataArray,index)  =>{
    let errors = [];
    return new Promise( (resolve,reject) => {
        let img = new Image();
        let canvas = document.createElement("canvas");
        let context = canvas.getContext('2d');
        if (index>=answersArray.length){
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                resize(wantedSize,canvas);
                context.drawImage(img, 0, 0);
                console.log(imageData);
                let imageData = context.getImageData(0,0,canvas.width,canvas.height);
                let originalImg1 = {
                    dataArray: imageData.data,
                    width: imageData.width,
                    height: imageData.height
                };
                imgWidth=imageData.width;
                imgHeight=imageData.height;
                let differentImgs = 0;
                for (let i=0; i<imgDataArray.length; i++){
                  if (imgWidth!=imgDataArray[i].width || imgHeight!=imgDataArray[i].height){
                    differentImgs++;
                  }
                }
                if (differentImgs>0){
                  let error = Object.assign ({},errorStructure);
                  error.id = 'imgSize';
                  error.text = differentImgs+' images sizes differ from the original image';
                  errors.push(error);
                }
                resolve({
                    originalImg1 : originalImg1,
                    imgDataArray : imgDataArray,
                    errors: errors
                });
            };
            img.crossOrigin = 'Anonymous';
            img.src = originalImg;
        }else{
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                resize(wantedSize,canvas);
                context.drawImage(img, 0, 0);
                let imageData = context.getImageData(0,0,canvas.width,canvas.height);
                imgDataArray.push({
                    dataArray: imageData.data,
                    width: imageData.width,
                    height: imageData.height
                });
                loadImages(originalImg, answersArray,imgDataArray,index+1).then(
                    (resolved) => {
                        resolve(resolved);
                    }
                );
            };
            img.crossOrigin = 'Anonymous';
            img.src = answersArray[index].url;
        }
    });

};

const resize = (wantedSize, canvas) => {
    let {width,height} = canvas;
    let context = canvas.getContext('2d');
    if ((width)>=(height)){
        let divisorWidth = wantedSize/(canvas.width);
        let widthHeightRelation = (canvas.height)/(canvas.width);
        let divisorHeight = (wantedSize*widthHeightRelation)/(canvas.height);
        canvas.width = wantedSize;
        canvas.height = wantedSize*widthHeightRelation;
        context.scale(divisorWidth,divisorHeight);
    }
    else{
        let divisorHeight = wantedSize/canvas.height;
        let widthHeightRelation = canvas.width/canvas.height;
        let divisorWidth = (wantedSize*widthHeightRelation)*canvas.width;
        canvas.width = wantedSize*widthHeightRelation;;
        canvas.height = wantedSize;
        context.scale(divisorWidth,divisorHeight);
    }
};

const getClosestElement = (originalImg, imgDataArray) => {
  let closestDistance= -1;//error checker
  let closestImgIndex;
  let minDists = [];
  let dataArrayOriginal = originalImg.dataArray;
  let errors =[];
  let errorAt = {
    getDiffDotsAndMax: false,
    getMinDistance: false
  }
  //set array of distances
  for (let i=0; i<imgDataArray.length;i++){
    let dataArrayAnswers = imgDataArray[i].dataArray;
    let {datadiff, max} = getDiffDotsAndMax(dataArrayOriginal,dataArrayAnswers);
    let resultado = getMinDistance(datadiff, max);
    let minDist = resultado.value;
    if (resultado.errors.length>0){

      errors.push(...resultado.errors);
    }
    minDists.push(minDist);
  }

  //get closest distance
  closestDistance = Math.min(...minDists);

  //get closest element index
  minDists.map((value,index) => {
    if (value==closestDistance) {
      closestImgIndex=index;
    }
  });

  //validate
  if (closestDistance<0) {
    let error = Object.assign ({},errorStructure);
    error.id = "minDistances";
    error.text='Error getting min distances';
    errors.push(error);
  }
  return {
    index: closestImgIndex,
    errors: errors
  }
};

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
};

const getMinDistance = (imgDataDiff,max) =>{
  let minDist = -1;//error checker
  let errors = [];
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
    let error = Object.assign ({},errorStructure);
    error.id = "minDistance";
    error.text = 'Error al recorrer dataimg, puede ser undefined o tener length 0'
    errors.push(error);
  }
  return {
      value: minDist,
      errors: errors
    };
};

const getDistance = (blackDotCoord) => {
  const distX = Math.pow((mouseX - blackDotCoord.x),2);
  const distY =  Math.pow((mouseY - blackDotCoord.y),2);
  return Math.sqrt((distX+distY));
};

const getPixelPosition = (indice) => {
  let x,y;
  y = Math.floor(indice/imgWidth);
  x = Math.floor(indice - y*imgWidth);
  return {x,y};

};

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
};

const setBnWDataArray = (dataArrayOriginal, imgDataArray) => {

  for (let i=0; i<imgDataArray.length;i++){
    let dataArrayAnswers = imgDataArray[i].dataArray;
    let {datadiff, max} = getDiffDotsAndMax(dataArrayOriginal,dataArrayAnswers);
    setBnWData(datadiff, max);
  }
};

const setBnWData = (imgDataDiff,max) =>{ //similar to getMinDistance
  let context = document.createElement("canvas").getContext('2d');
  let imgBnW = context.createImageData(imgWidth,imgHeight);
  for ( let i = 0; i < imgDataDiff.length; i ++ ) {
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
  BnWCanvas.push(imgBnW);
};
