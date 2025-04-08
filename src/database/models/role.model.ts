import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    AllowNull,
    Unique,
    HasMany
} from 'sequelize-typescript';
import { User } from './user.model';

@Table({
    tableName: 'Roles',
    timestamps: true
})
export class Role extends Model {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    id!: string;

    @AllowNull(false)
    @Unique
    @Column({
        type: DataType.STRING
    })
    name!: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    description?: string;

    @AllowNull(false)
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    createdAt!: Date;

    @AllowNull(false)
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    updatedAt!: Date;

    @HasMany(() => User)
    projects!: User[];
}
