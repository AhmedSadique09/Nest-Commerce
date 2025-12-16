import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.model';
import { ErrorMessages } from '../enums/error-messages.enum';
import { Model, UpdateQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
    selectUserFields: Record<string, boolean>;

    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
        this.selectUserFields = {
            _id: true,
            username: true,
            email: true,
            profilePicture: true,
            roles: true,
        };
    }

    async findById(id: string) {
        return await this.userModel.findById(id, this.selectUserFields);
    }

    async update(_id: string, body: UpdateQuery<User>) {
        const user = await this.userModel.findOne({ _id: _id });

        if (!user) {
            throw new HttpException(
                ErrorMessages.USER_NOT_EXISTS,
                HttpStatus.UNAUTHORIZED,
            );
        }
        return await this.userModel.findOneAndUpdate({ _id: user._id }, body, {
            new: true,
        });
    }

    async details(userIds: string[], select = '') {
        if (select && select != '') {
            return await this.userModel.find({ _id: { $in: userIds } }).select(select);
        } else {
            return await this.userModel.find({ _id: { $in: userIds } });
        }
    }
}
