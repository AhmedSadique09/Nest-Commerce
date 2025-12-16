export enum EResponseMessages {
    // User messages
    USER_CREATED = 'Registeration successful',
    USER_LOGIN = 'User login successfully',
    SUPER_ADMIN_LOGIN = 'Super admin login successfully',
    USER_VERIFIED = 'User verified successfully!',
    USER_PROFILE_VERIFIED = 'User profile verified successfully!',
    USER_PROFILE_REJECTED = 'User profile rejected successfully!',
    // Password messages
    PASSWORD_UPDATED = 'Password updated successfully',
    PASSWORD_RESET_EMAIL = 'Password reset email sent.',

    // OTP messages
    OTP_VERIFIED = 'OTP verified successfully',
    OTP_RESEND = 'OTP resent successfully. Please check your inbox.',
}
