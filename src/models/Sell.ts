import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Screening } from "./Screening";
import { SeatSell } from "./SeatSell";
import User from "./User";

@Table({
    tableName: 'sell'
})
export class Sell extends Model {
    @HasMany(() => SeatSell, {
        onDelete: 'CASCADE'
    })
    declare seatsSells: SeatSell[]

    @Column({
        type: DataType.DECIMAL
    })
    declare total: number

    @ForeignKey(() => Screening)
    @Column({
        type: DataType.INTEGER
    })
    declare screening_id: number

    @BelongsTo(() => Screening)
    declare screening: Screening

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER
    })  
    declare user_id: string

    @BelongsTo(() => User)
    declare user: User
}