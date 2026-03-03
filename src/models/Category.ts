import { Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Movie } from "./Movie";

@Table({
    tableName: 'category'
})
export class Category extends Model {
    @Column({
        type: DataType.STRING
    })
    declare name: string

    @HasMany(() => Movie, {
        onDelete: 'CASCADE'
    })
    declare movies: Movie[]

}