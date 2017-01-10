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
  return histories.map((history) =>{
    if (history.data.type==dataType){
      return history;
    }
  });
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
      let {image} = answer;
      return parseImageUrl(image,formatImgNumber);
  });

  let originalImg = Object.assign ({},answersStructure);
  originalImg.url = parseImageUrl(image,formatImgNumber);
  original.text = question;
  return {
    question: originalImg,
    answers: loadableAnswers
  }
}

const parseImageUrl = (image, formatNumber)=>{
  let {ext,filename,basepath,formats} = image;
  let url;
  if (formatNumber>=formats.lenth)
    formatNumber = formats.lenth - 1;
  else
    if (formatNumber<0)
      formatNumber = 0;

  url = basepath+filename+formats[formatNumber]+ext;
  return url;


}
