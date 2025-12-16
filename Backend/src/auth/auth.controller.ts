import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { IApiResponse, IUserPayload, ILoginPayload } from '../interfaces/api-response.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/register')
    @ApiBody({ type: RegisterDto })
    @ApiOperation({
        summary: 'User Registration',
        description:
            'Endpoint to allow users (patients and doctors) to register for a new account',
    })
    @HttpCode(HttpStatus.CREATED)
    async register(
        @Body() registerDto: RegisterDto,
    ): Promise<IApiResponse<IUserPayload>> {
        return this.authService.register(registerDto);
    }

    @Post('/login')
    @ApiBody({ type: LoginDto })
    @ApiOperation({
        summary: 'User Login',
        description: 'Endpoint to allow users to login',
    })
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginDto: LoginDto,
    ): Promise<IApiResponse<ILoginPayload>> {
        return this.authService.login(loginDto);
    }

    @Post('/resend-otp')
    @ApiBody({ type: ResendOtpDto })
    @ApiOperation({
        summary: 'Resend OTP',
        description: 'Endpoint to allow users to resend OTP',
    })
    @HttpCode(HttpStatus.OK)
    async resendOTP(
        @Body() resendOtpDto: ResendOtpDto,
    ): Promise<IApiResponse<null>> {
        return this.authService.resendOTP(resendOtpDto);
    }

    @Post('/verify-email')
    @ApiBody({ type: VerifyEmailDto })
    @ApiOperation({
        summary: 'Verify Email',
        description: 'Endpoint to verify user email with OTP',
    })
    @HttpCode(HttpStatus.OK)
    async verifyEmail(
        @Body() verifyEmailDto: VerifyEmailDto,
    ): Promise<IApiResponse<ILoginPayload>> {
        return this.authService.verifyEmail(verifyEmailDto);
    }

    @Post('/forgot-password')
    @ApiBody({ type: ForgotPasswordDto })
    @ApiOperation({
        summary: 'Forgot Password',
        description: 'Endpoint to initiate password reset',
    })
    @HttpCode(HttpStatus.OK)
    async forgotPassword(
        @Body() forgotPasswordDto: ForgotPasswordDto,
    ): Promise<IApiResponse<null>> {
        return this.authService.forgotPassword(forgotPasswordDto);
    }

    @Post('/reset-password')
    @ApiBody({ type: ResetPasswordDto })
    @ApiOperation({
        summary: 'Reset Password',
        description: 'Endpoint to reset password using OTP',
    })
    @HttpCode(HttpStatus.OK)
    async resetPassword(
        @Body() resetPasswordDto: ResetPasswordDto,
    ): Promise<IApiResponse<null>> {
        return this.authService.resetPassword(resetPasswordDto);
    }
}

