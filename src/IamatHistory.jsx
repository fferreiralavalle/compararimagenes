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
