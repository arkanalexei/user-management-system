import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete, BadRequestException, Query
} from '@nestjs/common';
import { UserService } from "./services/user.service";
import {$Enums, Prisma, User as UserModel, UserType} from '@prisma/client';

@Controller()
export class AppController {
  constructor(
      private readonly userService: UserService,
  ) {}

  @Get('users')
  async getUsers(
      @Query('skip') skip?: string,
      @Query('take') take?: string,
      @Query('userType') userType?: string,
      @Query('orderBy') orderBy?: string,
      @Query('order') order?: string
  ): Promise<UserModel[]> {

    const where: Prisma.UserWhereInput = {};

    if (userType) {
      if (Object.values(UserType).includes(userType as UserType)) {
        where.userType = userType as UserType;
      } else {
        throw new BadRequestException("Invalid user type provided");
      }
    }

    const params: any = {
      ...(skip && { skip: Number(skip) }),
      ...(take && { take: Number(take) }),
      ...(Object.keys(where).length > 0 && { where }),
    };

    if (orderBy && order) {
      params.orderBy = {
        [orderBy]: order,
      };
    }

    return this.userService.users(params);
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string): Promise<UserModel> {
    const user = await this.userService.user({
      id: Number(id)
    });

    if (!user) {
      throw new BadRequestException("Failed to fetch user, ID is invalid.");
    }

    return user;
  }

  @Post('users')
  async signupUser(
      @Body() userData: { name: string; userType: $Enums.UserType; password: string },
  ): Promise<UserModel> {
    const where: Prisma.UserWhereUniqueInput = {name: userData.name};
    const user = await this.userService.findUser(where)

    if (user) {
      throw new BadRequestException(`User with username ${userData.name} already exist.`)
    }

    try{
      return await this.userService.createUser(userData);
    } catch {
      throw new BadRequestException("Failed to register user, missing name or password")
    }
  }

  @Put('users/:id')
  async updateUserById(
      @Param('id') id: string,
      @Body() userData: { name: string, userType: $Enums.UserType, password: string}): Promise<UserModel> {
    try {
      const where: Prisma.UserWhereUniqueInput = {id: Number(id)};
      const data: Prisma.UserUpdateInput = {...userData};

      return await this.userService.updateUser({where, data});
    } catch {
      throw new BadRequestException("Failed to update user, ID is invalid.")
    }
  }

  @Delete('users/:id')
  async deleteUserById(
      @Param('id') id: string
  ): Promise<UserModel> {
    try {
      const where: Prisma.UserWhereUniqueInput = {id: Number(id)}
      return await this.userService.deleteUser(where)
    } catch {
      throw new BadRequestException("Failed to delete user, ID is invalid.")
    }
  }
}
