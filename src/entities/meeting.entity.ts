import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public zoomUrl: string;

  @ManyToMany(() => Employee, (employee) => employee.meetings)
  public attendees: Employee[];
}
