import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { CategoryEntity } from '../category/category.entity';
import { ProductAttributeValueEntity } from '../product_attribute_value/product_attribute_value.entity';
@Index('name', ['name'], { unique: true })
@Entity('products')
export class ProductEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('varchar', { name: 'name', length: 255 })
    @ApiProperty()
    @IsNotEmpty({
        message: 'tên sản phẩm không được để trống',
    })
    name: string;

    @Column('varchar', { name: 'image', nullable: true, length: 100 })
    // @IsNotEmpty({
    //     message: 'Tên không được để trống',
    // })
    image: string | null;

    @Column('varchar', { name: 'description', nullable: true, length: 100 })
    @IsNotEmpty({
        message: 'description không được để trống',
    })
    description: string | null;

    @Column()
    @IsNotEmpty({
        message: 'category_id không được để trống',
    })
    category_id: number


    @ManyToOne(() => CategoryEntity, category => category.products)
    @JoinColumn({ name: 'category_id' })
    category: CategoryEntity


    @OneToMany(() => ProductAttributeValueEntity, productAttributeValue => productAttributeValue.products)
    // @JoinColumn({ name: 'category_id' })
    productAttributeValue: ProductAttributeValueEntity[]
}
