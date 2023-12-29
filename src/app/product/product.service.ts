import { Injectable } from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { CommonService } from '../common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { CategoryEntity } from '../category/category.entity';
import { CategoryService } from '../category/category.service';
import { ProductAttributeService } from '../product_attribute/product_attribute.service';
import { ProductValueService } from '../product_value/product_value.service';
import { ProductAttributeValueService as PAVService } from '../product_attribute_value/product_attribute_value.service';
import { ProductAttributeValueEntity as PAVEntity } from '../product_attribute_value/product_attribute_value.entity';
import { Constants } from '../../constant/index';
@Injectable()
export class ProductService extends CommonService<ProductEntity> {
  public aliasName = 'products';
  constructor(
    @InjectRepository(ProductEntity)
    protected readonly repository: Repository<ProductEntity>,
    @InjectRepository(PAVEntity)
    protected readonly repoPAV: Repository<PAVEntity>,
    protected readonly categoryService: CategoryService,
    protected readonly productAttributeService: ProductAttributeService,
    protected readonly productValueService: ProductValueService,
    protected readonly PAVService: PAVService,

  ) {
    super(repository);
    // this.categories = category
  }

  async findProductById(id: number): Promise<ProductEntity> {

    const product = await this.repository.findOneBy({
      id: id
    })
    return product;
  }

  public async findAll(currentUser, params, isPaginate): Promise<any> {
    // try {
    let $pagination = {};
    let query: SelectQueryBuilder<ProductEntity> = await this.repository.createQueryBuilder(
      'products',
    );

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
    const queryBuilder = await query.innerJoinAndSelect('products.category', 'category')
      .innerJoinAndSelect(this.aliasName + '.productAttributeValue', 'productAttributeValue')
      .innerJoinAndSelect('productAttributeValue.attributes', 'attributes')
      .innerJoinAndSelect('productAttributeValue.values', 'values');
    // let results = await query.execute(); // for performance

    const { product, value } = params
    if (product) {
      queryBuilder.andWhere(`products.${product} LIKE :value`, { value: '%' + `${value}` + '%' });
    } else if (product == '') {
      return this.showError();
    }


    const results = queryBuilder.getMany()

    const data = await this._formatList(currentUser, params, results);
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


  public async findOneById(currentUser, id: number, params = {}): Promise<any> {
    try {
      let query: SelectQueryBuilder<ProductEntity> =
        await this.repository.createQueryBuilder(this.aliasName);

      const select = this._selectFields(params);
      if (select.length > 0) {
        const selectInView = this._viewSelectFields();
        query.select([...select, ...selectInView]);
      }

      const queryBuilder = this.repository.createQueryBuilder(this.aliasName)
        .innerJoinAndSelect(this.aliasName + '.productAttributeValue', 'productAttributeValue')
        .innerJoinAndSelect('productAttributeValue.attributes', 'attributes')
        .innerJoinAndSelect('productAttributeValue.values', 'values')
        .andWhere(this.aliasName + '.id = :paramId', { paramId: id });

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



  public async getListData(): Promise<any> {
    const queryBuilder = this.repository.createQueryBuilder(this.aliasName)
      .select([this.aliasName + '.id', this.aliasName + '.name']).getMany()

    return queryBuilder

  }

  public productFields() {
    return [
      this.aliasName + '.id',
      this.aliasName + '.name',
      this.aliasName + '.image',
      this.aliasName + '.description',
    ];
  }


  public async getDataToshow(params): Promise<any> {

    const queryBuilder = this.repository.createQueryBuilder(this.aliasName)
      .innerJoinAndSelect(this.aliasName + '.category', 'category')
      .innerJoinAndSelect(this.aliasName + '.productAttributeValue', 'productAttributeValue')
      .innerJoinAndSelect('productAttributeValue.attributes', 'attributes')
      .innerJoinAndSelect('productAttributeValue.values', 'values')
      .andWhere(this.aliasName + '.status = :status', { status: Constants.status.ACTIVE })
    // .andWhere(this.aliasName + `.name LIKE :value`, { value: '%sanpham1%' });


    const { product, value } = params
    if (params.product) {
      queryBuilder.andWhere(this.aliasName + `.${product} LIKE :value`, { value: '%' + `${value}` + '%' });
    } else {
      // return this.showError();
    }

    const results = queryBuilder.select(this.productFields())
      .addSelect(['category.id', 'category.name', 'category.type', 'category.description'])
      .addSelect(this.PAVService.productAttributeValueFields())
      .addSelect(this.productAttributeService.attributeFields())
      .addSelect(this.productValueService.valueFields())

    return results.getMany()


  }

  public async getDataToShowById(id, params): Promise<any> {
    const queryBuilder = this.repository.createQueryBuilder(this.aliasName)
      .innerJoinAndSelect(this.aliasName + '.productAttributeValue', 'productAttributeValue')
      .innerJoinAndSelect('productAttributeValue.attributes', 'attributes')
      .innerJoinAndSelect('productAttributeValue.values', 'values')
      .andWhere(this.aliasName + '.id = :paramId', { paramId: id })
      .andWhere(this.aliasName + '.status = :status', { status: Constants.status.ACTIVE });


    const results = queryBuilder.select(this.productFields())
      .addSelect(this.PAVService.productAttributeValueFields())
      .addSelect(this.productAttributeService.attributeFields())
      .addSelect(this.productValueService.valueFields())

    return results.getMany()
  }

  public async getDateTime() {
    return new Date();
  }


  public async handleCreate(currentUser, data: DeepPartial<ProductEntity>): Promise<any> {
    let productId;
    const dataEntity = this._beforeUpdateData(currentUser, data);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const entity: ProductEntity = this.repository.create(dataEntity);
    const validate = await this.validate(entity, {
      groups: ['create'],
    });
    if (!validate.success) {
      return validate;
    }
    const dataAlreadyExist = await this._checkDataExist(
      currentUser,
      null,
      entity,
    );
    if (!dataAlreadyExist.success) {
      return dataAlreadyExist;
    }
    entity['updated'] = new Date();
    const response = await this.repository.save(entity);
    productId = response.id;

    const {
      name,
      image,
      description,
      category_id,
      ...rest
    } = data;

    const attributeValues = rest["attributeValues"] ?? null;
    if (!attributeValues) {
      return {
        success: false,
        msg: "Không tim thấy giá trị attribute values trong data"
      }
    }

    for (const obj of attributeValues) {
      const attributeId = obj.attribute.id;
      const valueId = obj.value.id

      const resultCheckDataAttributeValueExist = await this.checkDataAttributeValueExist(attributeId, valueId);
      if (!resultCheckDataAttributeValueExist.success) {
        return resultCheckDataAttributeValueExist;
      }

      const attributeValuesEnt = {
        product_id: productId,
        attribute_id: attributeId,
        value_id: valueId
      }

      const hasAttributeValue = await this.repoPAV.findOne({
        where: {
          ...attributeValuesEnt
        },
      })
      if (!hasAttributeValue) {
        const newAttributeValuesEnt = await this.repoPAV.create(attributeValuesEnt)
        const result = await this.repoPAV.save(newAttributeValuesEnt);
        if (!result['id']) {
          return {
            success: false,
            msg: `Quá trình lưu ID product ${productId}, ID attribute ${attributeId} và ID value ${valueId} bị lỗi`
          }
        }
      }
    }

    return {
      success: true,
      msg: 'Thêm dữ liệu thành công!',
      data: {
        id: productId,
      },
    };
  }



  public async handleUpdate(
    currentUser,
    id: number,
    data: DeepPartial<ProductEntity> | ProductEntity
  ): Promise<any> {
    const productById = await this.repository.findOne({
      where: {
        id: id
      }
    })
    if (!productById) {
      return {
        success: false,
        msg: "Product ID không hợp lệ",
      }
    }

    const productEnt: ProductEntity = this.repository.create(data);
    await this.repository.merge(productById, productEnt);

    productById['updated'] = this.getCurrentDate();
    const validate = await this.validate(productById, {
      groups: ['update'],
    });
    if (!validate.success) {
      return validate;
    }
    const dataAlreadyExist = await this._checkDataExist(
      currentUser,
      id,
      productById,
    );
    if (!dataAlreadyExist.success) {
      return dataAlreadyExist;
    }
    await this.repository.save(productById);

    const { name, description, image, category_id, ...rest } = data;
    const updateAttributeValues = rest["attributeValues"] ?? null;
    if (updateAttributeValues) {
      await this.repoPAV
        .createQueryBuilder(this.aliasName)
        .update(PAVEntity)
        .set({ status: Constants.status.INACTIVE })
        .where(`product_id = :productId`, { productId: id })
        .execute();

      for (const obj of updateAttributeValues) {
        const attributeId = obj.attribute.id;
        const valueId = obj.value.id

        const resultCheckDataAttributeValueExist = await this.checkDataAttributeValueExist(attributeId, valueId);
        if (!resultCheckDataAttributeValueExist.success) {
          return resultCheckDataAttributeValueExist;
        }

        const attributeValuesEnt = {
          product_id: id,
          attribute_id: attributeId,
          value_id: valueId
        }

        const hasAttributeValue = await this.repoPAV.findOne({
          where: {
            ...attributeValuesEnt,
          },
        })
        if (!hasAttributeValue) {
          const newAttributeValuesEnt = await this.repoPAV.create(attributeValuesEnt)
          const result = await this.repoPAV.save(newAttributeValuesEnt);
          if (!result['id']) {
            return {
              success: false,
              msg: `Quá trình lưu ID product ${id}, ID attribute ${attributeId} và ID value ${valueId} bị lỗi`
            }
          }
        } else if (hasAttributeValue['status'] === Constants.status.INACTIVE) {
          const setUpdate = {
            status: Constants.status.ACTIVE,
            updated: this.getCurrentDate()
          }
          await this.repoPAV
            .createQueryBuilder(this.aliasName)
            .update(PAVEntity)
            .set(setUpdate)
            .where(`id = :id`, { id: hasAttributeValue['id'] })
            .execute();
        }
      }
    }

    return {
      success: true,
      msg: "Cập nhật dữ liệu thành công"
    }
  }

  public getCurrentDate() {
    return new Date();
  }

  private async checkDataAttributeValueExist(attributeId, valueId) {
    const hasAttribute = await this.productAttributeService.findAttributeById(attributeId);
    if (!hasAttribute) {
      return {
        success: false,
        msg: "Attribute ID " + attributeId + " không tồn tại"
      }
    }

    const hasValue = await this.productValueService.findValueById(valueId)
    if (!hasValue) {
      return {
        success: false,
        msg: "Value ID " + valueId + " không tồn tại"
      }
    }

    return {
      success: true
    }
  }

  protected async _checkDataExist($currentUser, $id, $data) {
    if ($data['name']) {
      let query = `${this.aliasName}.name = :name`
      let where = {
        name: $data['name']
      }
      if ($id) {
        where['id'] = $id;
        query += ` AND ${this.aliasName}.id <> :id`
      }
      const product = await this.repository
        .createQueryBuilder(this.aliasName)
        .where(query, where)
        .getMany();

      if (product.length > 0) {
        return {
          success: false,
          msg: "Name đã tồn tại"
        }
      }
    }

    if ($data["category_id"]) {
      const category: CategoryEntity = await this.categoryService.findCategoryById($data["category_id"]);
      if (!category) {
        return {
          success: false,
          msg: "Category ID không tồn tại"
        }
      }
    };

    return {
      success: true,
    };
  }


}

