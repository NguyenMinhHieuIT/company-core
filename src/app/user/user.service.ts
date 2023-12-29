import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Brackets, DeepPartial, FindOneOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { Constants } from '../../constant';
import { CommonService } from '../common';
import { UserEntity as User } from './user.entity';

@Injectable()
export class UserService extends CommonService<User> {
  protected aliasName = 'user';

  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
  ) {
    super(repository);
  }

  /**
   * @param params
   * @protected
   */
  public _selectFields(params = {}) {
    return [
      'user.id',
      'user.email',
      'user.fullName',
      'user.address',
      'user.phone',
      'user.gender',
      'user.age',
      'user.image',
      'user.status',
      'user.created',
      'user.updated',
      'user.lastAccess'
    ];
  }

  public async getListUser() {
    try {
      const listUsers = await this.repository.find({
        select: {
          id: true,
          fullName: true,
        }
      });
      return {
        success: true,
        data: listUsers
      }
    } catch (error) {
      this.showError();
    }
  }

  /**
 * Add record
 * @param currentUser
 * @param data
 */
  public async create(currentUser, data: DeepPartial<User>): Promise<any> {
    try {
      const dataEntity = this._beforeUpdateData(currentUser, data);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const entity: User = this.repository.create(dataEntity);
      const validate = await super.validate(entity, {
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

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const response = await this.repository.save(entity);
      await this._afterSaveData(-1, response, dataEntity);

      return {
        success: true,
        msg: 'Thêm dữ liệu thành công!',
        data: {
          id: 1,
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
    data: DeepPartial<User> | User,
  ): Promise<any> {
    try {
      const dataEntity = this._beforeUpdateData(currentUser, data);
      const entity = await this.repository.findOneBy({ id });
      if (!entity) {
        return {
          success: false,
          error: "ID nhập vào không hợp lệ"
        }
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.repository.merge(entity, dataEntity);
      entity['updated'] = new Date();
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

  /**
   * Search conditions
   * @param params
   * @param query
   * @private
   */
  protected async _searchFiltersCondition(
    params,
    query: SelectQueryBuilder<User>,
  ) {
    if (params['keyword']) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('user.email = :keyword', {
            keyword: params['keyword'],
          }).orWhere('user.fullName LIKE :keyword', {
            keyword: '%' + params['keyword'] + '%',
          });
        }),
      );
    }

    if (params['status']) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('user.status = :status', { status: params['status'] });
        }),
      );
    }

    return query;
  }

  async findByField(field: string): Promise<User> {
    const where = { [field]: field }
    return await this.repository.findOne({
      where,
      relations: []
    })
  }

  async findByEmail(email: string): Promise<User> {
    return await this.repository.findOne({
      where: {
        email: email,
      },
      relations: [],
    });
  }

  async findByPhone(phone: string): Promise<User> {
    return await this.repository.findOne({
      where: {
        phone: phone,
      },
      relations: [],
    });
  }

  static md5(password): string {
    return crypto.createHash('md5').update(password).digest('hex');
  }

  async getUserByField(userId, field): Promise<any> {
    const userInfo = await this.repository.findOne({
      select: [field],
      where: {
        id: userId,
      },
    });
    return userInfo[field] ? userInfo[field] : '';
  }

  protected async _checkDataExist($currentUser, $id, $data) {
    if ($data['email']) {
      const result = await this._checkFieldExist($data['email'], 'email', $id);
      if (result) {
        return {
          success: false,
          error: 'Tài khoản bạn thêm đã tồn tại, vui lòng kiểm tra lại!',
        };
      }
    }
    if ($data['phone']) {
      const result = await this._checkFieldExist($data['phone'], 'phone', $id);
      if (result) {
        return {
          success: false,
          error: 'Số điện thoại bạn thêm đã tồn tại, vui lòng kiểm tra lại!',
        };
      }
    }
    return {
      success: true,
    };
  }

  async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  protected _orderList(query, params) {
    return query.orderBy({
      'user.created': 'DESC',
    });
  }

  /**
   * @param user
   * @param data
   */
  public async updateUser(user, data): Promise<any> {
    try {
      const entity = await this.repository.findOneOrFail({
        where: { id: user.id },
      });

      if (data.newPass) {
        let msgError =
          data.newPass !== data.confPass
            ? 'Xác nhận mật khẩu không hợp lệ, vui lòng kiểm tra lại!'
            : '';
        if (UserService.md5(data.currPass) !== entity.password) {
          msgError = 'Mật khẩu củ bạn nhập không đúng, vui lòng kiểm tra lại!';
        }
        if (msgError) {
          return {
            success: false,
            error: msgError,
          };
        }
        entity.password = UserService.md5(data.newPass);
      }
      entity.age = data.age;
      entity.fullName = data.fullName;
      entity.gender = data.gender;
      entity.address = data.address;
      entity.phone = data.phone;
      entity.image = data.image;
      await this.repository.save(entity);

      return {
        success: true,
        msg: 'Cập nhật thông tin thành công!',
      };
    } catch (e) {
      return {
        success: false,
        error: e.message,
      };
    }
  }

  /**
   * @param currentUser
   * @param data
   * @protected
   */
  protected _beforeUpdateData(
    currentUser,
    data: DeepPartial<User> | User,
  ) {
    if (!data['id']) {
      // data.createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    }
    if (data['password']) {
      data.password = UserService.md5(data['password']);
    }
    data.status = data['status'] || Constants.status.ACTIVE;
    // data.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
    return data;
  }

  protected async _formatList(currentUser, params, $data): Promise<any> {
    return super._formatList(currentUser, params, $data);
  }
}
