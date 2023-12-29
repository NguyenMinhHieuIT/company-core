import { IsNotEmpty, MaxLength } from "class-validator";
import { BaseEntity } from "../../common/base.entity";
import { Entity, PrimaryGeneratedColumn , Column } from "typeorm";


@Entity({
    name:'settings'
})
export class SettingEntity extends BaseEntity {
    @PrimaryGeneratedColumn({name:'id' , type:'int'})
    id:number;
    
    @Column({type:'varchar' , name:'name' , length:255})
    @IsNotEmpty({message:'Tên không được rỗng'})
    name:string;

    @Column({type:'varchar' , name:'value' , length:255})
    @IsNotEmpty({message:'Giá trị không được rỗng'})
	value :string;

    @Column({type:'varchar' , name:'description' , length:500 , nullable:true })
	description:string;

}
