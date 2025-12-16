import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
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
        description: 'User password',
        example: 'SecurePass123!',
    })
    password: string;
}
