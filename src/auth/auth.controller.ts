import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from './auth.service';
import { LoginDTO } from "./auth.dto";
import { AuthEntity } from "./auth.entity";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDTO: LoginDTO): Promise<AuthEntity> {
    return await this.authService.login(loginDTO);
  }
}
