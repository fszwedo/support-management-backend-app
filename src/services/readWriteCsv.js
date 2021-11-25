import fs from 'fs';
import csvparser from 'csv-parser';

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

export {
  readTextFile
};