import User from '#models/user'
import AuthService from '#services/auth_service'
import UserService from '#services/user_service'
import { loginValidator, registrationValidator } from '#validators/auth_validator'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class AuthController {
    constructor(protected authService: AuthService,protected userService: UserService){}
    async register({ request, response }: HttpContext) {

        const data = await request.validateUsing(registrationValidator)

        const user = await this.authService.register(data)
        
        return response.created(await this.authService.generatetonken(user))
    }
    

    async login({ request, response }: HttpContext) {
        const data = await request.validateUsing(loginValidator)
        return response.ok(await this.authService.login(data))
    }

    async me({ auth, response }: HttpContext) {
        const user = auth.user! as User
        const tokens = await User.accessTokens.all(user)
        return response.ok({ user, tokens })
    }

    async logout({ response, auth }: HttpContext) {
        const user = auth.user!

        await User.accessTokens.delete(user, user.currentAccessToken.identifier)
        return response.noContent()
    }

    async delete({ auth, response }: HttpContext) {
        const user = auth.user!
        const tokens = await User.accessTokens.all(user)
        Promise.race(tokens.map((v) => new Promise((resolve) => {
            resolve(User.accessTokens.delete(user, v.identifier))
        })))

        return response.noContent()
    }
}