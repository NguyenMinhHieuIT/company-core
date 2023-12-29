import { timeStamp } from 'console';
import { Column } from 'typeorm';

export class BaseEntity {
  @Column({ name: 'status', default: () => "'1'"  , type:'int'})
  status: number;

  @Column( {
    type:'datetime',
    name: 'created_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created: Date | null;

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated: Date | null;
}
