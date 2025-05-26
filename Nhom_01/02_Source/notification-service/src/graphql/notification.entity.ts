import { registerEnumType } from '@nestjs/graphql';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';

export enum NotificationType {
  EXPENSE_REQUEST = 'expense_request',
  ABSENCE_REQUEST = 'absence_request',
  TIMESHEET_REQUEST = 'timesheet_request',
  EXPENSE_REQUEST_STATUS = 'expense_request_status',
  ABSENCE_REQUEST_STATUS = 'absence_request_status',
  TIMESHEET_REQUEST_STATUS = 'timesheet_request_status',
  CHANGE_STATUS_REQUEST = 'change_status_request',
}

registerEnumType(NotificationType, {
  name: 'NotificationType',
});

@ObjectType()
export class Notification {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => NotificationType)
  type: NotificationType;

  @Field()
  target_id: string;

  @Field()
  user_id: string;

  @Field()
  has_read: boolean;

  @Field(() => GraphQLISODateTime)
  created_at: Date;

  @Field(() => GraphQLISODateTime)
  updated_at: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  deleted_at?: Date;
}

@ObjectType()
export class NotificationListMetadata {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}

@ObjectType()
export class NotificationListResult {
  @Field(() => [Notification])
  data: Notification[];

  @Field(() => NotificationListMetadata, { nullable: true })
  metadata?: NotificationListMetadata;
}
