import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ProductEntity } from '../product/product.entity';
import { ProductAttributeEntity } from '../product_attribute/product_attribute.entity';
import { ProductValueEntity } from '../product_value/product_value.entity';


// @Index('name', ['name'], { unique: true })
@Entity('product_attributes_values')
export class ProductAttributeValueEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column()
    @IsNotEmpty({
        message: 'product_id không được để trống',
    })
    product_id: number

    @Column()
    @IsNotEmpty({
        message: 'attribute_id không được để trống',
    })
    attribute_id: number

    @Column()
    @IsNotEmpty({
        message: 'value_id không được để trống',
    })
    value_id: number

    @ManyToOne(() => ProductEntity, product => product.productAttributeValue)
    @JoinColumn({ name: 'product_id' })
    products: ProductEntity

    @ManyToOne(() => ProductAttributeEntity, productAttribute => productAttribute.productAttributeValue)
    @JoinColumn({ name: 'attribute_id' })
    attributes: ProductAttributeEntity

    @ManyToOne(() => ProductValueEntity, productValue => productValue.productAttributeValue)
    @JoinColumn({ name: 'value_id' })
    values: ProductValueEntity

}
