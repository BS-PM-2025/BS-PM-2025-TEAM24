const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const { authRouter } = require("./routers/authRouter");
const { infoLogger, errorLogger } = require("./logs/logs");
const { eventsRouter } = require("./routers/eventsRouter");
const { usersRouter } = require("./routers/usersRouter");
const authJwt = require('./middlewares/authJwt');



app.use((req, res, next) => {
    console.log(req.method);
    next();
})

const corsConfig = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
    
}
app.use(corsConfig);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


app.use('/api/auth', authRouter);
app.use(authJwt.verifyToken);
app.use('/api/users', usersRouter);
app.use('/api/events', eventsRouter);
app.use((req, res) => {
    errorLogger.error(`Bad Method Request!:${req.method} ${req.url}`);
    res.status(404).json({ "message": "Bad Method Request!" });
});
app.listen(port, () => {
    infoLogger.info(`Express server is running on port ${port}`);
});