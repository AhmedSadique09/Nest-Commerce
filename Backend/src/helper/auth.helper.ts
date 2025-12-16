import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthHelperService {
    constructor(private configService: ConfigService) { }

    /**
     * Generates an authentication token (e.g., JWT) based on user information.
     *
     * @param {Object} userData - User data to be included in the token payload.
     * @returns {string} - The generated authentication token.
     */
    generateToken = (user) => {
        const secret = this.configService.getOrThrow<string>('JWT_TOKEN_SECRET');
        const accessToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
                roles: user.roles,
            },
            secret,
        );

        return accessToken;
    };

    /**
     * Verifies and decodes a JWT token.
     *
     * @param {string} token - The JWT token to verify.
     * @returns {Object} - The decoded token payload.
     */
    verifyToken(token: string): any {
        try {
            const secret = this.configService.getOrThrow<string>('JWT_TOKEN_SECRET');
            const decoded = jwt.verify(token, secret);
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    /**
     * Hashes a plain-text password using a secure hashing algorithm.
     *
     * @param {string} password - The plain-text password to be hashed.
     * @returns {string} - The hashed password.
     */
    hashPassword(password: string): string {
        const passwordSalt = this.configService.getOrThrow<number>('BCRYPT_SALT');

        const salt = bcrypt.genSaltSync(Number(passwordSalt));

        const hash = bcrypt.hashSync(password, salt);
        return hash;
    }

    /**
     * Compares a provided password with the stored hashed password for user authentication.
     *
     * @param {string} providedPassword - The password entered by the user during authentication.
     * @param {string} storedHashedPassword - The hashed password stored in the database.
     * @returns {boolean} - True if the provided password matches the stored hashed password, false otherwise.
     */
    comparePassword(
        providedPassword: string,
        storedHashedPassword: string,
    ): boolean {
        const isCorrect = bcrypt.compareSync(
            providedPassword,
            storedHashedPassword,
        );
        return isCorrect;
    }

    /**
     * Generates an expiry time for a token based on the given duration in minutes.
     *
     * @param {number} durationInMinutes - The duration for which the token should remain valid in minutes.
     * @returns {number} - The expiry timestamp calculated from the current time and the provided duration.
     */
    generateExpiryTime(time?: number | string): number {
        const duration = time ? Number(time) : Number(this.configService.get<number>('REGISTER_OTP_EXPIRATION'));
        const currentTime = new Date().getTime();
        const expiryTime = currentTime + duration * 60 * 1000;
        return Number(expiryTime);
    }

    /**
     * Generates a random one-time password (OTP) with a specified length.
     *
     * @returns {string} - The randomly generated OTP.
     */
    generateOTP(): number {
        const otp = Math.floor(100000 + Math.random() * 900000); // ensures 6-digit OTP
        return Number(otp);
    }

    getIdByUser(user: any): string {
        if (user.userType === 'practice_manager' && user.hospitalAdminId) {
            console.log("user.hospitalAdminId---->>", user.hospitalAdminId);
            return user.hospitalAdminId.toString ? user.hospitalAdminId.toString() : user.hospitalAdminId;
        }
        console.log("user._id---->>", user._id);
        return user._id;
    }

}

