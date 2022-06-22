import express from "express";

export default () => {
    const router = express.Router();

    router.post('/register', //here handle register
    )
 
    router.post('/login', //here handle authentication
    )

    return router;
}

