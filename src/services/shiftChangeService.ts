import ShiftChangeRepository from "../repositories/shiftChangeRequestRepository";
import { ShiftChangeRequest } from "../models/shiftChangeRequestModel";
import ShiftRotaRepository from "../repositories/shiftRotaRepository";
import mongoose from 'mongoose';
import { ShiftRota } from "../models/shiftRotaModel";

export default class ShiftChangeService {
    private shiftChangeRepository: ShiftChangeRepository;
    private shiftRotaRepository: ShiftRotaRepository;

    constructor(shiftChangeRepository: ShiftChangeRepository, shiftRotaRepository: ShiftRotaRepository){
        this.shiftChangeRepository = shiftChangeRepository;
        this.shiftRotaRepository = shiftRotaRepository;
    }

    getShiftChangeRequests = async () => {
        return this.shiftChangeRepository.getAll();
    }

    createShiftChangeRequest = async (shiftRotaChangeRequest) => {
        return this.shiftChangeRepository.create(shiftRotaChangeRequest);
    }

    deleteShiftChangeRequest = async (id) => {
        return this.shiftChangeRepository.deleteByID(id);
    }

    approveShiftChangeRequest = async (id) => {
        const shiftChangeRequest: ShiftChangeRequest = await this.shiftChangeRepository.getById(id) 

        //iterate over the changes in a single request
        for(let i = 0; i < shiftChangeRequest.requestedChanges.length; i++){
            const shiftRotaToBeAdjusted: ShiftRota = await this.shiftRotaRepository.getShiftsForSpecifiedDay(new Date(shiftChangeRequest.requestedChanges[i].date))[0];
            const agentIndex = shiftRotaToBeAdjusted.agents.findIndex(el => el === shiftChangeRequest.agent);
            //replace element at agents index with incoming change
            shiftRotaToBeAdjusted.hours[agentIndex] = shiftChangeRequest.requestedChanges[i].hours;
            this.shiftRotaRepository.updateById(shiftRotaToBeAdjusted._id, shiftRotaToBeAdjusted);
        }

        this.shiftChangeRepository.deleteByID(shiftChangeRequest._id);
    }
}