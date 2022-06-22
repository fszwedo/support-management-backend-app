import express from "express";

export default () => {
    const router = express.Router();

    router.get('/', //here get all users
    )

    router.get('/me', //here get current user data
    )
 
    router.post('/', //here handle user creation (similar to register)
    )

    router.put('/:id', //here handle user adjustment
    )


    return router;
}

