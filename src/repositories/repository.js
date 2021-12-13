import * as mongoose from 'mongoose';

export class Repository {
    model;
    constructor(model){
        this.model = model;
        return this;
    }

    async getAll() {
        return this.model.find();
    }

    async getById(id) {
        return this.model.findOne(id);
    }

    async create(obj) {
        this.model.create(obj);
    }

    async updateById() {

    }

    async deleteByID(){

    }

    async save(document){
        return document.save();
    }
}