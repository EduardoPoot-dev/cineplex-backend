import { BelongsTo, Column, DataType, ForeignKey, Model, Table, Unique } from "sequelize-typescript";
import { Sell } from "./Sell";
import { Screening } from "./Screening";

@Table({
    tableName: 'seatSell'
})
export class SeatSell extends Model {
    @Unique('seat_screening_unique')
    @Column({
        type: DataType.STRING,
    })
    declare name: string

    @ForeignKey(() => Sell)
    @Column({
        type: DataType.INTEGER
    })
    declare sell_id: number

    @BelongsTo(() => Sell)
    declare sell: Sell

    @Unique('seat_screening_unique')
    @ForeignKey(() => Screening)
    @Column({
        type: DataType.INTEGER
    })
    declare screening_id: number

}