export enum ErrorMessages {
    // User errors
    ACCOUNT_EXISTS = 'User already exists.',
    USER_NOT_EXISTS = 'User does not exist!',
    USER_NOT_VERIFIED = 'Email is not verified yet. Please check your email.',
    INVALID_EMAIL = 'Invalid email!',
    USER_NOT_UPDATED = 'User does not updated!',
    USER_NOT_SUPER_ADMIN = 'User is not super admin!',
    PROFILE_NOT_VERIFIED = 'Profile is not verified yet. Please wait for admin to verify your profile.',
    PROFILE_REJECTED = 'Your profile has been rejected.',

    // OTP errors
    INVALID_OTP = 'Invalid OTP.',
    OTP_EXPIRED = 'OTP expired. Request a new one',
    REUSE_OTP = 'Unable to request new OTP. Please wait until previous OTP expires.',

    // Password errors
    INVALID_PASSWORD = 'Invalid password.',
    INVALID_OLD_PASSWORD = 'The current password is incorrect. Please verify and try again.',
    INVALID_CURRENT_PASSWORD = 'Invalid current password.',

    // Token errors
    INVALID_TOKEN = 'Unauthorized access: Token not found',
    UNNATHORIZED_USER = 'Unauthorized access: User does not exist',
    UNATHORIZE_ACCESS = 'Unauthorized access',
    UNATHORIZE_ACCESS_TO_CREATE_AFFILIATION = 'Unauthorized access to create affiliation',
    TOKEN_EXPIRED = 'Token expired.',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',

    USER_ALREADY_VERIFIED = 'User already verified',


    AFFILIATION_ALREADY_EXISTS = 'Affiliation already exists',
    AFFILIATION_NOT_FOUND = 'Affiliation not found',
    AFFILIATION_ALREADY_VERIFIED = 'Affiliation already verified',
    AFFILIATION_REQUESTED_AGAIN = 'Affiliation requested again',

    USER_ALREADY_DELETED = 'User already deleted',
    USER_ALREADY_BLOCKED = 'User already blocked',
    USER_IS_INACTIVE = 'User is inactive',
    ACCESS_DENIED = 'Access denied. Please log in with a patient or doctor account.',
}