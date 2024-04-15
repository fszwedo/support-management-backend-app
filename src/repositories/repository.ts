import * as mongoose from "mongoose";

export type MongoModel = mongoose.Model<any & mongoose.Document>;

export class Repository {
  model: MongoModel;
  constructor(model: MongoModel) {
    this.model = model;
    return this;
  }

  async getAll() {
    return this.model.find().lean();
  }

  async getById(id: mongoose.ObjectId) {
    return this.model.findOne({ _id: id });
  }

  async find(query) {
    return this.model.find(query);
  }

  async findOne(query) {
    return this.model.findOne(query);
  }

  async create(obj: object) {
    return this.model.create(obj);
  }

  async updateById(id: mongoose.ObjectId, payload: object) {
    return await this.model.findByIdAndUpdate(id, payload, { useFindAndModify: false, upsert: false });
  }

  async deleteByID(id: mongoose.ObjectId) {
    return this.model.findByIdAndDelete({ _id: id });
  }

  async save(document: mongoose.Document) {
    return document.save();
  }

  async deleteMany(filter) {
    return this.model.deleteMany(filter);
  }
}
