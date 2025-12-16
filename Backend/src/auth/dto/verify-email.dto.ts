import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
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
    @Length(6, 6, { message: 'OTP must be exactly 6 digits long' })
    @ApiProperty({
        type: String,
        description: 'One-Time Password (OTP)',
        example: '123456',
    })
    otp: string;
}
