import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthHelperService } from '../helper/auth.helper';
import { UserService } from '../model/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly authHelperService: AuthHelperService,
        private readonly userService: UserService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        }

        const token = authHeader.replace('Bearer ', '');

        try {
            const decoded = this.authHelperService.verifyToken(token);

            // Get user from database to ensure they still exist
            const user = await this.userService.findById(decoded.id);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            // Add user to request object
            request.user = user;
            return true;
        } catch (error) {
            console.log("error==>", error.message);

            throw new UnauthorizedException('Invalid token');
        }
    }
}
