// Modules
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const sharp = require('sharp');

// Database setup/config
const config = require('./config.js');
const Database = require('./database');
const fs = require('node:fs');

// Routes
const loginRouter = require('./routes/login')
const productRequirementRouter = require('./routes/product_requirements')
const inventoryRouter = require('./routes/inventory')
const userInfoRouter = require('./routes/user_info');

// App
const app = express();
const port = process.env.PORT || 3000;
app.use(helmet());  // For security policy
app.use(cors());    // For Cross-Origin Resource Sharing
app.use(compression());     // For bandwidth saving on the more intensive actions


// Development only
// Run this to create the tables in the database
if (process.env.NODE_ENV.trim() === 'development') {
    const database = new Database(config);
    fs.readFile('./schema.sql', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        else {
            database
                .executeQuery(data)
                .then(() => {
                    // Insert some email types
                    database.executeQuery(
                        "INSERT INTO tblEmailTypes (TypeID, Description, Active) VALUES " +
                        "('personal', 'Personal Email', 1), " +
                        "('work', 'Work Email', 1), " +
                        "('other', 'Other Email', 1)"
                    ).then(() => {});
                    // Insert some phone types
                    database.executeQuery(
                        "INSERT INTO tblPhoneTypes (TypeID, Description, Active) VALUES " +
                        "('mobile', 'Mobile Phone', 1), " +
                        "('home', 'Home Phone', 1), " +
                        "('work', 'Work Phone', 1), " +
                        "('fax', 'Fax', 1)"
                    ).then(() => {});

                    console.log('Tables created');
                })
                .catch((err) => {
                    // Table may already exist
                    if (err.message.match(/There is already an object named '\w+' in the database./)) {
                        console.log("Tables exist already. If this is not intended, you may wish to drop all tables.")
                    }
                    else {
                        console.error(`Error creating table: ${err}`);
                    }
                });
        }
    });
}

// Express setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

// Optimized asset serving
const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)){
    fs.mkdirSync(cacheDir, { recursive: true });
}

const optimize_images = (req, res, next) => {
    const imageFormats = ['.jpg', '.jpeg', '.png', '.webp', '.jfif']; // Supported image formats
    const ext = path.extname(req.url).toLowerCase();

    if (imageFormats.includes(ext)) {
        const originalImagePath = path.join(__dirname, '../BakerySite', req.url);
        const cachedImagePath = path.join(cacheDir, req.url); // Cache path mirrors original

        // Ensure the directory structure for the cache exists
        const cachedImageDir = path.dirname(cachedImagePath);
        if (!fs.existsSync(cachedImageDir)) {
            fs.mkdirSync(cachedImageDir, { recursive: true });
        }

        // Check if the optimized image already exists in cache
        fs.access(cachedImagePath, fs.constants.F_OK, (err) => {
            if (!err) {
                // Serve cached optimized image
                return res.sendFile(cachedImagePath, {headers: {"Content-Type": "image/webp"}});
            }

            // If not cached, check if the original image exists
            fs.access(originalImagePath, fs.constants.F_OK, (err) => {
                if (err) {
                    return next(); // If image doesn't exist, move to next middleware
                }

                // Optimize the image and save it to the cache
                const transformer = sharp(originalImagePath).webp({
                    quality: 80
                });

                transformer.toFile(cachedImagePath, (err, info) => {
                    if (err) {
                        return next(err); // Error handling
                    }

                    // Serve the newly cached optimized image
                    res.sendFile(cachedImagePath, {headers: {"Content-Type": "image/webp"}});
                });
            });
        });
    } else {
        next(); // If not an image, move to next middleware
    }
};

app.use(optimize_images);

// Routes usage
app.use('/api',
    loginRouter,
    productRequirementRouter,
    inventoryRouter,
    userInfoRouter
);

// Serve the static frontend
app.use('/', express.static('../BakerySite'));

// Docker healthcheck
app.get('/health', (req, res) => {
    res.status(200).send("Healthy: OK");
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = app;