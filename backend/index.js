// Modules
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const sharp = require('sharp');
const { minify } = require('html-minifier-terser');

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

// Optimized asset serving
const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)){
    fs.mkdirSync(cacheDir, { recursive: true });
}

// Optimized image asset serving
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

// Optimized HTML asset serving
const optimize_html = (req, res, next) => {
    const ext = path.extname(req.url).toLowerCase();

    if (ext === '.html' || req.url.endsWith("/")) {
        const original_html_path = path.join(__dirname, '../BakerySite', req.url.endsWith("/") ? req.url + "index.html" : req.url);
        const cached_html_path = path.join(cacheDir, req.url.endsWith("/") ? req.url + "index.html" : req.url); // Cache path mirrors original

        // Ensure the directory structure for the cache exists
        const cached_html_dir = path.dirname(cached_html_path);
        if (!fs.existsSync(cached_html_dir)) {
            fs.mkdirSync(cached_html_dir, { recursive: true });
        }

        // Check if the optimized html already exists in cache
        fs.access(cached_html_path, fs.constants.F_OK, (err) => {
            if (!err) {
                // Serve cached optimized image
                return res.sendFile(cached_html_path, {headers: {"Content-Type": "text/html; charset=UTF-8"}});
            }

            // If not cached, check if the original image exists
            fs.access(original_html_path, fs.constants.F_OK, async (err) => {
                if (err) {
                    return next(); // If the HTML doesn't exist, move to next middleware
                }

                let original_html_data = fs.readFileSync(original_html_path, 'utf-8');

                console.log(original_html_data)

                let optimized_html = await minify(
                        original_html_data,
                        {
                            caseSensitive: true,
                            collapseWhitespace: true,
                            conservativeCollapse: true,
                            continueOnParseError: true,
                            minifyCSS: true,
                            minifyJS: true,
                            removeComments: true,
                            removeEmptyElements: true
                        });

                fs.writeFileSync(cached_html_path, optimized_html, 'utf-8');
                res.sendFile(cached_html_path, {headers: {"Content-Type": "text/html; charset=UTF-8"}});
            });
        });
    }
    else {
        next();
    }
};

app.use(optimize_images);
app.use(optimize_html);

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