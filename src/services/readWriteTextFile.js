import fs from 'fs';

const readTextFile = (path) => {
    fs.readFile(path, 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        console.log(data)
      })
}

const writeTextFile = (path, content) => {
    fs.writeFile(path, content, err => {
        if (err) {
          console.error(err)
          return
        }
        console.log('success!!!')
      })
}

export {readTextFile, writeTextFile};