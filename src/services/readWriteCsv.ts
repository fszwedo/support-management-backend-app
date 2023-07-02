import fs from 'fs';
import csvparser from 'csv-parser';
import { stringify } from 'csv-stringify';
import * as converter from 'json-2-csv';

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
const writeTextFile = async (filePath, content) => {
  stringify(content, {
    header: true
  }, function (err, output) {
    fs.writeFile(filePath, output, (err) => console.log(err))
  })
}

const convertToCSV = async (json, columns?: string[]) => {
  let result = null;
  const csvOptions = {
    delimiter: {
      wrap: '\'', // Double Quote (") character
      field: ';', // Comma field delimiter
      array: ',', // Semicolon array value delimiter
      eol: '\n' // Newline delimiter
    },
    prependHeader: true,
    sortHeader: false,
    trimHeaderValues: true,
    trimFieldValues: true,
    keys: columns,
    useLocaleFormat : true
  };
  await converter.json2csv(json, csvOptions)
    .then(csv => { result = csv; })
    .catch(err => {
      console.log('error converting to CSV');
      throw (err);
    })
  return result;
}

export { readTextFile, writeTextFile, convertToCSV};

