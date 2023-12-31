import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/jwt/jwt-auth.guard";
import { User as UserModel } from ".prisma/client";
import { Prisma, UserType } from "@prisma/client";
import { UserDTO } from "./user.dto";

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getUsers(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('userType') userType?: string,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: string,
  ): Promise<UserModel[]> {
    return await this.userService.users({
      skip: Number(skip),
      take: Number(take),
      userType: userType as UserType,
      orderBy: orderBy as Prisma.UserOrderByWithRelationInput,
      order: order as Prisma.SortOrder,
    });
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string): Promise<UserModel> {
    return await this.userService.user({ id: Number(id) });
  }

  @Post('users')
  async signupUser(@Body() userDTO: UserDTO): Promise<UserModel> {
    return await this.userService.createUser(userDTO);
  }

  @Put('users/:id')
  @UseGuards(JwtAuthGuard)
  async updateUserById(
    @Param('id') id: string,
    @Body() userDTO: UserDTO,
  ): Promise<UserModel> {
    return await this.userService.updateUser(Number(id), userDTO);
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUserById(@Param('id') id: string): Promise<UserModel> {
    return await this.userService.deleteUser(Number(id));
  }
}
