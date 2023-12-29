import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { ProductAttributeValueEntity } from '../product_attribute_value/product_attribute_value.entity';

@Index('name', ['name'], { unique: true })
@Entity('product_attributes')
export class ProductAttributeEntity extends BaseEntity {
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @Column({ name: 'name', length: 255, type: 'varchar' })
    @ApiProperty()
    @IsNotEmpty({
        message: 'value không được để trống',
    })
    name: string;

    @OneToMany(() => ProductAttributeValueEntity, productAttributeValue => productAttributeValue.attributes)
    // @JoinColumn({ name: 'category_id' })
    productAttributeValue: ProductAttributeValueEntity[]
}
