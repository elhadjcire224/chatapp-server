import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'
import { unique } from './utils.js'

export const registrationValidator = vine.compile(vine.object({
    username: vine.string().trim().escape().minLength(5).maxLength(20).unique(unique('users','username')),
     email: vine.string().email().unique(unique('users','email')),
    password: vine.string().minLength(8).maxLength(100)
}))

export const loginValidator = vine.compile(vine.object({
    email: vine.string().maxLength(254).escape().trim().minLength(6),
    password:vine.string().minLength(6).maxLength(100)
}))


export type UserRegistrationType = Infer<typeof registrationValidator>
export type UserLoginType = Infer<typeof loginValidator>