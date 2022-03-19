const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const authRouter = require('./routes/admin/auth')
const adminProductsRouter = require('./routes/admin/products')
const productsRouter = require('./routes/products')
const cartsRouter = require('./routes/carts')

const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
// keys of the cookie-session library is used to encrypt the cookie info
app.use(cookieSession({
  keys: ['cxnvm3l3k1yj62p2']
}))
app.use(authRouter)
app.use(adminProductsRouter)
app.use(productsRouter)
app.use(cartsRouter)

// app listening for incoming req's on a port on the machine, not browser
app.listen(3000, () => {
  console.log('Listening')
})