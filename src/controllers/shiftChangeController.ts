import * as express from 'express';
import * as mongoose from 'mongoose';
import ShiftChangeService from '../services/shiftChangeService';
import ShiftChangeRequestSchema from '../models/shiftChangeRequestModel';

export default class ShiftChangeController {
    private service: ShiftChangeService;

    constructor(service: ShiftChangeService) {
        this.service = service;
    }

    getShiftChangeRequests = async (
        req: express.Request,
        res: express.Response,
        next?: express.NextFunction
    ) => {
        const shiftChangeRequests = await this.service.getShiftChangeRequests();
        return res.status(200).json(shiftChangeRequests);
    }

    createShiftChangeRequest = async (
        req: express.Request,
        res: express.Response,
        next?: express.NextFunction
    ) => {
        try {
            const shiftChangeRequest = new ShiftChangeRequestSchema(req.body);
            await shiftChangeRequest.validate();
            await this.service.createShiftChangeRequest(shiftChangeRequest);
            return res.status(201).json(shiftChangeRequest);
        }
        catch (err) {
            const errMessage = { message: err.message }
            if (ErrorEvent.name === "ValidationError") {
                return res.status(400).json(errMessage);
              }
              return res.status(500).json(errMessage);
        }

    }

    updateShiftChangeRequest = async (
        req: express.Request,
        res: express.Response,
        next?: express.NextFunction
    ) => {

    }

    deleteShiftChangeRequest = async (
        req: express.Request,
        res: express.Response,
        next?: express.NextFunction
    ) => {

    }

    approveShiftChangeRequest = async (
        req: express.Request,
        res: express.Response,
        next?: express.NextFunction
    ) => {

    }
}