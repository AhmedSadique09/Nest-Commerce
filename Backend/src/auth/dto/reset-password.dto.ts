import { IsEmail, IsNotEmpty, IsString, MinLength, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'User email address',
        example: 'john.doe@example.com',
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @ApiProperty({
        type: String,
        description: 'New password',
        example: 'NewSecurePass123!',
    })
    newPassword: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 6, { message: 'OTP must be exactly 6 digits long' })
    @ApiProperty({
        type: String,
        description: 'One-Time Password (OTP)',
        example: '123456',
    })
    otp: string;
}
