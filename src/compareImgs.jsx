var divisorUmbral = 20;
var divisorimg = 2;
var event;
var imgWidth = 320;
var imgHeight = 200;

export const compareImgs = (evt,imgO,aswArr, width, height, umb, divisorimagen) => {
  imgWidth=width;
  imgHeight=height;
  if (typeof umb !== 'undefined'){
    divisorUmbral  = umb;
   }
   if (typeof divisorimagen !== 'undefined'){
      divisorimg = divisorimagen;
    }
    return initCompare(evt,imgO,aswArr);
}

const initCompare = (event, originalImg, answersArray) =>{
  let {x,y} = getClickPosition(event);
  let imgDataArray= [];
  let clickedImag = new Image();
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
    return {x,y};
}

//asynchronous
//Modelado de objeto
// dataArray: context.getImageData(0,0,img.width,img.height).data,
// width: img.width,
// height: img.height
const loadImages = (originalImg, answersArray, imgDataArray, x, y,index)  =>{
  return new Promise( (resolve,reject) => {
    if (index>=answersArray.length){
      let img = new Image();
      let context = document.createElement("canvas").getContext('2d');
      img.onload = () => {
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
      let context = document.createElement("canvas").getContext('2d');
      img.onload = () => {
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
  let minDist = [];
  let dataArrayOriginal = originalImg.dataArray;

  //set array of distances
  for (let i=0; i<imgDataArray.length;i++){
    let dataArrayAnswers = imgDataArray[i].dataArray;
    let {datadiff, max} = getDiffDotsAndMax(dataArrayOriginal,dataArrayAnswers);
    minDist.push(getMinDistance(datadiff, max, x, y));
  }

  //get closest distance
  closestDistance = Math.min(...minDist);

  //get closest element index
  minDist.map((value,index) => {
    if (value==closestDistance) {
      closestImgIndex=index;
    }
  })

  //validate
  if (closestDistance<0) {
    console.log("Error: cannot get closest distance");
    return null;
  }

  console.log("closestDistance: " + closestDistance);
  return closestImgIndex;

}

const getDiffDotsAndMax = (imgDataOriginal, imgDataMod) => {
  let datadiff = [];
  let max = 0;
  for ( var i = 0, l = imgDataMod.length; i < l; i += 4 ) {
    let diffPixel = (imgDataMod[i]-imgDataOriginal[i]) * (imgDataMod[i]-imgDataOriginal[i]) +
    (imgDataMod[i + 1]-imgDataOriginal[i + 1]) * (imgDataMod[i + 1]-imgDataOriginal[i + 1]) +
    (imgDataMod[i + 2]-imgDataOriginal[i + 2]) * (imgDataMod[i + 2]-imgDataOriginal[i + 2]) +
    (imgDataMod[i + 3]-imgDataOriginal[i + 3]) * (imgDataMod[i + 3]-imgDataOriginal[i + 3]);

    datadiff.push(diffPixel);
    max = Math.max(max,diffPixel);
  }
  return {datadiff, max};
}

const getMinDistance = (imgDataDiff,max, mouseX, mouseY) =>{
  let minDist = 999999999;//error checker

  for ( var i = 0; i < imgDataDiff.length; i ++ ) {
    if (max/divisorUmbral < imgDataDiff[i]){
      let dist = getDistance(mouseX,mouseY,getPixelPosition(i));
      minDist = Math.min(minDist, dist);
    }
  }
  console.log("Min distance: " + minDist);
  return minDist;
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

export const getContrast = (imgDataDiff,max) => { //pendiente handlear img bnw
  let calculatedGraph = document.createElement("canvas");
  let contextGraph = calculatedGraph.getContext('2d');
  let imgBnW = contextGraph.createImageData(320,200);
  contextGraph.putImageData(imgBnW,0,0);

  for ( var i = 0; i < imgDataDiff.length; i ++ ) {
    if (max/divisorUmbral < imgDataDiff[i]){
      imgBnW.data[i*4]=0;
      imgBnW.data[i*4+1]=0;
      imgBnW.data[i*4+2]=0;
      imgBnW.data[i*4+3]=255;
    }else{
      imgBnW.data[i*4]=255;
      imgBnW.data[i*4+1]=255
      imgBnW.data[i*4+2]=255;
      imgBnW.data[i*4+3]=255;
    }
  }
  return imgBnW;
}
