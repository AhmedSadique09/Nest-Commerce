import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../model/user.module';
import { AuthHelperService } from '../helper/auth.helper';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { UserService } from 'src/model/user.service';

@Module({
    imports: [UserModule, ConfigModule],
    controllers: [AuthController],
    providers: [AuthService, AuthHelperService, JwtAuthGuard, UserModule, UserService],
})
export class AuthModule { }
