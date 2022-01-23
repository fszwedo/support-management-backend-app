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

    async updateById(id, payload) {
        return await this.model.findByIdAndUpdate(id, payload, {useFindAndModify: false, upsert: false});
    }

    async deleteByID(id){
        return this.model.findByIdAndDelete({_id: id});
    }

    async save(document){
        return document.save();
    }
}