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
  import { Project } from './project.model';
  
  @Table({
    tableName: 'ProjectImages',
    timestamps: true
  })
  export class ProjectImage extends Model{
  
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column({
      type: DataType.UUID,
      allowNull: false
    })
    id!: string;
  
    @ForeignKey(() => Project)
    @AllowNull(false)
    @Column({
      type: DataType.UUID
    })
    projectId!: string;
  
    @BelongsTo(() => Project)
    project!: Project;
  
    @AllowNull(false)
    @Column({
      type: DataType.STRING
    })
    image_url!: string;
  
    @AllowNull(true)
    @Column({
      type: DataType.STRING
    })
    caption?: string;
  
    @AllowNull(false)
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    createdAt!: Date;
  
    @AllowNull(false)
    @Default(DataType.NOW)
    @Column(DataType.DATE)
    updatedAt!: Date;
  }
  