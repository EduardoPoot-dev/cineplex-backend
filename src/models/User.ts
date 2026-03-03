import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Sell } from "./Sell";
import { Movie } from "./Movie";
import { Screening } from "./Screening";


@Table({
    tableName: 'user'    
})
export default class User extends Model {
    @Column({
        type: DataType.STRING
    })
    declare name: string

    @Column({
        type: DataType.STRING
    })
    declare email: string

    @Column({
        type: DataType.STRING
    })
    declare password: string

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare isAdmin: boolean

    @HasMany(() => Sell)
    declare sells: Sell[]

    @HasMany(() => Movie)
    declare movies: Movie[]

    @HasMany(() => Screening)
    declare screenings: Screening[]
}