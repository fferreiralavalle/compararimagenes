const imgOriginal = '/assets/messi_original.small.jpeg';
const pelota = "/assets/messi_bocha.small.jpeg";
const imgWidth = 320;
const imgHeight = 200;
const divisorUmbral = 20;



export const compareImgs = (event, originalImg, urls) =>{
  console.log(event);
  let {x,y} = getPosition(event);
  let imgDataArray= [];
  console.log("Las urls son: "+urls);
  console.log("fin urls");
  console.log();
  loadImages(originalImg,urls, imgDataArray, x, y,0);//revisar si es o no con parentesis
}

export const getDistance = (mouseX,mouseY,blackDotCoord) => {

  const distX = Math.pow((mouseX - blackDotCoord.x),2);
  const distY =  Math.pow((mouseY - blackDotCoord.y),2);
  return Math.sqrt((distX+distY));
}

export const getCoord = (indice) => {
  let x,y;
  y = Math.floor(indice/imgWidth);
  x = Math.floor(indice - y*imgWidth);
  return {x,y};

}

export const initCompare = (originalImg, imgDataArray, x, y) => {
  let imgBnWMin = [];
  let closestDistance= -1;//error checker
  console.log(imgDataArray);
  for (let i=0; i<imgDataArray.length;i++){
    let {datadiff, max} = getDiffDotsAndMax(originalImg,imgDataArray[i]);
    let {imgBnW,minDist} = getMinDistanceFromClick(datadiff, max, x, y);
    if (i==0){
      closestDistance = minDist;
      imgBnWMin = imgBnW;
    }
    else{
      closestDistance = Math.min(closestDistance,minDist);
      imgBnWMin = imgBnW;
    }
  }
  console.log("closestDistance: " + closestDistance);
  return {imgBnWMin,closestDistance};
}

export const getDiffDotsAndMax = (imgDataOriginal, imgDataMod) => {
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
  console.log("max: "+max);
  return {datadiff, max};
}

export const getMinDistanceFromClick = (imgDataDiff,max, mouseX, mouseY) =>{
  let calculatedGraph = document.createElement("canvas");
  let contextGraph = calculatedGraph.getContext('2d');
  let imgBnW = contextGraph.createImageData(320,200);
  contextGraph.putImageData(imgBnW,0,0);

  let minDist = 999999999;//error checker

  // if (imgDataDiff.length>0){
  //   minDist = imgDataDiff[0];
  // }
  console.log(mouseX,mouseY);
  for ( var i = 0; i < imgDataDiff.length; i ++ ) {
    if (max/divisorUmbral < imgDataDiff[i]){
      imgBnW.data[i*4]=0;
      imgBnW.data[i*4+1]=0;
      imgBnW.data[i*4+2]=0;
      imgBnW.data[i*4+3]=255;
      let dist = getDistance(mouseX,mouseY,getCoord(i));
      minDist = Math.min(minDist, dist);
    }else{
      imgBnW.data[i*4]=255;
      imgBnW.data[i*4+1]=255
      imgBnW.data[i*4+2]=255;
      imgBnW.data[i*4+3]=255;
    }
  }
  console.log("Min distance: " + minDist);
  return {imgBnW,minDist};
}

//asynchronous
export const loadImages = (originalImg, urls, imgDataArray, x, y,index)  =>{
  if (index>=urls.length)
  {
    let img = new Image();
    let context = document.createElement("canvas").getContext('2d');
    img.onload = () => {
      context.drawImage(img, 0, 0);
      let originalImg = context.getImageData(0,0,img.width,img.height).data;
      initCompare(originalImg, imgDataArray, x, y);
    }
    img.src = originalImg;
  }
  else
  {
    let img = new Image();
    let context = document.createElement("canvas").getContext('2d');
    img.onload = () => {
      context.drawImage(img, 0, 0);
      imgDataArray.push(context.getImageData(0,0,img.width,img.height).data);
      loadImages(originalImg, urls,imgDataArray, x, y,index+1); //splice saca valores a partir de una posicion
      // callback(context.getImageData(0,0,img.width,img.height).data);
    };
    img.src = urls[index];
  }
}


export const getPosition = (event)=>{
    let canvas = document.getElementById("canvasPrincipal");
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    console.log("x: " + x + "  y: " + y);
    return {x,y};

}
