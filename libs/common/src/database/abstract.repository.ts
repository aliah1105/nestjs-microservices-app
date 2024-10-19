import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.schema";
import { Logger, NotFoundException } from "@nestjs/common";

export class AbstractRepository<TDocument extends AbstractDocument> {
    protected readonly logger: Logger;
    constructor(protected readonly model: Model<TDocument>) { }

    async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
        const createdDocument = new this.model({
            ...document,
            _id: new Types.ObjectId(),
        });
        return (await createdDocument.save()).toJSON() as unknown as TDocument;
    }

    async findOne(query: FilterQuery<TDocument>): Promise<TDocument> {
        const document = await this.model.findOne(query).lean<TDocument>(true);
        if (!document) {
            this.logger.warn(`Document not found for query: ${JSON.stringify(query)}`);
            throw new NotFoundException('Document not found with given query');
        }
        return document;
    }

    async findOneAndUpdate(query: FilterQuery<TDocument>, update: UpdateQuery<TDocument>): Promise<TDocument> {
        const updatedDocument = await this.model.findOneAndUpdate(query, update, { new: true }).lean<TDocument>(true);
        if (!updatedDocument) {
            this.logger.warn(`Document not found for query: ${JSON.stringify(query)}`);
            throw new NotFoundException('Document not found with given query');
        }
        return updatedDocument;
    }

    async find(query: FilterQuery<TDocument>): Promise<TDocument[]> {
        return await this.model.find(query).lean<TDocument[]>();
    }

    async findOneAndDelete(query: FilterQuery<TDocument>): Promise<TDocument> {
        return await this.model.findOneAndDelete(query).lean<TDocument>(true);
    }
}