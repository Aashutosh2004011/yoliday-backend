import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    AllowNull,
    Unique,
    ForeignKey,
    BelongsTo,
    HasMany
} from 'sequelize-typescript';
import { Role } from './role.model';
import { Project } from './project.model';
import { Cart } from './cart.model';

@Table({
    tableName: 'Users',
    timestamps: true
})
export class User extends Model {

    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    id!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    name!: string;

    @AllowNull(false)
    @Unique
    @Column({
        type: DataType.STRING
    })
    email!: string;

    @AllowNull(false)
    @Column({
        type: DataType.STRING
    })
    password!: string;

    @ForeignKey(() => Role)
    @Column(DataType.UUID)
    role!: string;

    @BelongsTo(() => Role)
    roleDetails!: Role;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    profile_image?: string;

    @AllowNull(false)
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    createdAt!: Date;

    @AllowNull(false)
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    updatedAt!: Date;

    @HasMany(() => Project)
    projects!: Project[];

    @HasMany(() => Cart)
    cart!: Cart[];
}
