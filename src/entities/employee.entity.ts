import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContactInfo } from './contact-info.entity';
import { Meeting } from './meeting.entity';
import { Task } from './task.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  // 👥 External Relationships

  // This will be like a cart
  // One User can only have one cart
  // One to one relationship with the user
  @OneToOne(() => ContactInfo, (ci) => ci.employee)
  public contactInfo: ContactInfo;

  // This will be like an order
  // One User can place as many orders
  // Many to One relationship with the user
  @OneToMany(() => Task, (task) => task.employee, {
    eager: true, // Always include the tasks when fetching a user
  })
  public tasks: Task[];

  // @ManytoMany colums are automatically CASCADED on deletion
  @ManyToMany(() => Meeting, (meeting) => meeting.attendees)
  @JoinTable()
  public meetings: Meeting[];

  // 🧘 Self Reference
  @ManyToOne(() => Employee, (employee) => employee.directReports, {
    onDelete: 'SET NULL',
  })
  manager: Employee;

  @OneToMany(() => Employee, (employee) => employee.manager)
  directReports: Employee[];
}
