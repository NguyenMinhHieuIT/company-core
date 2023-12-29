import { Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { CommonService } from '../common';
import { SettingEntity } from './entities/setting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class SettingService extends CommonService<SettingEntity> {
    constructor(@InjectRepository(SettingEntity) private readonly settingRepository:Repository<SettingEntity>){
      super(settingRepository)
  }

  aliasName = "settings";

  protected async _checkDataExist($currentUser, $id, $data) {
    if ($data['name']) {
      const result = await this._checkFieldExist($data['name'], 'name', $id);
      if (result) {
        return {
          success: false,
          error: 'Tên đã tồn tại, vui lòng kiểm tra lại!',
        };
      }
    }
   
    return {
      success: true,
    };
  }

  public async create(currentUser, data: DeepPartial<SettingEntity>): Promise<any> {
    const checkData = await this._checkDataExist(currentUser , data , false);
      if(!checkData.success){
          return {
          success: false,
          message: checkData.error
        }
      }
      const dataEntity = this._beforeUpdateData(currentUser, data);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const entity: T = this.repository.create(dataEntity);
      const validate = await this.validate(entity, {
        groups: ['create'],
      });
      if (!validate.success) {
        return validate;
      }
      const dataAlreadyExist = await this._checkDataExist(
        currentUser,
        null,
        data,
      );
      if (!dataAlreadyExist.success) {
        return dataAlreadyExist;
      }
      
      entity['created_at'] = this.getDateTime();
      entity['createdAt'] = this.getDateTime();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const response = await this.repository.save(entity);
      await this._afterSaveData(-1, response, dataEntity);

      return {
        success: true,
        msg: 'Thêm dữ liệu thành công!',
        data: {
          id: response['id'],
        },
      };
    } catch (e) {
      return this.showError();
    }

     /**
   * Get all data with pagination
   * @param currentUser
   * @param params
   * @param isPaginate
   */
   public async findAllForUser(currentUser, params, isPaginate): Promise<any> {
    // try {
    let $pagination = {};
    let query: SelectQueryBuilder<SettingEntity> = await this.repository.createQueryBuilder(
      this.aliasName,
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
    const results = 
    await query.select([this.aliasName +'.id', 
                        this.aliasName +'.name',
                        this.aliasName +'.value',
                        this.aliasName +'.description',
                      ])
              .where('settings.status = :status' , {status:1})
              .getMany();
    // let results = await query.execute(); // for performance

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

  public async getList(){
      const data = await this.settingRepository.find({select:['id' , 'name']})
      return {
        success:true,
        data: data
      };
  }
}

