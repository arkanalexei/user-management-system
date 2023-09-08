import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma.service';
import { User, Prisma, UserType } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { UserDTO } from "./user.dto";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async user(
        userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    ): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: userWhereUniqueInput,
        })

        if (!user) {
            throw new BadRequestException("Failed to fetch user, ID is invalid.");
        }
        return user;
    }

    async users(params: {
        skip?: number;
        take?: number;
        userType?: UserType;
        orderBy?: Prisma.UserOrderByWithRelationInput;
        order?: Prisma.SortOrder;
    }): Promise<User[]> {
        const { skip, take, userType, orderBy, order } = params;
        const where: Prisma.UserWhereInput = {};

        // Check if userType is valid
        if (userType) {
            if (Object.values(UserType).includes(userType as UserType)) {
                where.userType = userType as UserType;
            } else {
                throw new BadRequestException("Invalid user type provided");
            }
        }

        const query: any = {
            ...(skip && { skip: skip }),
            ...(take && { take: take }),
            ...(Object.keys(where).length > 0 && { where }),
        };

        if (orderBy && order) {
            query.orderBy = {
                [orderBy as string]: order,
            };
            console.log(params);
        }

        return this.prisma.user.findMany(query);
    }

    async createUser(userDTO: UserDTO): Promise<User> {
        const existingUser = await this.findUser({ name: userDTO.name });
        if (existingUser) {
            throw new BadRequestException(`User with username ${userDTO.name} already exists.`);
        }

        const isValidRole = this.checkRole(userDTO);
        if (!isValidRole) {
            throw new BadRequestException("Invalid user type provided.");
        }

        userDTO.password = await bcrypt.hash(userDTO.password, 10);
        return this.prisma.user.create({ data: userDTO });
    }

    async updateUser(id: number, userDTO: UserDTO): Promise<User> {
        const user = await this.findUser({ id: id });
        if (!user) {
            throw new BadRequestException("Failed to update user, ID is invalid.")
        }

        const isValidRole = this.checkRole(userDTO);
        if (!isValidRole) {
            throw new BadRequestException("Invalid user type provided.");
        }

        const existingUser = await this.findUser({ name: userDTO.name });
        if (existingUser && existingUser.id !== id) {
            throw new BadRequestException(`User with username ${userDTO.name} already exists.`);
        }

        const where: Prisma.UserWhereUniqueInput = { id: Number(id) };
        const data: Prisma.UserUpdateInput = { ...userDTO };

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        return this.prisma.user.update({
            data,
            where,
        });
    }

    async deleteUser(id: number): Promise<User> {
        const user = await this.findUser({ id });
        if (!user) {
            throw new BadRequestException("Failed to update user, ID is invalid.")
        }

        const where: Prisma.UserWhereUniqueInput = { id: Number(id) };
        return this.prisma.user.delete({
            where,
        });
    }

    async findUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
        return this.prisma.user.findFirst({
            where,
        });
    }

    checkRole(userDTO: UserDTO): boolean {
        const validUserTypes = [UserType.SUPPLIER, UserType.RETAILER];
        return validUserTypes.includes(userDTO.userType);
    }
}
