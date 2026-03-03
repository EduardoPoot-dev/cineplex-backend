import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Sell } from "./Sell";
import { Screening } from "./Screening";

@Table({
    tableName: 'seat'
})
export class Seat extends Model {
    @Column({
        type: DataType.STRING
    })
    declare name: string
}