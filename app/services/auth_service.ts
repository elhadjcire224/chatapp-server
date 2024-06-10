import User from "#models/user";
import type { UserLoginType, UserRegistrationType } from "#validators/auth_validator";

export default class AuthService {
    async register(data: UserRegistrationType) {
        return await User.create(data)
    }
    async login({ email, password }: UserLoginType) {
        const user = await User.verifyCredentials(email, password)

        return {
            token: await this.generatetonken(user)
        }
    }
    async generatetonken(user: User) {
        return await User.accessTokens.create(user,)
    }

}