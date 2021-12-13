const { request, response } = require("express")
const express = require("express")
const uuid = require("uuid")

const port = 3000

const app = express()
app.use(express.json())

/*! Important ! variable responsible for listing orders */
const customerOrders = []

/*Middlewares responsible for verifying real id*/
const checkUserId = (request, response, next) => {
    const { id } = request.params
    const index = customerOrders.findIndex(orderPlaced => orderPlaced.id === id)

    if (index < 0) return response.status(404).json({ message: "User not found" })

    request.orderIndex = index
    request.orderId = id

    next()
}

const method = (request, response, next) => {
    console.log(request.method)
    next()
}

app.get('/orders', method, (request, response) => {
    return response.json(customerOrders)
})

app.post('/orders', method, (request, response) => {
    const { order, clientName, price } = request.body
    const orderPlaced = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    customerOrders.push(orderPlaced)

    return response.status(201).json(customerOrders)
})

app.put('/orders/:id', method, checkUserId, (request, response) => {
    const { order, clientName, price } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const orderUpdate = { id, order, clientName, price, status: "Em preparação" }

    customerOrders[index] = orderUpdate

    return response.json(orderUpdate)
})

app.delete('/orders/:id', method, checkUserId, (request, response) => {
    const id = request.orderId
    const index = request.orderIndex

    customerOrders.splice(index, 1)

    return response.status(204).json(customerOrders)
})

app.get('/exactOrder/:id', method, checkUserId, (request, response) => {
    const id = request.orderId
    const index = request.orderIndex

    const exactOrder = customerOrders[index]

    return response.json(exactOrder)
})

app.patch('/orders/:id', method, checkUserId, (request, response) => {
    const { order, clientName, price } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updateOrderPatch = { id, order, clientName, price, status: "Pedido Finalizado" }
    customerOrders[index] = updateOrderPatch
    console.log(updateOrderPatch)

    return response.json(updateOrderPatch)
})

app.listen(port, () => {
    console.log("🍔 RUN")
})