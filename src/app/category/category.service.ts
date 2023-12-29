import { Injectable } from '@nestjs/common';
import { CommonService } from '../common';
import { CategoryEntity } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import * as fs from 'fs';
import { CategoryCreateDto } from './dto/category.create.dto';
@Injectable()
export class CategoryService extends CommonService<CategoryEntity>{
  constructor(@InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>) {
    super(categoryRepository)
  }

  async findCategoryById(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        id: id
      },

    })
    return category;
  }

  protected aliasName = 'categories';

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


  

  public async create(currentUser, data: DeepPartial<CategoryCreateDto>): Promise<any> {
    try {
     
      const checkData = await this._checkDataExist(currentUser , data , false);
      if(!checkData.success){
          return {
          success: false,
          message: checkData.error
        }
      }

      const imagePath = data.image;
      if(!fs.existsSync(imagePath)){
        return {
          success:false,
          message:'Ảnh chưa tồn tại'
        }
      }
    
      const dataEntity = this._beforeUpdateData(currentUser, data);
      const entity: CategoryEntity =  this.repository.create(dataEntity);

      entity['parentId'] = data.parentId;
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


      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log(entity)
      const response = await this.categoryRepository.save(entity);
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
   * Get all data with pagination
   * @param currentUser
   * @param params
   * @param isPaginate
   */
  public async findAll(currentUser, params, isPaginate): Promise<any> {
    // try {
    let $pagination = {};
    let query: SelectQueryBuilder<CategoryEntity> = await this.repository.createQueryBuilder(
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
    await query.leftJoinAndSelect(this.aliasName +'.posts', 'post')
              .leftJoinAndSelect(this.aliasName +'.products', 'product')
              .leftJoinAndSelect(this.aliasName +'.children', 'chil')
              .leftJoinAndSelect(this.aliasName +'.parent', 'parent')
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


  /**
   * Get all data with pagination
   * @param params
   * @param isPaginate
   */
   public async findAllForUser(params, isPaginate): Promise<any> {
    // try {
    let $pagination = {};
    let query: SelectQueryBuilder<CategoryEntity> = await this.repository.createQueryBuilder(
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
    await query.leftJoinAndSelect(this.aliasName +'.posts', 'post')
              .leftJoinAndSelect(this.aliasName +'.products', 'product')
              .leftJoinAndSelect(this.aliasName +'.children', 'chil')
              .leftJoinAndSelect(this.aliasName +'.parent', 'parent')
              .select([this.aliasName +'.id', 
                        this.aliasName +'.name',
                        this.aliasName +'.description' ,
                        this.aliasName +'.type',
                        this.aliasName +'.image',
                        this.aliasName +'.is_show_menu',
                        this.aliasName +'.parent_id',
                       
                        "chil" +'.id', 
                        "chil" +'.name',
                        "chil" +'.description' ,
                        "chil" +'.type',
                        "chil" +'.image',
                        "chil" +'.is_show_menu',
                        'chil.parent_id',

                        "parent" +'.id', 
                        "parent" +'.name',
                        "parent" +'.description' ,
                        "parent" +'.type',
                        "parent" +'.image',
                        "parent" +'.is_show_menu',
                        

                        'post.title', 
                        'post.content',
                        'post.image',
                        'post.published_at',
                        'post.description',
                        'post.user_id',
                        'post.category_id',

                        'product.id',
                        'product.name',
                        'product.image',
                        'product.description',
                        'product.category_id',

                      ])
              .where('categories.status = :status', { status: 1 })
              .getMany();
    // let results = await query.execute(); // for performance

    
    if (params['onlyData']) {
      return results;
    }
    return {
      success: true,
      data: results,
      pagination: $pagination,
    };
    // } catch (e) {
    //   return this.showError();
    // }
  }

  public async getList(){
      const data = await this.categoryRepository.find({select:['id' , 'name']})
      return {
        success:true,
        data: data
      };
  }

  public async getTree(){
    const data = await this.repository.find({select:['id' , 'name' , 'children']})
    if(data){
      return {
        success:true,
        data: data
      }
    }else{
      return{
        success:false,
        message:'GET TREE FALSE'
      }
    }
    
}


  /**
   * view detail by id
   * @param params
   * @param id
   */
   public async findOneByIdForUser( id: number, params = {}): Promise<any> {
    try {
      let query: SelectQueryBuilder<CategoryEntity> =
        await this.repository.createQueryBuilder(this.aliasName);

      const select = this._selectFields(params);
      if (select.length > 0) {
        const selectInView = this._viewSelectFields();
        query.select([...select, ...selectInView]);
      }
      query.andWhere(this.aliasName + '.id = :paramId', { paramId: id });
      query = await this._joinRelation(query, params);
      query = await this._viewJoinRelation(query);
      

      let results = await query
      .leftJoinAndSelect(this.aliasName +'.posts', 'post')
      .leftJoinAndSelect(this.aliasName +'.products', 'product')
      .leftJoinAndSelect(this.aliasName +'.children', 'chil')
      .leftJoinAndSelect(this.aliasName +'.parent', 'parent')
      .select([this.aliasName +'.id', 
                this.aliasName +'.name',
                this.aliasName +'.description' ,
                this.aliasName +'.type',
                this.aliasName +'.image',
                this.aliasName +'.is_show_menu',
                
                

                "chil" +'.id', 
                "chil" +'.name',
                "chil" +'.description' ,
                "chil" +'.type',
                "chil" +'.image',
                "chil" +'.is_show_menu',
                'chil.parent_id',

                "parent" +'.id', 
                "parent" +'.name',
                "parent" +'.description' ,
                "parent" +'.type',
                "parent" +'.image',
                "parent" +'.is_show_menu',
               
                'post.title', 
                'post.content',
                'post.image',
                'post.published_at',
                'post.description',
                'post.user_id',
                'post.category_id',

                'product.id',
                'product.name',
                'product.image',
                'product.description',
                'product.category_id',

              ]).getOne();
     
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
}

