var divisorUmbral = 20;
var imageDataArray = [];

//hardcodeados
var imgWidth = 2440;
var imgHeight = 1639;

export const getBnWImages = (originalImg, answersArray, umbral) => {
  if(umbral !== undefined){
    divisorUmbral = umbral;
  }
  return initCompare(originalImg,answersArray);
}

const initCompare = (originalImg, answersArray) =>{
  let imgDataArray= [];
  return new Promise( (resolve,reject) => {
    loadBnWImages(originalImg,answersArray,imgDataArray, 0).then(
      (bnwDataArray) => {
        resolve({
          dataArray: bnwDataArray,
          width: imgWidth,
          height: imgHeight
        });
      }
    );
  })
}

const loadBnWImages = (originalImg, answersArray, imgDataArray, index)  =>{
  return new Promise( (resolve,reject) => {
    if (index>=answersArray.length){ // si es el ultimo
      let img = new Image();
      let context = document.createElement("canvas").getContext('2d');
      img.onload = () => {
        context.drawImage(img, 0, 0);
        let originalImgData = context.getImageData(0,0,img.width,img.height).data;
        resolve(getBnWDataArray(originalImgData, imgDataArray));
      }
      img.src = originalImg;
    }else{ //si no es el ultimo
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
        loadBnWImages(originalImg, answersArray,imgDataArray, index+1).then(
          (resolved) => {
            resolve(resolved);
          }
        );
      };
      img.src = answersArray[index].url;
    }
  });
}

const getBnWDataArray = (dataArrayOriginal, imgDataArray) => {
  let bnwDataArray = [];

  for (let i=0; i<imgDataArray.length;i++){
    let dataArrayAnswers = imgDataArray[i].dataArray;
    let {datadiff, max} = getDiffDotsAndMax(dataArrayOriginal,dataArrayAnswers);
    bnwDataArray.push(getBnWData(datadiff, max));
  }
  return bnwDataArray
}

const getDiffDotsAndMax = (imgDataOriginal, imgDataMod) => {
  let datadiff = [];
  let max = 0;
  console.log("mod");
  console.log(imgDataOriginal.length);

  for ( var i = 0; i < imgDataMod.length; i += 4 ) {
    let diffPixel = (imgDataMod[i]-imgDataOriginal[i]) * (imgDataMod[i]-imgDataOriginal[i]) +
    (imgDataMod[i + 1]-imgDataOriginal[i + 1]) * (imgDataMod[i + 1]-imgDataOriginal[i + 1]) +
    (imgDataMod[i + 2]-imgDataOriginal[i + 2]) * (imgDataMod[i + 2]-imgDataOriginal[i + 2]) +
    (imgDataMod[i + 3]-imgDataOriginal[i + 3]) * (imgDataMod[i + 3]-imgDataOriginal[i + 3]);

    datadiff.push(diffPixel);
    max = Math.max(max,diffPixel);

  }
  console.log("max= "+max);
  return {datadiff, max};
}

const getBnWData = (imgDataDiff,max) =>{
  let context = document.createElement("canvas").getContext('2d');
  let imgBnW = context.createImageData(imgWidth,imgHeight);
  let x = 0;
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
      imgBnW.data[i*4+3]=0;
    }
  }
  console.log(imgBnW);
  return imgBnW.data;
}
