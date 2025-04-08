import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    AllowNull,
    ForeignKey,
    BelongsTo,
    HasMany
} from 'sequelize-typescript';
import { Category } from './category.model';
import { User } from './user.model';
import { ProjectImage } from './projectImage.model';
import { Cart } from './cart.model';

@Table({
    tableName: 'Projects',
    timestamps: true
})
export class Project extends Model {

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
    title!: string;

    @AllowNull(true)
    @Column({
        type: DataType.TEXT
    })
    description?: string;

    @AllowNull(false)
    @ForeignKey(() => Category)
    @Column({
        type: DataType.UUID
    })
    category!: string;

    @BelongsTo(() => Category)
    categoryDetails!: Category;

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    author!: string;

    @BelongsTo(() => User)
    userDetails!: User;

    @AllowNull(true)
    @Column({
        type: DataType.STRING
    })
    image_url?: string;

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

    @HasMany(() => ProjectImage)
    projectImages !: ProjectImage[];

    @HasMany(() => Cart)
    cart!: Cart[];
}
