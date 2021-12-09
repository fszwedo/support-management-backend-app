import express from "express";
import { readTextFile , writeTextFile } from '../services/readWriteCsv.js'

const router = express.Router();

router.get('/', async (req,res) => {
    const fileContent =  await readTextFile('./src/lastAssignmentTimestamps.csv')
    res.send(fileContent);
})

router.post('/', async (req,res) => {
    //verify the file content here
    const fileContent =  await readTextFile('./src/lastAssignmentTimestamps.csv');

    console.log(req.body)
    writeTextFile('./src/newdata.csv', req.body)

    //console.log(fileContent[0]);
    //const fileContent =  await readTextFile('./src/lastAssignmentTimestamps.csv')
    res.send(fileContent);
})

export default router;