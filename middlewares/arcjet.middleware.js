import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 1 });

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({
                    success: false,
                    error: 'Too Many Requests' 
                });
            }

            if(decision.reason.isBot()){
                return res.status(403).json({
                    success: false,
                    error: 'Forbidden: Bot detected' 
                });
            }

            return res.status(403).json({
                success: false,
                error: 'Forbidden: Access denied' 
            });
        }

        next();
    } catch (error) {
        console.error('Arcjet Middleware Error:', error);
        next(error);
    }
}

export default arcjetMiddleware;