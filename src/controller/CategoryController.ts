import { Request, Response } from "express";
import { Category } from "../models/Category";

export class CategoryController {
    static async getCategories(req: Request, res: Response) {
        try {
            const categories = await Category.findAll()
            res.json(categories)
        } catch (error) {
            
        }
    }
}