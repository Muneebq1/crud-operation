import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express()
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

let products = []; // TODO: connect with mongodb instead

app.post('/product', (req, res) => {

    const body = req.body;
    if ( // validation
        !body.name || !body.price || !body.description
    ) {
        return res.status(400).send({
            message: "required parameters missing",
        });
    }

    console.log(body.name, body.price, body.description)

    products.push({
        id: `${new Date().getTime()}`,
        name: body.name,
        price: body.price,
        description: body.description
    });

    return res.status(200).send({
        message: "product added successfully"
    });
})

app.get('/products', (req, res) => {
    res.status(200).send({
        message: "got all products successfully",
        data: products
    })
})

app.get('/product/:id', (req, res) => {

    const id = req.params.id;

    let isFound = false;
    for (let i = 0; i < products.length; i++) {

        if (products[i].id === id) {
            isFound = true

            return res.status(200).send({
                message: `get product by id: ${products[i].id} success`,
                data: products[i]
            });
        }
    }
    if (isFound === false) {
        res.status(404).send({
            message: "product not found"
        });
    }
    return;
})

app.delete('/product/:id', (req, res) => {
    const id = req.params.id;

    let isFound = false;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            isFound = true
            products.splice(i, 1);
            return res.status(200).send({
                message: "product deleted successfully"
            });
        }
    }
    if (isFound === false) {
        res.status(404).send({
            message: "delete fail: product not found"
        });
    }
})

app.put('/product/:id', (req, res) => {

    const body = req.body;
    const id = req.params.id;

    if ( // validation
        !body.name || !body.price || !body.description
    ) {
        return res.status(400).send({
            message: "required parameters missing"
        });

    }

    let isFound = false;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            isFound = true
            products[i].name = body.name;
            products[i].price = body.price;
            products[i].description = body.description;

            return res.status(200).send({
                message: "product modified successfully"
            });
        }
    }
    if (!isFound) {
        return res.status(404).send({
            message: "edit fail: product not found"
        });
    }
    return res.status(200).send({
        message: "product added successfully"
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})