import { Router } from 'express';
import { 
    getSubscriptions, 
    getSubscription, 
    createSubscription,
    updateSubscription,
    deleteSubscription, 
    getUserSubscriptions,
    cancelSubscription,
    getUpcomingRenewals,
} from '../controllers/subscription.controller.js';
import authorize from '../middlewares/auth.middleware.js'

const subscriptionRouter = Router();

subscriptionRouter.get('/', getSubscriptions);

subscriptionRouter.get('/:id', getSubscription);

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', updateSubscription);

subscriptionRouter.delete('/:id', deleteSubscription);

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);

subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);

export default subscriptionRouter;