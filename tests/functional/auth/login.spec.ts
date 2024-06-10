import { UserFactory } from '#database/factories/user_factory'
import { ResponseStatus } from '@adonisjs/core/http'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Auth login', (group) => {
  group.each.setup(async () => testUtils.db().withGlobalTransaction())

  test('should sign up a user', async ({ client, route }) => {
    await UserFactory.merge({ email: "bah@bah.com", password: "password123" }).create()
    const resp = await client.post(route('login')).json({ email: "bah@bah.com", password: "password123" })

    resp.assertStatus(ResponseStatus.Ok)
    resp.assertBodyContains({
      token: {
        type: 'bearer',
        name: null,
        token: String,
        abilities: Array
      },
    })
  })

  test("shoul fail with invalid credentials", async ({ client, route }) => {
    await UserFactory.merge({ email: "bah@bah.com", password: "password123" }).create()
    const resp = await client.post(route("login")).json({ email: "bah@diallo.com", password: "password123" })
    resp.assertStatus(ResponseStatus.BadRequest)
    resp.assertBodyContains({ errors: [{ message: 'Invalid user credentials' }] })

  })

})
