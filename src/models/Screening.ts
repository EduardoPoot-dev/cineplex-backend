import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Movie } from "./Movie";
import { Sell } from "./Sell";
import User from "./User";

@Table({
    tableName: 'screening'
})
export class Screening extends Model {
    @Column({
        type: DataType.DATE
    })
    declare date: Date

    @Column({
        type: DataType.DECIMAL
    })
    declare price: number

    @Column({
        type: DataType.INTEGER,
        defaultValue: 96
    })
    declare seatsQuantity: number

    @ForeignKey(() => Movie)
    @Column({
        type: DataType.INTEGER
    })
    declare movie_id: number

    @BelongsTo(() => Movie)
    declare movie: Movie

    @HasMany(() => Sell, {
        onDelete: 'CASCADE'
    })
    declare sell: Sell[]

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER
    })
    declare creator_id: number

    @BelongsTo(() => User)
    declare user: User
}