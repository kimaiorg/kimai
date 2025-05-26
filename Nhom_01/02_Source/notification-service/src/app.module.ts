import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { NotificationModule } from './graphql/notification.module';

@Module({
  imports: [
    ApiModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      sortSchema: true,
      playground: true,
    }),
    NotificationModule,
  ],
  providers: [AppService],
})
export class AppModule {}
