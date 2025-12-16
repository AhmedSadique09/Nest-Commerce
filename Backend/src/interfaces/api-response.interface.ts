export interface IApiResponse<T = any> {
    statusCode: number;
    message: string;
    payload: T;
}

export interface IUserPayload {
    _id: string;
    username: string;
    email: string;
    roles: string[];
    profilePicture?: string;
}

export interface ILoginPayload {
    user: IUserPayload;
    token: string;
}
