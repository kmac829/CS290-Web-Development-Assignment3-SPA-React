import * as users from './users_model.mjs';
import express from 'express';
const app = express();
const PORT = 3000;

let count = 0
let zero = 0
let one = 0

//Middleware function to keep track of statistics
app.use("/retrieve", (req, res, next) => {
    count++
    switch (Object.keys(req.query).length){
        case 0:
            zero++
            break
        case 1:
            one++
            break
    }
    if (count % 10 === 0){
        console.log(`Total retrieve requests: ${count}`)
        console.log(`Retrieve requests with 0 query parameters: ${zero}`)
        console.log(`Retrieve requests with 1 query parameter: ${one}`)
    }
    next()
})
/**
 * Create a new user with the name, age, email and phone number provided in the query parameters
 */
app.get("/create", (req, res) => {
    console.log(req.query);
    users.createUser(req.query.name, req.query.age, req.query.email, req.query.phoneNumber )
        .then(user => {
            res.send(user);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Not Found' });
        });
});

/**
 * Retrieve users. 
 * Returns users with given query.
 * If no queries entered, all users are returned.
 */
app.get("/retrieve", (req, res) => {
        users.findUsersByFilter(req.query._id, req.query.name, req.query.age, req.query.email, req.query.phoneNumber, '', 0)
        .then(users => {
            res.send(users);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Not Found' });
        });

});

/**
 * Update the user whose _id is provided and set its name, age, email and phone number to
 * the values provided in the query parameters. If paramter is left out, keep original values the same.
 */
app.get("/update", (req, res) => {
    console.log(req.query);
    users.replaceUser(req.query._id, req.query.name, req.query.age, req.query.email, req.query.phoneNumber)
        .then(updateCount => {
            console.log(updateCount);
            res.send({ updateCount: updateCount });
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Not Found' });
        });
});

/**
 * Delete the user whose _id is provided in the query parameters
 */
app.get("/delete", (req, res) => {
    console.log(req.query.id);
    users.deleteByFilter(req.query._id, req.query.name, req.query.age, req.query.email, req.query.phoneNumber)
        .then(deletedCount => {
            console.log(deletedCount);
            res.send({ deletedCount: deletedCount });
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Not Found' });
        });
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});