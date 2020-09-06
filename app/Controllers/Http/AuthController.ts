import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async login ({ request, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const token = await auth.use('api').attempt(email, password)
    return token.toJSON()
  }

  public async register ({ request }: HttpContextContract) {
    // Validate user details
    const validationSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true }, [
        rules.confirmed(),
      ]),
    })

    const userDetails = await request.validate({
      schema: validationSchema,
    })

    // Create a new user
    const user = new User()
    user.email = userDetails.email
    user.password = userDetails.password
    await user.save()

    return {
      message: 'Your account has been created',
    }
  }
}
