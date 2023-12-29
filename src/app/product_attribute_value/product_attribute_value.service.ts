import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ProductAttributeValueEntity } from './product_attribute_value.entity';
import { CommonService } from '../common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DeepPartial, FindOneOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { ProductAttributeService } from '../product_attribute/product_attribute.service';
import { ProductValueService } from '../product_value/product_value.service';
import { ProductValueEntity } from '../product_value/product_value.entity';
import { ProductEntity } from '../product/product.entity';


@Injectable()
export class ProductAttributeValueService extends CommonService<ProductAttributeValueEntity> {
    public aliasName = 'productAttributeValue';
    constructor(
        @InjectRepository(ProductAttributeValueEntity)
        protected readonly repository: Repository<ProductAttributeValueEntity>,
        // @InjectRepository(ProductEntity)
        // protected readonly productRepository: Repository<ProductEntity>,
        // protected readonly productService: ProductService,
        @Inject(forwardRef(() => ProductService))
        private productService: ProductService,
        protected readonly attributeService: ProductAttributeService,
        protected readonly valueService: ProductValueService,
    ) {
        super(repository);
    }



    public async findAll(currentUser, params, isPaginate): Promise<any> {
        // try {

        // return params

        let $pagination = {};
        let query: SelectQueryBuilder<ProductAttributeValueEntity> = await this.repository.createQueryBuilder(
            this.aliasName,
        );

        // return query.innerJoinAndSelect('products.product_category', 'category')
        //     .getMany();

        const $select = this._selectFields(params);
        if ($select.length > 0) {
            query.select($select);
        }

        query = this._orderList(query, params);
        if (this.cache) {
            query.cache(true);
        }

        params = await this._formatListParam(params);
        query = await this._joinRelation(query, params);
        query = await this._searchFiltersCondition(params, query);
        query = await this._filterByUser(currentUser, query, params);
        // console.log(query);


        if (isPaginate) {
            if (!params['excludeCountItem']) {
                const $total = await query.getCount();
                $pagination = await this.paginate(params, $total);
            } else {
                this.limit =
                    params.limit && params.limit > 0 ? parseInt(params.limit) : 20;
                this.page = params.page && params.page > 0 ? parseInt(params.page) : 1;
            }
            let offset = this.limit * (this.page - 1);
            offset = offset > 0 ? offset : 0;
            query.skip(offset).take(this.limit);
        }

        const queryBuilder = this.repository.createQueryBuilder(this.aliasName).innerJoinAndSelect(this.aliasName + '.products', 'products')
            .innerJoinAndSelect(this.aliasName + '.attributes', 'attributes')
            .innerJoinAndSelect(this.aliasName + '.values', 'values');

        const { name, value } = params
        if (name) {
            queryBuilder.andWhere(`products.${name} LIKE :value`, { value: '%' + `${value}` + '%' });
        }

        // if (params.product) {
        //     queryBuilder.andWhere('products.name LIKE :product', { product: params.product + '%' });
        // }
        // if (params.attribute) {
        //     queryBuilder.andWhere('attributes.name LIKE :attribute', { attribute: params.attribute + '%' })
        // }
        // if (params.value) {
        //     queryBuilder.andWhere('values.name LIKE :value', { value: params.value + '%' })
        // }

        const result = queryBuilder.getMany()

        const data = await this._formatList(currentUser, params, result);
        if (params['onlyData']) {
            return data;
        }
        return {
            success: true,
            data: data,
            pagination: $pagination,
        };


        // } catch (e) {
        //   return this.showError();
        // }
    }


    public productAttributeValueFields() {
        return [
            this.aliasName + '.id',
        ];
    }

    public async getDataToshow(): Promise<any> {

        const queryBuilder = this.repository.createQueryBuilder(this.aliasName).innerJoinAndSelect(this.aliasName + '.products', 'products')
            .innerJoinAndSelect(this.aliasName + '.attributes', 'attributes')
            .innerJoinAndSelect(this.aliasName + '.values', 'values')
        const data = queryBuilder.select(this.productAttributeValueFields())
            .addSelect(this.productService.productFields())
            .addSelect(this.attributeService.attributeFields())
            .addSelect(this.valueService.valueFields())
            .getMany()

        return data
        // return queryBuilder.getMany()


    }


    /**
  * view detail by id
  * @param currentUser
  * @param params
  * @param id
  */
    public async findOneById(currentUser, id: number, params = {}): Promise<any> {
        try {
            let query: SelectQueryBuilder<ProductAttributeValueEntity> =
                await this.repository.createQueryBuilder(this.aliasName);

            const select = this._selectFields(params);
            if (select.length > 0) {
                const selectInView = this._viewSelectFields();
                query.select([...select, ...selectInView]);
            }
            // query.andWhere(this.aliasName + '.id = :paramId', { paramId: id });
            // query = await this._joinRelation(query, params);
            // query = await this._viewJoinRelation(query);
            // query = await this._filterByUser(currentUser, query);

            const queryBuilder = this.repository.createQueryBuilder(this.aliasName).innerJoinAndSelect(this.aliasName + '.product', 'product')
                .innerJoinAndSelect(this.aliasName + '.attribute', 'attribute')
                .innerJoinAndSelect(this.aliasName + '.value', 'value').andWhere(this.aliasName + '.id = :paramId', { paramId: id });

            let results = await queryBuilder.getOne();
            if (results) {
                const checkViewRecord = await this._checkViewRecord(
                    results,
                    currentUser,
                    params,
                );
                if (checkViewRecord) {
                    return this.showError();
                }
                if (results) {
                    results = await this._formatViewResponse(id, results, params);
                    if (params['onlyData']) {
                        return results;
                    }
                    return {
                        success: true,
                        data: results,
                    };
                }
                return this.showError();
            } else {
                return this.showError();
            }

        } catch (e) {
            return this.showError();
        }
    }


    public async create(currentUser, data: DeepPartial<ProductAttributeValueEntity>): Promise<any> {
        // try {
        //     const dataEntity = this._beforeUpdateData(currentUser, data);
        //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //     // @ts-ignore
        //     const entity: ProductAttributeValueEntity = this.repository.create(dataEntity);
        //     const validate = await this.validate(entity, {
        //         groups: ['create'],
        //     });
        //     if (!validate.success) {
        //         return validate;
        //     }
        //     const dataAlreadyExist = await this._checkDataExist(
        //         currentUser,
        //         null,
        //         data,
        //     );
        //     if (!dataAlreadyExist.success) {
        //         return dataAlreadyExist;
        //     }
        //     entity['created_at'] = this.getDateTime();

        //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //     // @ts-ignore

        //     const findProduct = await this.productService.findProductById(dataEntity.product_id)
        //     const findAttribute = await this.attributeService.findAttributeById(dataEntity.attribute_id)
        //     const findValue = await this.valueService.findValueById(dataEntity.value_id)


        //     if (!findProduct) {
        //         return {
        //             success: false,
        //             msg: 'Product id không tôn tại',
        //         };
        //     }
        //     if (!findAttribute) {
        //         return {
        //             success: false,
        //             msg: 'Attribute id không tôn tại',
        //         };
        //     }
        //     if (!findValue) {
        //         return {
        //             success: false,
        //             msg: 'Value id không tôn tại',
        //         };
        //     }

        //     if (await this.checkProductAttributeValue(findProduct.id, findAttribute.id, findValue.id)) {
        //         const response = await this.repository.save(entity);
        //         await this._afterSaveData(-1, response, dataEntity);

        //         return {
        //             success: true,
        //             msg: 'Thêm dữ liệu thành công!',
        //             data: {
        //                 id: response['id'],
        //             },
        //         };
        //     } else {
        //         return {
        //             success: false,
        //             msg: 'Dữ liệu đã tồn tại',
        //         };
        //     }


        //     // else {
        //     //     throw new BadRequestException('dữ liệu không hợp lệ')
        //     // }

        // } catch (e) {
        //     return this.showError();
        // }
    }


    public async update(
        currentUser,
        id: number,
        data: DeepPartial<ProductAttributeValueEntity> | ProductAttributeValueEntity,
    ): Promise<any> {
        try {
            const dataEntity = this._beforeUpdateData(currentUser, data);
            const options: FindOneOptions = {
                where: { id },
            };
            const entity = await this.repository.findOneOrFail(options);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.repository.merge(entity, dataEntity);
            const validate = await this.validate(entity, {
                groups: ['update'],
            });
            if (!validate.success) {
                return validate;
            }
            const dataAlreadyExist = await this._checkDataExist(currentUser, id, data);
            if (!dataAlreadyExist.success) {
                return dataAlreadyExist;
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            entity['updated_at'] = this.getDateTime();
            await this.repository.save(entity);
            await this._afterSaveData(id, entity, dataEntity);

            return {
                success: true,
                msg: 'Cập nhật dữ liệu thành công!',
            };
        } catch (e) {
            return this.showError();
        }
    }

    // protected productIdColumn = 'product_id'
    // protected attributeIdColumn = 'attribute_id'
    // protected valueIdColumn = 'value_id'

    public async checkProductAttributeValue(product, attribute, value) {
        const queryBuilder = this.repository.createQueryBuilder(this.aliasName);
        const query = await queryBuilder.andWhere('product_id = :productId', { productId: product })
            .andWhere('attribute_id = :attributeId', { attributeId: attribute }).
            andWhere('value_id = :valueId', { valueId: value }).getMany()

        if (query.length > 0) {
            return false;
        }
        return true
    }

    public async checkProductAttributeValueTable(id, attribute, value) {
        const queryBuilder = this.repository.createQueryBuilder(this.aliasName);
        const query = await queryBuilder.andWhere('id = :id', { id: id })
            .andWhere('attribute_id = :attributeId', { attributeId: attribute }).
            andWhere('value_id = :valueId', { valueId: value }).getMany()

        if (query.length > 0) {
            return false;
        }
        return true
    }



}
