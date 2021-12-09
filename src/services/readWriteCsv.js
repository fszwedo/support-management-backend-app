import fs from 'fs';
import csvparser from 'csv-parser';
import { stringify } from 'csv-stringify';

const readTextFile = async (filePath) => {
  let arr = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvparser({
        delimiter: ','
      }))
      .on('data', (row) => {
        arr.push(row);
      })
      .on('error', () => {
        reject(error)
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

export {
  readTextFile, writeTextFile
};