// Modules
const CleanCSS = require('clean-css');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const { minify } = require('html-minifier-terser');
const path = require('path');
const sharp = require('sharp');
const Terser = require('terser');

// Database setup/config
const config = require('./config.js');
const Database = require('./database');
const fs = require('node:fs');

// Routes
const loginRouter = require('./routes/login');
const productRequirementRouter = require('./routes/product_requirements');
const inventoryRouter = require('./routes/inventory');
const userInfoRouter = require('./routes/user_info');
const ingredientRouter = require('./routes/ingredients');

// App
const app = express();
const port = process.env.PORT || 3000;
app.use(helmet());  // For security policy
app.use(cors());    // For Cross-Origin Resource Sharing
app.use(compression());     // For bandwidth saving on the more intensive actions

const minified_css = new CleanCSS({
    properties: {
        shorterLengthUnits: true
    }
})

// Development only
// Run this to create the tables in the database
if (process.env.NODE_ENV.trim() === 'development') {
    const database = new Database(config);
    fs.readFile('./dbschema.sql', 'utf-8', (err, data) => {
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
                        "INSERT INTO tblEmailTypes (EmailTypeID, EmailTypeDescription, Active) VALUES " +
                        "('personal', 'Personal Email', 1), " +
                        "('work', 'Work Email', 1), " +
                        "('other', 'Other Email', 1)"
                    ).then(() => {});
                    // Insert some phone types
                    database.executeQuery(
                        "INSERT INTO tblPhoneTypes (PhoneTypeID, PhoneTypeDescription, Active) VALUES " +
                        "('mobile', 'Mobile Phone', 1), " +
                        "('home', 'Home Phone', 1), " +
                        "('work', 'Work Phone', 1), " +
                        "('fax', 'Fax', 1)"
                    ).then(() => {});

                    // Insert some user roles
                    database.executeQuery(
                        "INSERT INTO tblUserRoles (RoleID, RoleName, RoleDescription) VALUES " +
                        `('0', 'owner', 'All possible permission, but there should only really be one of these'), ` +
                        `('1', 'admin', 'All possible permission'), ` +
                        `('2', 'manager', 'Manages others. Also able to create, modify, update, and delete recipes.'), ` +
                        `('3', 'employee', 'Roller of the Scones. Able to get from most APIs and create, update, and delete from those which pertain to themselves.')`
                    ).then(() => {});

                    console.log('Tables created');
                })
                .catch((err) => {
                    // Table may already exist
                    if (err.message.match(/There is already an object named '\w+' in the database./)) {
                        console.log("Tables exist already. If this is not intended, you may wish to drop all tables.")
                    }
                    else if (err.message.endsWith("See previous errors.")) {
                        console.error(`Error creating table: ${err}`);
                        if (err["precedingErrors"]) {
                            err["precedingErrors"].forEach((precedingError) => {
                                console.error(precedingError.message);
                            })
                        }
                    }
                    else
                    {
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

// Production only.
// Don't optimize asset serving for dev environment
if (process.env.NODE_ENV.trim() !== 'development') {

    // Optimized asset serving
    const cacheDir = path.join(__dirname, 'cache');
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, {recursive: true});
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
                fs.mkdirSync(cachedImageDir, {recursive: true});
            }

            // Check if the optimized image already exists in the cache
            fs.access(cachedImagePath, fs.constants.F_OK, (err) => {
                if (!err) {
                    // Serve cached optimized image
                    return res.sendFile(cachedImagePath, {headers: {"Content-Type": "image/webp"}});
                }

                // If not cached, check if the original image exists
                fs.access(originalImagePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        return next(); // If the image doesn't exist, move to next middleware
                    }

                    // Optimize the image and save it to the cache
                    const transformer = sharp(originalImagePath).webp({
                        quality: 80
                    });

                    transformer.toFile(cachedImagePath, (err, info) => {
                        if (err) {
                            return next(err); // Error handling
                        }
                        // console.log(info);

                        // Serve the newly cached optimized image
                        res.sendFile(cachedImagePath, {headers: {"Content-Type": "image/webp"}});
                    });
                });
            });
        }
        else {
            next(); // If not an image, move to next middleware
        }
    };

    // Optimized HTML asset serving
    const optimize_html_css_js = (req, res, next) => {
        const ext = path.extname(req.url).toLowerCase();

        if (ext === '.html' || req.url.endsWith("/")) {
            const original_html_path = path.join(__dirname, '../BakerySite', req.url.endsWith("/") ? req.url + "index.html" : req.url);
            const cached_html_path = path.join(cacheDir, req.url.endsWith("/") ? req.url + "index.html" : req.url); // Cache path mirrors original

            // Ensure the directory structure for the cache exists
            const cached_html_dir = path.dirname(cached_html_path);
            if (!fs.existsSync(cached_html_dir)) {
                fs.mkdirSync(cached_html_dir, {recursive: true});
            }

            // Check if the optimized html already exists in cache
            fs.access(cached_html_path, fs.constants.F_OK, (err) => {
                if (!err) {
                    // Serve cached optimized HTML
                    return res.sendFile(cached_html_path, {headers: {"Content-Type": "text/html; charset=UTF-8"}});
                }

                // If not cached, check if the original HTML exists
                fs.access(original_html_path, fs.constants.F_OK, async (err) => {
                    if (err) {
                        return next(); // If the HTML doesn't exist, move to next middleware
                    }

                    let original_html_data = fs.readFileSync(original_html_path, 'utf-8');

                    // console.log(original_html_data)

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
                    return res.sendFile(cached_html_path, {headers: {"Content-Type": "text/html; charset=UTF-8"}});
                });
            });
        }
        else if (ext === ".js" && !req.url.includes("min")) {
            const original_js_path = path.join(__dirname, '../BakerySite', req.url);
            const cached_js_path = path.join(cacheDir, req.url); // Cache path mirrors original

            // Ensure the directory structure for the cache exists
            const cached_js_dir = path.dirname(cached_js_path);
            if (!fs.existsSync(cached_js_dir)) {
                fs.mkdirSync(cached_js_dir, {recursive: true});
            }

            // Check if the optimized JS already exists in cache
            fs.access(cached_js_path, fs.constants.F_OK, (err) => {
                if (!err) {
                    // Serve cached optimized JS
                    return res.sendFile(cached_js_path, {headers: {"Content-Type": "application/javascript; charset=UTF-8"}});
                }

                // If not cached, check if the original JS exists
                fs.access(original_js_path, fs.constants.F_OK, async (err) => {
                    if (err) {
                        return next(); // If the JS doesn't exist, move to next middleware
                    }

                    let original_js_data = fs.readFileSync(original_js_path, 'utf-8');

                    // console.log(original_js_data);

                    let optimized_js = await Terser.minify(original_js_data);

                    if (optimized_js.error) return next(optimized_js.error);

                    fs.writeFileSync(cached_js_path, optimized_js.code, 'utf-8');
                    return res.sendFile(cached_js_path, {headers: {"Content-Type": "application/javascript; charset=UTF-8"}});
                });
            });
        }
        else if (ext === ".css" && !req.url.includes("min")) {
            const original_css_path = path.join(__dirname, '../BakerySite', req.url);
            const cached_css_path = path.join(cacheDir, req.url); // Cache path mirrors original

            // Ensure the directory structure for the cache exists
            const cached_css_dir = path.dirname(cached_css_path);
            if (!fs.existsSync(cached_css_dir)) {
                fs.mkdirSync(cached_css_dir, {recursive: true});
            }

            // Check if the optimized CSS already exists in cache
            fs.access(cached_css_path, fs.constants.F_OK, (err) => {
                if (!err) {
                    // Serve cached optimized image
                    return res.sendFile(cached_css_path, {headers: {"Content-Type": "text/css; charset=UTF-8"}});
                }

                // If not cached, check if the original CSS exists
                fs.access(original_css_path, fs.constants.F_OK, async (err) => {
                    if (err) {
                        return next(); // If the CSS doesn't exist, move to next middleware
                    }

                    let original_css_data = fs.readFileSync(original_css_path, 'utf-8');

                    // console.log(original_css_data);

                    let optimized_css = await minified_css.minify(original_css_data)

                    if (optimized_css.errors.length) return next(optimized_css.errors[0]);

                    fs.writeFileSync(cached_css_path, optimized_css.styles, 'utf-8');
                    return res.sendFile(cached_css_path, {headers: {"Content-Type": "text/css; charset=UTF-8"}});
                });
            });
        }
        else {
            next();
        }
    };

    app.use(optimize_images);
    app.use(optimize_html_css_js);

    // For bandwidth saving on the more intensive actions
    app.use(compression());

}

// Routes usage
app.use('/api',
    loginRouter,
    productRequirementRouter,
    inventoryRouter,
    userInfoRouter,
    ingredientRouter
);

// Serve the static frontend
if (process.env.NODE_ENV.trim() !== 'development') {
    app.use('/', express.static('../BakerySite'));
}
else {
    app.use('/', express.static('../BakerySite', {
        etag: false,
        maxAge: 0
    }));
}

// Docker healthcheck
app.get('/health', (req, res) => {
    res.status(200).send("Healthy: OK");
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = app;