import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { CommonService } from '../common';
import { CommentEntity as Comment } from './comment.entity';
import { UserEntity as User } from '../user/user.entity';
import { PostEntity as Post } from '../post/entities/post.entity';
import { UserService } from '../user/user.service';
import { Constants } from '../../constant';

@Injectable()
export class CommentService extends CommonService<Comment> {
  protected aliasName: string = 'comment';
  protected aliasNameUser: string = 'user';
  protected aliasNamePost: string = 'post';
  protected aliasNameReply: string = 'replies';
  constructor(
    @InjectRepository(Comment)
    protected readonly repoComment: Repository<Comment>,
    @InjectRepository(User)
    protected readonly repoUser: Repository<User>,
    @InjectRepository(Post)
    protected readonly repoPost: Repository<Post>,
    protected readonly userService: UserService

  ) {
    super(repoComment);
  }

  public _selectFields(): string[] {
    return [
      'comment.id',
      'comment.content',
      'comment.status',
      'comment.created',
      'comment.updated',
      'comment.user_id',
      'comment.parent_id',
      'comment.post_id'
    ]
  }

  private checkOrderList(params) {
    const order = params['order'] ?? '';
    if (order.toString().toUpperCase() === 'ASC' || order.toString().toUpperCase() === 'DESC') {
      return order.toString().toUpperCase();
    }
    return "ASC";
  }


  public async getAllComments(req, params): Promise<any> {
    try {
      const selectFieldComments: string[] = this._selectFields()
        .filter(item => !item.includes('status') && !item.includes('created') && !item.includes('updated'));
      const selectFieldUsers: string[] = this.userService._selectFields()
        .filter(item => !item.includes('status') && !item.includes('created') && !item.includes('updated'));
      const selectFieldReplies: string[] = [
        'replies.id',
        'replies.content',
        'replies.user_id',
        'replies.post_id',
        'replies.parent_id',
      ];
      const selectFieldPosts: string[] = [
        'post.id',
        'post.title',
        'post.content',
        'post.image',
        'post.published_at',
        'post.description'
      ]
      const where = {
        status: Constants.status.ACTIVE
      }
      const order = this.checkOrderList(params);

      const allComments = await this.repoComment
        .createQueryBuilder(this.aliasName)
        .leftJoinAndSelect(this.aliasName + '.' + this.aliasNameUser, this.aliasNameUser)
        .leftJoinAndSelect(this.aliasName + '.' + this.aliasNamePost, this.aliasNamePost)
        .leftJoinAndSelect(this.aliasName + '.' + this.aliasNameReply, this.aliasNameReply)
        .select(selectFieldComments)
        .addSelect(selectFieldReplies)
        .addSelect(selectFieldUsers)
        .addSelect(selectFieldPosts)
        .where(this.aliasName + '.status = :status', where)
        .andWhere('comment.parent_id is null')
        .addOrderBy('comment.created', order)
        .getMany()


      return {
        success: true,
        data: allComments
      }
    } catch (error) {
      this.showError();
    }
  }

  public async create(currentUser, data: DeepPartial<Comment>): Promise<any> {
    try {
      const dataEntity = super._beforeUpdateData(currentUser, data);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const entity: T = this.repoComment.create(dataEntity);
      const validate = await super.validate(entity, {
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
      entity['created_at'] = new Date()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const response = await this.repoComment.save(entity);
      await super._afterSaveData(-1, response, dataEntity);

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

  public async update(
    currentUser,
    id: number,
    data: DeepPartial<Comment> | Comment,
  ): Promise<any> {
    try {
      const dataEntity = super._beforeUpdateData(currentUser, data);
      const entity = await this.repoComment.findOneBy({ id });
      if (!entity) {
        return {
          success: false,
          error: "ID nhập vào không hợp lệ"
        }
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.repoComment.merge(entity, dataEntity);
      entity['updated'] = new Date();
      const validate = await this.validate(entity, {
        groups: ['update'],
      });
      if (!validate.success) {
        return validate;
      }
      const dataAlreadyExist = await this._checkDataExist(currentUser, id, entity);
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

  protected async _checkDataExist($currentUser, $id, $data) {
    if ($data['user_id']) {
      const user: User[] = await this.repoUser.find({
        where: {
          id: $data.user_id
        }
      })
      if (user.length === 0) {
        return {
          success: false,
          error: "User_id không tồn tại"
        }
      }
    }

    if ($data['post_id']) {
      const post: Post[] = await this.repoPost.find({
        where: {
          id: $data['post_id']
        }
      })
      if (post.length === 0) {
        return {
          success: false,
          error: 'Post_id không tồn tại'
        }
      }
    }

    if ($data['parent_id']) {
      const comment: Comment[] = await this.repoComment.find({
        where: {
          id: $data['parent_id']
        }
      })
      if (comment.length === 0) {
        return {
          success: false,
          error: 'Comment_id không tồn tại'
        }
      }
    }

    const {
      status,
      created,
      updated,
      id,
      ...where
    } = $data

    const ent: Comment[] = await this.repoComment.find({ where })
    if (ent.length > 0) {
      return {
        success: false,
        error: "Dữ liệu đã tồn tại"
      }
    }

    return {
      success: true,
    };
  }
}
