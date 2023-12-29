import { DeepPartial, Not, Repository, SelectQueryBuilder } from 'typeorm';
import { validate, ValidatorOptions } from 'class-validator';
// import * as moment from 'moment';
import { Constants } from '../../constant';
import { BaseEntity } from './base.entity';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

export class CommonService<T extends BaseEntity> {
  // limit per page
  protected limit = 20;

  // Set default page
  protected page = 1;

  // Has status field in table
  protected hasStatusField = true;

  // Soft delete record or update status
  protected softDelete = true;

  protected cache = false;

  protected aliasName = '';

  protected repository: Repository<T>;

  constructor(repository?: Repository<T>) {
    if (repository) {
      this.repository = repository;
    }
  }



  /**
   * Get all data with pagination
   * @param currentUser
   * @param params
   * @param isPaginate
   */
  public async findAll(currentUser, params, isPaginate): Promise<any> {
    // try {
    let $pagination = {};
    let query: SelectQueryBuilder<T> = await this.repository.createQueryBuilder(
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
    const results = await query.getMany();
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

  /**
   * Process paginate
   * @param params
   * @param $total
   */
  public async paginate(params, $total): Promise<any> {
    let $from = 0,
      $lastPage = 0,
      $to = this.limit - 1;
    if (params.limit && params.limit > 0) {
      this.limit = parseInt(params.limit);
    } else {
      this.limit = 20;
    }
    if (this.limit) {
      $lastPage = Math.ceil($total / this.limit);
    }
    if (params.page && params.page > 0) {
      this.page = parseInt(params.page);
      if (this.page > $lastPage) {
        this.page = $lastPage;
      }
    } else {
      this.page = 1;
    }

    if (this.page >= 1) {
      $from = this.limit * (this.page - 1);
      $to = this.limit + $from - 1;
    }
    if ($to >= $total) {
      $to = $total - 1;
    }

    return {
      total: $total,
      per_page: this.limit,
      current_page: this.page,
      last_page: $lastPage,
      from: $from,
      to: $to > 0 ? $to : 0,
    };
  }

  /**
   * view detail by id
   * @param currentUser
   * @param params
   * @param id
   */
  public async findOneById(currentUser, id: number, params = {}): Promise<any> {
    try {
      let query: SelectQueryBuilder<T> =
        await this.repository.createQueryBuilder(this.aliasName);

      const select = this._selectFields(params);
      if (select.length > 0) {
        const selectInView = this._viewSelectFields();
        query.select([...select, ...selectInView]);
      }
      query.andWhere(this.aliasName + '.id = :paramId', { paramId: id });
      query = await this._joinRelation(query, params);
      query = await this._viewJoinRelation(query);
      query = await this._filterByUser(currentUser, query);

      let results = await query.getOne();
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
    } catch (e) {
      return this.showError();
    }
  }

  /**
   * Add record
   * @param currentUser
   * @param data
   */
  public async create(currentUser, data: DeepPartial<T>): Promise<any> {
    try {
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
    data: DeepPartial<T> | T,
  ): Promise<any> {
    // try {
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
    // } catch (e) {
    //   return this.showError();
    // }
  }

  /**
   * Delete record
   * @param currentUser
   * @param id
   */
  public async delete(currentUser, id: number): Promise<any> {
    try {
      const options: FindOneOptions = {
        where: {
          id,
          status: Not(Constants.status.DELETED),
        },
      };
      const entity: T = await this.repository.findOneOrFail(options);

      const beforeDelete = await this._checkDataBeforeDelete(
        currentUser,
        entity,
      );
      if (!beforeDelete.success) {
        return beforeDelete;
      }

      if (!this.softDelete || !this.hasStatusField) {
        await this.repository.delete(id);
        await this._afterDeleteData(id, entity);
      } else {
        entity['status'] = Constants.status.DELETED;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await this.repository.save(entity);
      }

      return {
        success: true,
        msg: 'Xoá dữ liệu thành công!',
      };
    } catch (e) {
      return this.showError();
    }
  }

  /**
   * Check value exist in db
   * @param $value
   * @param $field
   * @param $id
   * @private
   */
  public async _checkFieldExist($value, $field, $id) {
    const $where = {};
    $where[$field] = $value;
    if ($id) {
      $where['id'] = Not($id);
    }
    const $count = await this.repository.count({
      where: $where,
    });

    return $count > 0;
  }

  protected async validate(entity: T, options?: ValidatorOptions) {
    const validateErr = {
      validationError: {
        target: true,
        value: false,
      },
    };
    const errors = await validate(entity, {
      ...validateErr,
      options,
    } as ValidatorOptions);
    if (errors.length > 0) {
      return {
        success: false,
        error: Object.values(errors[0].constraints)[0],
      };
    }

    return {
      success: true,
      error: '',
    };
  }

  /**
   * @param params
   * @param queryBuilder
   * @private
   */
  protected async _searchFiltersCondition(
    params,
    queryBuilder: SelectQueryBuilder<T>,
  ) {
    return queryBuilder;
  }

  /**
   * @param params
   * @private
   */
  protected async _formatListParam(params) {
    return params;
  }

  /**
   * @param params
   * @protected
   */
  protected _selectFields(params = {}) {
    return [];
  }

  protected _viewSelectFields() {
    return [];
  }

  protected async _checkViewRecord(results, currentUser, params) {
    return false;
  }

  protected _joinRelation(queryBuilder: SelectQueryBuilder<T>, params = {}) {
    return queryBuilder;
  }

  protected _filterByUser(
    currentUser,
    queryBuilder: SelectQueryBuilder<T>,
    params = {},
  ) {
    return queryBuilder;
  }

  protected _viewJoinRelation(queryBuilder: SelectQueryBuilder<T>) {
    return queryBuilder;
  }

  protected _orderList(query, params): any {
    return query;
  }

  protected _beforeUpdateData(currentUser, data: DeepPartial<T> | T) {
    return data;
  }

  public static _isObjEmpty(obj) {
    return Object.getOwnPropertyNames(obj).length === 0;
  }

  /**
   * @param $fields
   * @param $where
   */
  public async listItem($fields, $where) {
    const results = await this.repository.find({
      select: $fields,
      where: $where,
    });

    return {
      success: true,
      data: results,
    };
  }

  /**
   * @param $field
   * @param $keyField
   * @param $where
   */
  public async getListItem($field: string[], $keyField, $where) {
    const $select = [$keyField, ...$field];
    const results = await this.repository.find({
      select: $select,
      where: $where,
    });
    const response = {};
    if (results) {
      results.map(function (obj) {
        response[obj[$keyField]] = obj;
      });
    }
    return response;
  }

  public getDateTime() {
    return null;
    // return moment().format('YYYY-MM-DD HH:mm:ss');
  }

  public getCurrentDate() {
    return null;
    // return moment().toDate();
  }

  public formatDate(datetime) {
    return null;
    // return moment(datetime).format('YYYY-MM-DD');
  }

  public generateUUID() {
    let dt = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      },
    );
  }

  public validateUUID(str: string, name: string): boolean {
    const uuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const uuidV4 =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return !(!uuidV4.test(str) && !uuid.test(str));
  }

  protected getAlias(): string {
    return this.repository.metadata.targetName;
  }

  protected async _checkDataExist($currentUser, $id, $data) {
    return {
      success: true,
    };
  }

  protected async _formatViewResponse($is, $data, params) {
    return $data;
  }

  protected async _formatList(currentUser, params, $data) {
    return $data;
  }

  protected async _afterSaveData($id: number, $entity, $data) {
    return {};
  }

  protected async _afterDeleteData($id: number, $entity) {
    return {};
  }

  protected async _checkDataBeforeDelete(currentUser, entity) {
    return {
      success: true,
    };
  }

  /**
   * Disabled or enabled foreign key
   * @param flag
   */
  public async setForeignKey(flag: boolean): Promise<any> {
    if (!flag) {
      await this.repository.query('SET FOREIGN_KEY_CHECKS=0');
    } else {
      await this.repository.query('SET FOREIGN_KEY_CHECKS=1');
    }
  }

  public showError(): any {
    return {
      success: false,
      error: 'Dữ liệu không hợp lệ, bạn vui lòng kiểm tra lại!',
    };
  }
}
