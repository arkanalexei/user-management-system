import { Module } from '@nestjs/common';
import { AppController } from '../app.controller';
import { AppService } from '../services/app.service';
import {UserService} from "../services/user.service";
import {PrismaService} from "../services/prisma.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, UserService, PrismaService],
})
export class AppModule {}
