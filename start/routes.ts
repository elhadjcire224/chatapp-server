/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController =  () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.group(() => {
  router.post("/register", [AuthController,'register']).as('register')
  router.post("/login",[AuthController,'login']).as('login')
  router.delete('/logout',[AuthController,"logout"]).use(middleware.auth()).as("logout")
}).prefix('auth')


router.get("/me",[AuthController,'me']).as("me").use(middleware.auth())
