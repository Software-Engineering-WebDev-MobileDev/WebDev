// Modules
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const path = require('path');

// Routes
const loginRouter = require('./routes/login')
const productRequirementRouter = require('./routes/product_requirements')

// App
const app = express();
const port = process.env.PORT || 3000;
app.use(helmet());  // For security policy
app.use(cors());    // For Cross-Origin Resource Sharing
app.use(compression());     // For bandwidth saving on the more intensive actions

// Express setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes usage
app.use('/api',
    loginRouter,
    productRequirementRouter
);

app.get('/health', (req, res) => {
    res.status(200).send("Healthy: OK");
})

app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
});

module.exports = app;