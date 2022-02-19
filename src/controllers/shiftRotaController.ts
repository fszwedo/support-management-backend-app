import * as express from 'express';

import ShiftRotaService from '../services/shiftRotaService';

export default class ShiftRotaController {
    private service: ShiftRotaService
    constructor(service: ShiftRotaService){
        this.service = service;
    }

    getShiftRotaData = async (
        req: express.Request,
        res: express.Response,
    ) => {
        const shiftRotas = await this.service.getAllShifts();
        res.status(200).json(shiftRotas)
    }

    //we get a date here in req.body, then we search for an entry for selected date and return it
    getShiftRotaForSelectedDate = async (
        req: express.Request,
        res: express.Response,
    ) => {
        const shiftRota = await this.service.getShiftsForSpecifiedDay(req.params.date);
        res.status(200).json(shiftRota)
    }

    //we adjust the shift rota entry with the received data
    setShiftRotaForSelectedDate = async (
        req: express.Request,
        res: express.Response,
    ) => {
        const adjustedShiftRota = await this.service.saveShiftRotaEntry(req.body.shiftData)
        res.status(200).json(adjustedShiftRota)
    }
}