const express = require('express')
const cartsRepo = require('../repositories/carts')
const productsRepo = require('../repositories/products')
const cartShowTemplace = require('../views/carts/show')

const router = express.Router()

// Receive POST request to add items to the cart
router.post('/cart/products', async (req, res) => {
  // Figure out the cart
  let cart
  if(!req.session.cartId) {
    // No cart, need to create one
    // and store the cart ID into cookie
    cart = await cartsRepo.create({ items: [] })
    req.session.cartId = cart.id

  } else {
    cart = await cartsRepo.getOne(req.session.cartId)
  }

  // Either increment quantity for existing product
  // Or add new products to items array
  const existingItem = cart.items.find(item => item.id === req.body.productId)

  if(existingItem) {
    existingItem.quantity ++
  } else {
    cart.items.push({ id: req.body.productId, quantity: 1 })
  }
  await cartsRepo.update(cart.id, {
    items: cart.items
  })

  res.redirect('/cart')
})

// Receive GET request to show all items
router.get('/cart', async (req, res) => {
  if(!req.session.cartId) {
    return res.redirect('/')
  }

  const cart = await cartsRepo.getOne(req.session.cartId)

  for(let item of cart.items) {
    const product = await productsRepo.getOne(item.id)

    item.product = product
  }
  res.send(cartShowTemplace({ items: cart.items }))
})

// Receive POST request to delete
router.post('/cart/products/delete', async (req, res) => {
  const { itemId } = req.body
  const cart = await cartsRepo.getOne(req.session.cartId)
  
  // const items = cart.items.filter(item => item.id !== itemId)

  // const items = cart.items
  // for(let item of items) {
  //   if(item.id === itemId && item.quantity > 0) {
  //     item.quantity --
  //   } 
  //   if(item.id === itemId && item.quantity === 0) {
  //     items.filter(item => item.id !== itemId)
  //   }
  // }

  const item = cart.items.find((item) => item.id === itemId)
  if(item.quantity > 1) {
    item.quantity --
  } else {
    let productIndex = cart.items.indexOf(item)
    cart.items.splice(productIndex, 1)
  }

  
  await cartsRepo.update(req.session.cartId, { items: cart.items })

  res.redirect('/cart')
})

module.exports = router