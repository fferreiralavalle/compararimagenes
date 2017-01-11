import React, {Component} from 'react';

let url = "https://api.iamat.com/atcode/iamat-muestra/history";

export const getHistoriesOfType = (type)=>{
  let urlExtra = "/till/now?type="+type;
  return new Promise(
    (resolve,reject) =>
      {
        fetch(url+urlExtra)
          .then( (data) => {
              return data.json();
          })
          .then( (data) => {
            resolve (data);
          })
          .catch( (err) =>{
            reject(err);
          });
      }
    );
}

export const filterDataWithType = (dataType,histories)=>{
  let filteredData = [];
  histories.map((history) =>{
    if (history.data.type==dataType){
      filteredData.push(history);
    }
  });
  return filteredData;
}

export const getLoadableContent = (history,formatImgNumber)=>{
  let {data} = history;
  let {answers,image, question} = data;
  let answersStructure = {
    text: "",
    url: ""
  };
  let loadableAnswers = [];
  loadableAnswers = answers.map( (answer) =>
  {
      let loadableAnswer = Object.assign ({},answersStructure);
      let {image,text} = answer;
      loadableAnswer.url = parseImageUrl(image,formatImgNumber);
      loadableAnswer.text = text;
      return loadableAnswer;
  });
  let originalImg = Object.assign ({},answersStructure);
  originalImg.url = parseImageUrl(image,formatImgNumber);
  originalImg.text = question;
  return {
    question: originalImg,
    answers: loadableAnswers
  }
}

const parseImageUrl = (image, formatNumber)=>{
  let {ext,filename,basePath,formats} = image;
  let url;
  if (formatNumber>=formats.lenth)
    formatNumber = formats.lenth - 1;
  else
    if (formatNumber<0)
      formatNumber = 0;

  url = basePath+filename+"."+formats[formatNumber]+"."+ext;
  console.log("url final: "+url);
  return url;


}
