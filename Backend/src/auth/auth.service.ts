import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../model/user.model';
import { AuthHelperService } from '../helper/auth.helper';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { IApiResponse, IUserPayload, ILoginPayload } from '../interfaces/api-response.interface';
import { ErrorMessages } from '../enums/error-messages.enum';
import { EResponseMessages } from '../enums/response-messages.enum';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly authHelperService: AuthHelperService,
    ) { }

    async register(registerDto: RegisterDto): Promise<IApiResponse<IUserPayload>> {
        // Check if a user with the same email already exists
        const userExists = await this.userModel.findOne({ email: registerDto.email });
        if (userExists) {
            throw new HttpException(
                ErrorMessages.ACCOUNT_EXISTS,
                HttpStatus.CONFLICT,
            );
        }

        // Generate a hashed password
        const hashedPassword = this.authHelperService.hashPassword(
            registerDto.password,
        );

        // Generate a random OTP
        const OTP = this.authHelperService.generateOTP();

        // Generate OTP expiration time
        const otpExpireAt = this.authHelperService.generateExpiryTime();

        // Create user body with registration details
        const body: any = {
            username: registerDto.username,
            email: registerDto.email.toLowerCase(),
            password: hashedPassword,
            OTP,
            otpExpireAt,
            roles: registerDto.roles || ['user'],
        };

        // Create the user in the database
        const user = await new this.userModel(body).save();

        return {
            statusCode: HttpStatus.CREATED,
            message: 'User registered successfully',
            payload: this.formatUserResponse(user),
        };
    }

    async login(loginDto: LoginDto): Promise<IApiResponse<ILoginPayload>> {
        const user = await this.userModel.findOne({ email: loginDto.email });

        if (!user) {
            throw new HttpException(
                ErrorMessages.USER_NOT_EXISTS,
                HttpStatus.NOT_FOUND,
            );
        }

        const isCorrect = this.authHelperService.comparePassword(
            loginDto.password,
            user.password,
        );

        if (!isCorrect) {
            throw new HttpException(
                ErrorMessages.INVALID_PASSWORD,
                HttpStatus.CONFLICT,
            );
        }

        const token = this.authHelperService.generateToken(user);

        return {
            statusCode: HttpStatus.OK,
            message: EResponseMessages.USER_LOGIN,
            payload: {
                user: this.formatUserResponse(user),
                token,
            },
        };
    }

    async resendOTP(resendOtpDto: ResendOtpDto): Promise<IApiResponse<null>> {
        const user = await this.userModel.findOne({ email: resendOtpDto.email.toLowerCase() });

        if (!user) {
            throw new HttpException(
                ErrorMessages.USER_NOT_EXISTS,
                HttpStatus.NOT_FOUND,
            );
        }

        const OTP = this.authHelperService.generateOTP();
        const otpExpireAt = this.authHelperService.generateExpiryTime();

        await this.userModel.findByIdAndUpdate(user._id, {
            OTP,
            otpExpireAt,
        });

        return {
            statusCode: HttpStatus.OK,
            message: EResponseMessages.OTP_RESEND,
            payload: null,
        };
    }

    async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<IApiResponse<ILoginPayload>> {
        const user = await this.userModel.findOne({ email: verifyEmailDto.email.toLowerCase() });

        if (!user) {
            throw new HttpException(
                ErrorMessages.USER_NOT_EXISTS,
                HttpStatus.NOT_FOUND,
            );
        }

        // Check availability of the OTP
        if (!user.OTP || user.OTP !== Number(verifyEmailDto.otp)) {
            throw new HttpException(
                ErrorMessages.INVALID_OTP,
                HttpStatus.BAD_REQUEST,
            );
        }

        // Check expiration of the OTP
        if (user.otpExpireAt < Date.now()) {
            throw new HttpException(
                ErrorMessages.OTP_EXPIRED,
                HttpStatus.BAD_REQUEST,
            );
        }

        // Generate auth token
        const token = this.authHelperService.generateToken(user);

        // Update user to clear OTP
        await this.userModel.findByIdAndUpdate(user._id, {
            OTP: null,
            otpExpireAt: null,
        });

        return {
            statusCode: HttpStatus.OK,
            message: EResponseMessages.USER_VERIFIED,
            payload: {
                user: this.formatUserResponse(user),
                token,
            },
        };
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<IApiResponse<null>> {
        const user = await this.userModel.findOne({ email: forgotPasswordDto.email.toLowerCase() });

        if (!user) {
            throw new HttpException(
                ErrorMessages.USER_NOT_EXISTS,
                HttpStatus.NOT_FOUND,
            );
        }

        const OTP = this.authHelperService.generateOTP();
        const otpExpireAt = this.authHelperService.generateExpiryTime();

        await this.userModel.findByIdAndUpdate(user._id, {
            OTP,
            otpExpireAt,
        });

        // Send OTP email (Placeholder)
        /*
        try {
            // Email service to send OTP for password reset
        } catch (error) {
            console.error('Failed to send password reset OTP email:', error);
        }
        */

        return {
            statusCode: HttpStatus.OK,
            message: EResponseMessages.PASSWORD_RESET_EMAIL,
            payload: null,
        };
        return {
            statusCode: HttpStatus.OK,
            message: EResponseMessages.PASSWORD_RESET_EMAIL,
            payload: null,
        };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<IApiResponse<null>> {
        // Find user by email
        const user = await this.userModel.findOne({ email: resetPasswordDto.email.toLowerCase() });

        // Check if user exists
        if (!user) {
            throw new HttpException(
                ErrorMessages.USER_NOT_EXISTS,
                HttpStatus.NOT_FOUND,
            );
        }

        // Check availability of the OTP
        if (!user.OTP || user.OTP !== Number(resetPasswordDto.otp)) {
            throw new HttpException(
                ErrorMessages.INVALID_OTP,
                HttpStatus.BAD_REQUEST,
            );
        }

        // Check expiration of the OTP
        if (user.otpExpireAt < Date.now()) {
            throw new HttpException(
                ErrorMessages.OTP_EXPIRED,
                HttpStatus.BAD_REQUEST,
            );
        }

        // Generate a hashed password
        const hashedPassword = this.authHelperService.hashPassword(
            resetPasswordDto.newPassword,
        );

        // Update the user's password and clear OTP
        await this.userModel.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            OTP: null,
            otpExpireAt: null,
        });

        return {
            statusCode: HttpStatus.OK,
            message: EResponseMessages.PASSWORD_UPDATED,
            payload: null,
        };
    }

    private formatUserResponse(user: UserDocument): IUserPayload {
        return {
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            roles: user.roles,
            profilePicture: user.profilePicture,
        };
    }
}
