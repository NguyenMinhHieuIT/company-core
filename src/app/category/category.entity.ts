
import { Column, Entity, PrimaryGeneratedColumn , OneToMany, ManyToOne, JoinColumn, Tree, TreeChildren, TreeParent } from "typeorm";
import { BaseEntity } from "../common/base.entity";
import { IsNotEmpty } from "class-validator";
import { PostEntity } from "../post/entities/post.entity";
import { ProductEntity } from "../product/product.entity";

@Entity({
  name: 'categories',
})
@Tree("closure-table")
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ name: 'name', length: 255, type: 'varchar' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  name: string;

  @Column({ name: 'type', length: 100, type: 'varchar' })
  @IsNotEmpty({ message: 'Kiểu không được để trống' })
  type: string;

  @Column({name:'image' , default:null , type:'text'})
  image:string;

  @Column({name:'description',nullable: true , length: 500 , type:'varchar'})
  description:string | null

  @Column({name:'is_show_menu', type:'int' , default:0})
  is_show_menu:number;
  
  @OneToMany(()=> PostEntity , (post) => post.category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  posts : PostEntity[]

  @OneToMany(()=> ProductEntity , (product) => product.category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  products : ProductEntity[]

  @TreeChildren()
  children: CategoryEntity[]

  @Column({name:'parentId', type:'int' , default:null , nullable:true })
  parentId:number;

  @TreeParent({ onDelete: 'CASCADE' })
  parent: CategoryEntity

}
