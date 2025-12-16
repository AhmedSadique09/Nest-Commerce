import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        type: String,
        description: 'User username',
        example: 'johndoe'
    })
    username: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'User email address',
        example: 'john.doe@example.com'
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @ApiProperty({
        type: String,
        description: 'User password (minimum 8 characters)',
        example: 'SecurePass123!'
    })
    password: string;

    @IsOptional()
    @IsArray()
    @IsEnum(['user', 'admin'], { each: true })
    @ApiProperty({
        type: [String],
        description: 'User roles',
        enum: ['user', 'admin'],
        example: ['user'],
        required: false
    })
    roles?: string[];
}
