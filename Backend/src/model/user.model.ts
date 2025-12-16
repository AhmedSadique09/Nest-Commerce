import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Connection } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { EDependencyTokens } from '../enums/dependency-tokens.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({
        default:
            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    })
    profilePicture: string;

    @Prop({ type: [String], enum: ['user', 'admin'], default: ['user'] })
    roles: string[];

    @Prop()
    OTP: number;

    @Prop()
    otpExpireAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserProvider = {
    provide: getModelToken(User.name),
    useFactory: (connection: Connection) => connection.model(User.name, UserSchema),
    inject: [EDependencyTokens.DB_CONNECTION_TOKEN],
};
