import { BaseEntity } from "../../common/base.entity";
import { Column, Entity, PrimaryColumn , JoinColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CategoryEntity } from "src/app/category/category.entity";
import { ManyToOne } from "typeorm";
import { UserEntity } from "src/app/user/user.entity";
import { type } from "os";
import { CommentEntity } from "src/app/comment/comment.entity";

@Entity({
    name:'posts'
})
export class PostEntity extends BaseEntity{
    @PrimaryGeneratedColumn({type:'int'  , name:'id'})
    id:number;

    @Column({name:'title' , type:'varchar'})
    title: string;
  
    @Column({name:'content' , type:'text'})
	content:string;

    @Column({name:'image' , type:'text'})
	image :string;

    @Column({name:'published_at' ,type:'datetime', nullable:true }) 
	published_at:Date | null

    @Column({name:'description' , type:'varchar' , nullable:true})
	description :string;

    @Column({type:'int' , name:'category_id'})
    category_id:number;

    @Column({type:'int' , name:'user_id'})
    user_id:number;

    @ManyToOne(() => CategoryEntity  , (category) => category.posts, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      } )
    @JoinColumn({name:'category_id'})
    category:CategoryEntity

    @ManyToOne(() => UserEntity , user => user.posts, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    @JoinColumn({name:'user_id'})
    user:UserEntity

    @OneToMany(() => CommentEntity, comment => comment.post, {
      onDelete : "CASCADE",
      onUpdate : "CASCADE",
    })
    @JoinColumn({name : 'comment_id'})
    comments : CommentEntity[]
}
