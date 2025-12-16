import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendOtpDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        type: String,
        description: 'User email address',
        example: 'john.doe@example.com',
    })
    email: string;
}
