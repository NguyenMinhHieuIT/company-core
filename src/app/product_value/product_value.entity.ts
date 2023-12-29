import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ProductAttributeValueEntity } from '../product_attribute_value/product_attribute_value.entity';

@Index('name', ['name'], { unique: true })
@Entity('product_values')
export class ProductValueEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column('varchar', { name: 'name', length: 255 })
    @ApiProperty()
    @IsNotEmpty({
        message: 'value không được để trống',
    })
    name: string;

    @OneToMany(() => ProductAttributeValueEntity, productAttributeValue => productAttributeValue.values)
    // @JoinColumn({ name: 'category_id' })
    productAttributeValue: ProductAttributeValueEntity[]
}
