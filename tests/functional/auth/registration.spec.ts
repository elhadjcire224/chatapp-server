import { UserFactory } from '#database/factories/user_factory'
import { ResponseStatus } from '@adonisjs/core/http'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Auth registration', (group) => {

  group.each.setup(async () => testUtils.db().withGlobalTransaction())

  test('should fail to sign up a user when username is in use', async ({client,route}) => {
    await UserFactory.merge({username:"bahelhadj"}).create()
    const resp = await client.post(route('register')).json({username:'bahelhadj',email: "bah@bah.com", password: "password123" })
    resp.assertStatus(ResponseStatus.UnprocessableEntity)

  })

  test('post auth/register with valid data', async ({ client, route }) => {
    const data = { email: "bah@bah.com", password: "615551421", username: "bahelhadjcire" }

    const resp = await client.post(route('register')).json(data)

    resp.assertStatus(ResponseStatus.Created)
    
    resp.assertBodyContains({
      type: 'bearer',
      name: null,
      abilities: ['*'],
      lastUsedAt: null,
      expiresAt: null
    })
  })

  test('post auth/register with missing email', async ({ client, route }) => {
    const data = { password: "615551421", username: "bahelhadjcire" }

    const resp = await client.post(route('register')).json(data)

    resp.assertStatus(ResponseStatus.UnprocessableEntity)
    // console.log(resp.dumpError())
  })

  test('post auth/register with missing password', async ({ client, route }) => {
    const data = { email: "bah@bah.com", username: "bahelhadjcire" }

    const resp = await client.post(route('register')).json(data)

    resp.assertStatus(ResponseStatus.UnprocessableEntity)
  })

  test('post auth/register with short username', async ({ client, route }) => {
    const data = { email: "bah@bah.com", password: "615551421", username: "bah" }

    const resp = await client.post(route('register')).json(data)

    resp.assertStatus(ResponseStatus.UnprocessableEntity)
  })

  test('post auth/register with invalid email', async ({ client, route }) => {
    const data = { email: "invalid-email", password: "615551421", username: "bahelhadjcire" }

    const resp = await client.post(route('register')).json(data)

    resp.assertStatus(ResponseStatus.UnprocessableEntity)
  })
  
  test('post auth/register with duplicated email', async ({ client, route }) => {
    const data = { email: "bah@bah.com", password: "615551421", username: "bahelhadjcire" }

    await client.post(route('register')).json(data)

    const resp = await client.post(route('register')).json(data)

    resp.assertStatus(ResponseStatus.UnprocessableEntity)
    resp.assertBodyContains({
      errors: [
        {
          message: 'The email has already been taken',
          rule: 'database.unique',
          field: 'email'
        }
      ]
    })
  })

  test('post auth/register with short password', async ({ client, route }) => {
    const data = { email: "bah@bah.com", password: "123", username: "bahelhadjcire" }

    const resp = await client.post(route('register')).json(data)

    resp.assertStatus(ResponseStatus.UnprocessableEntity)
  })
})
