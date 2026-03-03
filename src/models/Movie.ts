import { Table, Column, Model, HasMany, DataType, BelongsToMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Screening } from './Screening';
import { Category } from './Category';
import User from './User';

@Table({
    tableName: 'movie',
})
export class Movie extends Model {
    @Column({
        type: DataType.STRING
    })
    declare name: string

    @Column({
        type: DataType.STRING
    })
    declare description: string

    @Column({
        type: DataType.STRING
    })
    declare director: string

    @Column({
        type: DataType.STRING
    })
    declare path: string

    @Column({
        type: DataType.DATE
    })
    declare premiereDate: Date

    @Column({
        type: DataType.STRING
    })
    declare image: string

    @Column({
        type: DataType.INTEGER
    })
    declare hoursDuration: number

    @Column({
        type: DataType.INTEGER
    })
    declare minutesDuration: number

    @Column({
        type: DataType.DECIMAL
    })
    declare rate: number

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare hasScreenings: boolean

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare showHeader: boolean

    @HasMany(() => Screening, {
        onDelete: 'CASCADE'
    })
    declare screenings: Screening[]

    @ForeignKey(() => Category)
    @Column({
        type: DataType.INTEGER
    })
    declare category_id: number

    @BelongsTo(() => Category)
    declare category: Category

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER
    })
    declare creator_id: number

    @BelongsTo(() => User)
    declare user: User
}