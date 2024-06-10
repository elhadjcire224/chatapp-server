import { UserFactory } from '#database/factories/user_factory'
import { ResponseStatus } from '@adonisjs/core/http'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Auth logout', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())
  test('user shoul logout', async ({ client,route }) => {
    const {email} = await UserFactory.merge({password:"password123"}).create()
    console.log(email)
    const response_login = await client.post(route('login')).json({email,password:"password123"})
    const token = response_login.body().token.token
    const resp = await client.delete(route('logout')).bearerToken(token)
    resp.assertStatus(ResponseStatus.NoContent)
  })

  test('user should not logout with been authenticated', async ({client,route}) => {
    const resp = await client.delete(route('logout'))
     resp.assertStatus(ResponseStatus.Unauthorized)
  })
})