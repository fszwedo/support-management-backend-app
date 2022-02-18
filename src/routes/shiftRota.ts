import express from "express";
import { readTextFile , writeTextFile } from '../services/readWriteCsv'
import shiftRotaRepository from "../repositories/shiftRotaRepository";
import shiftRotaService from "../services/shiftRotaServices";
import shiftRotaModel from "../models/shiftRotaModel";

const router = express.Router();
const shiftRota = new shiftRotaService(new shiftRotaRepository(shiftRotaModel));

router.get('/', async (req,res) => {
    res.send(await shiftRota.getAllShifts());
})

router.get('/:id', async (req,res) => {
    const fileContent =  await readTextFile('./src/lastAssignmentTimestamps.csv')
    res.send(fileContent);
})

router.post('/', async (req,res) => {
    //verify the file content here 
    //res.send(fileContent);
})

router.put('/', async (req,res) => {
    //verify the file content here
    const fileContent =  await readTextFile('./src/lastAssignmentTimestamps.csv');
    writeTextFile('./src/newdata.csv', req.body)

    res.send(fileContent);
})

export default router;