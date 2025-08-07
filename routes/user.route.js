import { Router } from 'express';
import { deleteUser, getUser, getUsers, updateUser } from '../controllers/user.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:id', authorize, getUser);

userRouter.post('/', (req, res) => res.send({ title: 'CREATE new user' }));

userRouter.put('/:id', updateUser);

userRouter.delete('/:id', deleteUser);

export default userRouter;