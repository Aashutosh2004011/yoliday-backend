import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    Default,
    AllowNull,
    ForeignKey,
    BelongsTo
  } from 'sequelize-typescript';
  import { User } from './user.model';      
  import { Project } from './project.model';
  
  @Table({
    tableName: 'Carts',
    timestamps: true
  })
  export class Cart extends Model{
  
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
      type: DataType.UUID,
      allowNull: false
    })
    id!: string;
  
    @ForeignKey(() => User)
    @AllowNull(false)
    @Column({
      type: DataType.UUID
    })
    userId!: string;
  
    @BelongsTo(() => User)
    user!: User;
  
    @ForeignKey(() => Project)
    @AllowNull(false)
    @Column({
      type: DataType.UUID
    })
    projectId!: string;
  
    @BelongsTo(() => Project)
    project!: Project;
  
    @AllowNull(false)
    @Default(1)
    @Column({
      type: DataType.INTEGER
    })
    quantity!: number;
  
    @AllowNull(false)
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    createdAt!: Date;
  
    @AllowNull(false)
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    updatedAt!: Date;
  }
  