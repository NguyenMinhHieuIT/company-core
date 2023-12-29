import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Brackets, DeepPartial, FindOneOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { Constants } from '../../constant/index';
import { ProductValueEntity } from './product_value.entity';
import { CommonService } from '../common';

@Injectable()
export class ProductValueService extends CommonService<ProductValueEntity> {
    protected aliasName = 'values';
    constructor(
        @InjectRepository(ProductValueEntity)
        protected readonly repository: Repository<ProductValueEntity>,
    ) {
        super(repository);
    }

    async findValueById(id: number): Promise<ProductValueEntity> {
        const value = await this.repository.findOne({
            where: {
                id: id
            },

        })
        return value;
    }


    async getListData(): Promise<any> {
        const queryBuilder = this.repository.createQueryBuilder(this.aliasName)
        const data = await queryBuilder.select([this.aliasName + '.id', this.aliasName + '.name']).andWhere(this.aliasName + '.status = :status', { status: Constants.status.ACTIVE }).getMany()

        return data
    }

    public valueFields(params = {}) {
        return [
            this.aliasName + '.id',
            this.aliasName + '.name',
        ];
    }

    async getDataToShow(): Promise<any> {
        const queryBuilder = this.repository.createQueryBuilder(this.aliasName)
        const data = await queryBuilder.select(this.valueFields()).andWhere(this.aliasName + '.status = :status', { status: Constants.status.ACTIVE }).getMany()

        return data
    }


    public async getDateTime() {
        return Date.now()
    }

    /**
  * Update record
  * @param currentUser
  * @param id
  * @param data
  */
    public async update(
        currentUser,
        id: number,
        data: DeepPartial<ProductValueEntity> | ProductValueEntity,
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

            entity['updated'] = new Date()
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
