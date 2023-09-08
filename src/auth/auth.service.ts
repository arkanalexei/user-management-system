import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service";
import { LoginDTO } from "./auth.dto";
import * as bcrypt from 'bcrypt';
import { AuthEntity } from "./auth.entity";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(loginDTO: LoginDTO): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({where: {name: loginDTO.name}});

    if (!user) {
      throw new BadRequestException(`No user found with name ${loginDTO.name}`);
    }

    const isPasswordValid = await bcrypt.compare(loginDTO.password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException("Invalid password");
    }

    return { accessToken: this.jwtService.sign({id: user.id}) };
  }
}
