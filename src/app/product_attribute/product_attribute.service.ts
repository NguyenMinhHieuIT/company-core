import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductAttributeEntity } from './product_attribute.entity';
import { CommonService } from '../common';
import { Brackets, DeepPartial, FindOneOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { Constants } from '../../constant/index';

@Injectable()
export class ProductAttributeService extends CommonService<ProductAttributeEntity> {
  protected aliasName = 'attributes';
  constructor(
    @InjectRepository(ProductAttributeEntity)
    protected readonly repository: Repository<ProductAttributeEntity>,
  ) {
    super(repository);
  }

  async findAttributeById(id: number): Promise<ProductAttributeEntity> {
    const attribute = await this.repository.findOne({
      where: {
        id: id
      },

    })
    return attribute
  }

  async getListData(): Promise<any> {
    const queryBuilder = this.repository.createQueryBuilder(this.aliasName)
    const data = await queryBuilder.select([this.aliasName + '.id', this.aliasName + '.name']).andWhere(this.aliasName + '.status = :status', { status: Constants.status.ACTIVE }).getMany()

    return data
  }

  public attributeFields(params = {}) {
    return [
      this.aliasName + '.id',
      this.aliasName + '.name',
    ];
  }


  async getDataToShow(): Promise<any> {
    const queryBuilder = this.repository.createQueryBuilder(this.aliasName)
    const data = await queryBuilder.select([this.aliasName + '.id', this.aliasName + '.name']).andWhere(this.aliasName + '.status = :status', { status: Constants.status.ACTIVE }).getMany()

    return data
  }

  public async update(
    currentUser,
    id: number,
    data: DeepPartial<ProductAttributeEntity> | ProductAttributeEntity,
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
      entity['updated'] = new Date();
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

}
