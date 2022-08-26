import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactInfo } from './entities/contact-info.entity';
import { Employee } from './entities/employee.entity';
import { Meeting } from './entities/meeting.entity';
import { Task } from './entities/task.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(ContactInfo)
    private readonly contactInfoRepo: Repository<ContactInfo>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(Meeting)
    private readonly meetingRepo: Repository<Meeting>,
  ) {}

  async seed() {
    // Employee 1 - doesn't have any manager
    const ceo = await this.employeeRepo.create({
      name: 'Mr. CEO',
    });
    await this.employeeRepo.save(ceo);

    // Added contact info for the ceo
    const ceoContactInfo = this.contactInfoRepo.create({
      email: 'test@test.com',
      // employeeId: ceo.id,
    });
    ceoContactInfo.employee = ceo;
    await this.contactInfoRepo.save(ceoContactInfo);

    // Employee 2 - Who has a manager "ceo", who they report to
    const manager = await this.employeeRepo.create({
      name: 'Manager Man',
      manager: ceo,
    });

    // Tasks
    const task1 = this.taskRepo.create({ title: 'Hire People' });
    await this.taskRepo.save(task1);
    const task2 = this.taskRepo.create({ title: 'Present to CEO' });
    await this.taskRepo.save(task2);

    // Assign these tasks to the manager (employee 2)
    manager.tasks = [task1, task2];

    // Create a meeting
    const meeting1 = await this.meetingRepo.create({
      zoomUrl: 'https://zoom.com/jhgwfefew',
    });
    // ceo attends this meeting
    meeting1.attendees = [ceo];
    await this.meetingRepo.save(meeting1);

    // The manager also attends the same meeting
    manager.meetings = [meeting1];
    await this.employeeRepo.save(manager);
  }

  async getAll() {
    return await this.employeeRepo.find();
  }

  async getEmployeeById(id: string) {
    const employee = await this.employeeRepo.findOne({
      where: { id },
      relations: [
        'tasks',
        'meetings',
        'contactInfo',
        'manager',
        'directReports',
      ],
    });

    if (!employee)
      throw new NotFoundException(`Employee with id "${id}" not found`);

    return employee;
  }

  async getEmployeeByIdCUSTOM(id: string) {
    return await this.employeeRepo
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.directReports', 'directReports')
      .leftJoinAndSelect('employee.meetings', 'meetings')
      .leftJoinAndSelect('employee.tasks', 'tasks')
      .where('employee.id = :employeeId', { employeeId: id })
      .getOne();
  }

  async delete(id: string) {
    const employee = await this.getEmployeeById(id);
    console.log('employee', employee);

    return await this.employeeRepo.remove(employee);
  }
}
