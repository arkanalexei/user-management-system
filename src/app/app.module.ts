import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }),
  AuthModule],
  controllers: [AppController],
  providers: [AppService, UserService, PrismaService],
})
export class AppModule {}
