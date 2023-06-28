import fs from 'fs';
import csvparser from 'csv-parser';
import { stringify } from 'csv-stringify';

const readTextFile = async (filePath) => {
  let arr = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvparser({
        //I'm sorry, but...
        //@ts-ignore
        delimiter: ','
      }))
      .on('data', (row) => {
        arr.push(row);
      })
      .on('error', () => {
        reject(Error)
      })
      .on('end', () => {
       // console.log('CSV file successfully processed');
        resolve(arr);
      });
  })
}

//this function takes content parameter which is an array of objects
const writeTextFile = async(filePath, content) => {
  stringify(content, {
    header:true
  }, function (err, output) {
    fs.writeFile(filePath, output, (err) => console.log(err))
  })

}

const convertJsonRowsToCSV  = async (rows) => {
  const converter = require('mk-json-2-csv');
  let result = null;
  const csvOptions = {
      delimiter : {
          wrap  : '\'', // Double Quote (") character
          field : ';', // Comma field delimiter
          array : ',', // Semicolon array value delimiter
          eol   : '\n' // Newline delimiter
      },
      prependHeader    : true,
      sortHeader       : false,
      trimHeaderValues : true,
      trimFieldValues  : true   
  };
  await  converter.json2csvAsync(rows,csvOptions)
         .then(csv=>{result=csv;})
         .catch(err=>{
          console.log('error converting to CSV');
          throw(err);
      })
  return result;
}

export {
  readTextFile, writeTextFile, convertJsonRowsToCSV
};