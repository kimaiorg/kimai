// dto/list-notifications.input.ts
import { InputType, Field, Int } from '@nestjs/graphql';
import { GraphQLISODateTime } from '@nestjs/graphql';
import { NotificationType } from './notification.entity';

@InputType()
export class ListNotificationsInput {
  @Field(() => String)
  userId: string;

  @Field(() => NotificationType, { nullable: true })
  type?: NotificationType;

  @Field({ nullable: true })
  targetId?: string;

  @Field({ nullable: true })
  hasRead?: boolean;

  @Field(() => GraphQLISODateTime, { nullable: true })
  startDate?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  endDate?: Date;

  @Field(() => Int, { defaultValue: 1 })
  page?: number;

  @Field(() => Int, { defaultValue: 10 })
  limit?: number;

  @Field({ defaultValue: 'created_at' })
  sortBy?: 'created_at';

  @Field({
    defaultValue: 'desc',
  })
  sortOrder?: 'asc' | 'desc';
}
