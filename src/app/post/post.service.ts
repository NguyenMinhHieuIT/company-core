import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { CategoryEntity } from '../category/category.entity';
import { CategoryService } from '../category/category.service';
import { CommonService } from '../common';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { PostEntity } from './entities/post.entity';
import * as fs from 'fs';
@Injectable()
export class PostService extends CommonService<PostEntity> {
    constructor(@InjectRepository(PostEntity) private readonly postRepository: Repository<PostEntity>,
                @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
                @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
               
                
    ){
      super(postRepository);
    }
    protected aliasName = 'posts';


    
    public async checkConstraint(data:DeepPartial<PostEntity>){
      try {
          
          await this.categoryRepository.findOneByOrFail({id:data.category_id});
          await this.userRepository.findOneByOrFail({id:data.user_id});
        
         return {
          success: true
         }
      } catch (error) {
        return  {success:false}
      }
     
     
    }


    protected async _checkDataExist($currentUser, $id, $data) {
      if ($data['title']) {
        const result = await this._checkFieldExist($data['title'], 'title', $id);
        if (result) {
          return {
            success: false,
            error: 'Tiêu đề đã tồn tại, vui lòng kiểm tra lại!',
          };
        }
      }
     
      return {
        success: true,
      };
    }
   

  public async create(currentUser, data: DeepPartial<PostEntity> ): Promise<any> {
    try {
      
      const checkConstraint = await this.checkConstraint(data);
     
      if(!checkConstraint.success){
        return {
          success:false,
          message:"user hoặc category không tồn tại"
        }
      }

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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      const entity: PostEntity = this.postRepository.create(dataEntity);

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
     
      const response = await this.repository.save(entity);
      await this._afterSaveData(-1, response, dataEntity);

      return {
        success: true,
        msg: 'Thêm dữ liệu thành công!',
        data: {
           id: response['id']
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
    let query: SelectQueryBuilder<PostEntity> = await this.repository.createQueryBuilder(
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
    await query
     .leftJoinAndSelect(this.aliasName +'.category', 'category')
              .leftJoinAndSelect(this.aliasName +'.user', 'user')
             .leftJoinAndSelect(this.aliasName +'.comments', 'comment')
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
    let query: SelectQueryBuilder<PostEntity> = await this.repository.createQueryBuilder(
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
    await query
              .leftJoinAndSelect(this.aliasName +'.comments', 'comment')
              .leftJoinAndSelect(this.aliasName +'.category', 'category')
              .leftJoinAndSelect(this.aliasName +'.user', 'user')  
              .select([this.aliasName +'.id', 
                        this.aliasName +'.title',                       
                        this.aliasName +'.content' ,
                        this.aliasName +'.image',
                        this.aliasName +'.published_at',
                        this.aliasName +'.description',
                        this.aliasName +'.category_id',
                        this.aliasName +'.user_id',

                        'category.id', 
                        'category.name',
                        'category.description',
                        'category.type',

                        'user.id',
                        'user.email',
                        'user.password',
                        'user.fullName',
                        'user.address',
                        'user.phone',
                        'user.gender',
                        'user.age',
                        'user.image',
                        'user.lastAccess',


                        'comment.id',
                        'comment.content',
                        'comment.user_id',
                        'comment.post_id',
                      ])
              .where('posts.status = :status', { status: 1 })
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
      const data = await this.postRepository.find({select:['id' , 'title']})
      return {
        success:true,
        data: data
      };
  }

   /**
   * view detail by id
   * @param params
   * @param id
   */
    public async findOneByIdForUser( id: number, params = {}): Promise<any> {
      try {
        let query: SelectQueryBuilder<PostEntity> =
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
        .leftJoinAndSelect(this.aliasName +'.comments', 'comment')
        .leftJoinAndSelect(this.aliasName +'.category', 'category')
        .leftJoinAndSelect(this.aliasName +'.user', 'user')  
        .select([
                this.aliasName +'.id', 
                this.aliasName +'.title',                       
                this.aliasName +'.content' ,
                this.aliasName +'.image',
                this.aliasName +'.published_at',
                this.aliasName +'.description',
                this.aliasName +'.category_id',
                this.aliasName +'.user_id',

                'category.id', 
                        'category.name',
                        'category.description',
                        'category.type',

                        'user.id',
                        'user.email',
                        'user.password',
                        'user.fullName',
                        'user.address',
                        'user.phone',
                        'user.gender',
                        'user.age',
                        'user.image',
                        'user.lastAccess',


                        'comment.id',
                        'comment.content',
                        'comment.user_id',
                        'comment.post_id',
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
