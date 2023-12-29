import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../common/base.entity";


@Entity("sliders")
export class SliderEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'title', length: 50 })
  @IsNotEmpty({
    message: "Tiêu đề không được để trống"
  })
  title: string;

  @Column({ type: 'varchar', name: 'description', length: 255 })
  description: string;

  @Column({ type: 'varchar', name: 'image', length: 255 })
  @IsNotEmpty({
    message: "Ảnh không được để trống"
  })
  image: string;

  @Column({ type: 'varchar', name: 'url', length: 255 })
  @IsNotEmpty({
    message: "Đương dẫn không được để trống"
  })
  url: string;
}