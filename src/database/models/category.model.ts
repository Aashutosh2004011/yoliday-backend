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
import { Project } from './project.model';

@Table({
    tableName: 'Categories',
    timestamps: true
})
export class Category extends Model {

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
        type: DataType.TEXT
    })
    description?: string;

    @AllowNull(false)
    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE
    })
    createdAt!: Date;

    @AllowNull(false)
    @Default(DataType.NOW)
    @Column({
        type: DataType.DATE
    })
    updatedAt!: Date;

    @HasMany(() => Project)
    projects!: Project[];
}


