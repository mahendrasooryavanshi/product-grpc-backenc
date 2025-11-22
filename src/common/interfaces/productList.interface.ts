export interface MongoProduct {
    _id: any;
    name: string;
    price: number;
    stock: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
