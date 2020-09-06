import Account from 'App/Models/Account'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AccountsController {
  public async create ({ request, auth }: HttpContextContract) {
    const validationSchema = schema.create({
      name: schema.string({ trim: true }),
      username: schema.string({ trim: true }, [
        rules.unique({ table: 'accounts', column: 'username' }),
      ]),
      password: schema.string({ trim: true }),
    })

    const accountDetails = await request.validate({
      schema: validationSchema,
    })

    const account = new Account()
    account.name = accountDetails.name
    account.username = accountDetails.username
    account.password = accountDetails.password

    const user = auth.user

    try {
      if(user) {
        await account.related('user').associate(user)
      }
    } catch (e) {
      return {
        error: 'Something went wrong. Unknown user.',
      }
    }

    return {
      message: 'Linked account to user.',
    }
  }
  public async get ({ auth }: HttpContextContract) {
    const user = auth.user
    if (user) {
      await user.preload('account')
      return user.account
    }
    return user
  }
}
