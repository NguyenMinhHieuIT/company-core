import { Injectable } from '@nestjs/common';
import { CommonService } from '../common';
import { SliderEntity as Slider } from './slider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { RuleTester } from 'eslint';
import { Constants } from '../../constant';

import * as fs from 'fs-extra';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SliderService extends CommonService<Slider> {
  protected aliasName: string = 'slider';
  constructor(
    @InjectRepository(Slider)
    protected readonly repo: Repository<Slider>
  ) {
    super(repo);
  }

  public async getAllSliders(): Promise<any> {
    try {
      const select = {
        id: true,
        title: true,
        description: true,
        url: true,
        image: true
      };
      const where = {
        status: Constants.status.ACTIVE
      };
      const data: Slider[] = await this.repo.find({
        select,
        where,
      });
      return {
        success: true,
        data: data
      }
    } catch (error) {
      return this.showError()
    }
  }

  /**
* Add record
* @param currentUser
* @param data
*/
  public async handleCreate(currentUser, data: DeepPartial<Slider>, image): Promise<any> {
    try {
      const { success, path } = await this.handleUploadImg(currentUser, image);
      if (!success) {
        return {
          success,
          error: "Quá trình tạo đường dẫn không thành công"
        }
      }
      data['image'] = path;

      const dataEntity = this._beforeUpdateData(currentUser, data);
      const entity: Slider = this.repository.create(dataEntity);
      const validate = await this.validate(entity, {
        groups: ['create'],
      });
      if (!validate.success) {
        return validate;
      }

      const error = (await this._checkDataExist(currentUser, null, entity))
      if (!error.success) {
        return error;
      }

      entity['created'] = new Date();
      console.log(entity)
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
* Add record
* @param currentUser
* @param data
*/
  public async handleUploadImg(
    currentUser,
    image
  ) {
    if (!image) {
      return {
        success: false,
        path: null
      }
    }
    const imageId = uuidv4();
    const imageName = `${imageId}${path.extname(image.originalname)}`;
    const imagePath = path.join('uploads/images', imageName);
    await fs.writeFile(imagePath, image.buffer);

    return {
      success: true,
      path: imagePath
    }
  }

  /**
* Add record
* @param currentUser
* @param data
*/
  public async handleUpdate(
    currentUser,
    id: number,
    data: DeepPartial<Slider> | Slider,
    image
  ): Promise<any> {
    try {
      if (image) {
        const { success, path } = await this.handleUploadImg(currentUser, image);
        if (!success) {
          return {
            success: false,
            path: "Quá trình cập nhập ảnh không thành công"
          }
        }
        const slider = await this.repo.findOne({
          where: {
            image: path
          }
        })
        if (slider) {
          data['image'] = path;
        }
      }

      const dataEntity = this._beforeUpdateData(currentUser, data);
      const entity = await this.repository.findOneBy({ id });
      if (!entity) {
        return {
          seccess: false,
          error: "Id nhập vào không đúng"
        }
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const validate = await this.validate(entity, {
        groups: ['update'],
      });
      if (!validate.success) {
        return validate;
      }
      this.repository.merge(entity, dataEntity);
      const dataAlreadyExist = await this._checkDataExist(currentUser, id, entity);
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

  protected async _checkDataExist($currentUser, $id, $data) {
    if ($data) {
      const { status, created, updated, id, ...where } = $data;
      const result: Slider[] = await this.repo.find({
        where
      })
      if (result.length > 0) {
        return {
          success: false,
          error: "Dữ liệu nhập vào đã tồn tại",
        }
      }
    }
    return {
      success: true,
    };
  }
}
