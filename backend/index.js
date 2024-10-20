// Modules
const CleanCSS = require('clean-css');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const { minify } = require('html-minifier-terser');
const nunjucks = require('nunjucks');
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
const recipeRouter = require('./routes/recipes');
const taskRouter = require('./routes/tasks');
const recipeIngredientRouter = require('./routes/recipe_ingredients');

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
            console.log("Adding the schema to the database");
            database
                .executeQuery(data)
                .then(async () => {
                    console.log("Adding triggers to the database");
                    // Equivalent to:
                    // `FOREIGN KEY (EmployeeID)
                    // REFERENCES tblUsers (EmployeeID) ON UPDATE CASCADE`
                    await database.executeQuery(
                        "CREATE TRIGGER trg_task_comments_employeeid_update\n" +
                        "    ON tblUsers\n" +
                        "    AFTER UPDATE\n" +
                        "    AS\n" +
                        "BEGIN\n" +
                        "    -- Update EmployeeID in tblTaskComments when it changes in tblUsers\n" +
                        "    UPDATE tblTaskComments\n" +
                        "    SET EmployeeID = inserted.EmployeeID\n" +
                        "    FROM inserted\n" +
                        "             JOIN deleted ON inserted.EmployeeID = deleted.EmployeeID\n" +
                        "    WHERE tblTaskComments.EmployeeID = deleted.EmployeeID;\n" +
                        "END"
                    ).then(() => {});

                    // Equivalent to:
                    // `FOREIGN KEY (AssignedByEmployeeID)
                    // REFERENCES tblUsers (EmployeeID) ON UPDATE CASCADE`
                    await database.executeQuery(
                        "CREATE TRIGGER trg_task_assignment_hist_employeeid_update\n" +
                        "    ON tblUsers\n" +
                        "    AFTER UPDATE\n" +
                        "    AS\n" +
                        "BEGIN\n" +
                        "    -- Update EmployeeID in tblTaskAssignmentHistory when it changes in tblUsers\n" +
                        "    UPDATE tblTaskAssignmentHistory\n" +
                        "    SET AssignedByEmployeeID = inserted.EmployeeID\n" +
                        "    FROM inserted\n" +
                        "             JOIN deleted ON inserted.EmployeeID = deleted.EmployeeID\n" +
                        "    WHERE tblTaskAssignmentHistory.AssignedByEmployeeID = deleted.EmployeeID;\n" +
                        "END"
                    ).then(() => {});

                    // Equivalent to:
                    // `FOREIGN KEY (StatusChangedByEmployeeID)
                    // REFERENCES tblUsers (EmployeeID) ON UPDATE CASCADE`
                    await database.executeQuery(
                        "CREATE TRIGGER trg_task_status_audit_employeeid_update\n" +
                        "    ON tblUsers\n" +
                        "    AFTER UPDATE\n" +
                        "    AS\n" +
                        "BEGIN\n" +
                        "    -- Update StatusChangedByEmployeeID in tblTaskStatusAudit when it changes in tblUsers\n" +
                        "    UPDATE tblTaskStatusAudit\n" +
                        "    SET StatusChangedByEmployeeID = inserted.EmployeeID\n" +
                        "    FROM inserted\n" +
                        "             JOIN deleted ON inserted.EmployeeID = deleted.EmployeeID\n" +
                        "    WHERE tblTaskStatusAudit.StatusChangedByEmployeeID = deleted.EmployeeID;\n" +
                        "END"
                    ).then(() => {});

                    console.log("Adding some types to the database");

                    // Insert some email types
                    database.executeQuery(
                        "INSERT INTO tblEmailTypes (EmailTypeID, EmailTypeDescription, Active) VALUES " +
                        "('personal', 'Personal Email', 1), " +
                        "('work', 'Work Email', 1), " +
                        "('other', 'Other Email', 1), " +
                        "('primary', 'Primary email', 1)"
                    ).then(() => {});
                    // Insert some phone types
                    database.executeQuery(
                        "INSERT INTO tblPhoneTypes (PhoneTypeID, PhoneTypeDescription, Active) VALUES " +
                        "('mobile', 'Mobile Phone', 1), " +
                        "('home', 'Home Phone', 1), " +
                        "('work', 'Work Phone', 1), " +
                        "('fax', 'Fax', 1), " +
                        "('primary', 'Primary phone number', 1)"
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
                        process.exit(1);
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

// Configure nunjucks
nunjucks.configure('../BakerySite', {
    autoescape: true,
    express: app
});
// Make it the view engine
app.set('views', path.join(__dirname, '../BakerySite'));
app.set('view engine', 'html');

// Find all the HTML files
let html_file_list = [];
html_file_list = fs.readdirSync("../BakerySite");
console.log(`HTML files found: ${html_file_list}`);

/*
 * For frontend development!
 * It sets up the relevant renderers outside the compression middleware.
 */
if (process.env.NODE_ENV.trim() === 'development') {
    console.log("Development environment detected. Setting up renderers...");
    html_file_list.forEach((file) => {
        // Setup index rendering for the dev environment
        app.get(`/`, (req, res) => {
            res.render(`../BakerySite/index.html`);
        });
        if (file.endsWith(".html")) {
            console.log(`Setting up renderer for ${file}`);
            // Version with `.html`
            app.get(`/${file}`, (req, res) => {
                console.log(`Rendering ${file}`);
                res.render(`../BakerySite/${file}`);
            });
            // Version without `.html`
            app.get(`/${file.substring(0, file.length - 5)}`, (req, res) => {
                console.log(`Rendering ${file}`);
                res.render(`../BakerySite/${file}`);
            });
        }
    });
}

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
        console.log(req.url)

        if (ext === '.html' || req.url.endsWith("/") || html_file_list.includes(req.url.substring(1) + ".html") || html_file_list.includes(req.url.substring(1, req.url.indexOf('?')) + ".html") || html_file_list.includes(req.url.substring(1, req.url.indexOf('?')))) {
            let original_html_path,
                cached_html_path;
            if (req.url.indexOf('?') > -1) {
                original_html_path = path.join(__dirname, '../BakerySite', req.url.substring(1, req.url.indexOf('?')));
                cached_html_path = path.join(cacheDir, req.url.substring(1, req.url.indexOf('?'))); // Cache path mirrors original
                console.log(`HTML files found: ${original_html_path}`);
            }
            else {
                original_html_path = path.join(__dirname, '../BakerySite', req.url.endsWith("/") ? req.url + "index.html" : req.url);
                cached_html_path = path.join(cacheDir, req.url.endsWith("/") ? req.url + "index.html" : req.url); // Cache path mirrors original
            }
            // Account for requests not having `.html` at the end, but are for HTML files
            if (!original_html_path.endsWith(".html")) {
                original_html_path += ".html";
            }
            // Account for requests not having `.html` at the end, but are for HTML files
            if (!cached_html_path.endsWith(".html")) {
                cached_html_path += ".html";
            }

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

                    // Render the HTML
                    let original_html_data = nunjucks.render(original_html_path);

                    // console.log(original_html_data)

                    // Minify the HTML data
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
                            removeEmptyElements: false
                        });

                    // Write the data to the cache directory
                    fs.writeFileSync(cached_html_path, optimized_html, 'utf-8');

                    // Send the file with the appropriate headers
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

                    // Read the originaal JS data
                    let original_js_data = fs.readFileSync(original_js_path, 'utf-8');

                    // console.log(original_js_data);

                    // Optimize it...
                    let optimized_js = await Terser.minify(original_js_data);

                    // If there was an error, do error things.
                    if (optimized_js.error) return next(optimized_js.error);

                    // Save the minified version
                    fs.writeFileSync(cached_js_path, optimized_js.code, 'utf-8');
                    // Send the file on to the user
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

                    // Read the original CSS data
                    let original_css_data = fs.readFileSync(original_css_path, 'utf-8');

                    // console.log(original_css_data);

                    // Optimize it
                    let optimized_css = await minified_css.minify(original_css_data)

                    // Do error things
                    if (optimized_css.errors.length) return next(optimized_css.errors[0]);

                    // Write the optimized version to the cache
                    fs.writeFileSync(cached_css_path, optimized_css.styles, 'utf-8');
                    // Send the optimized file to the user
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
    ingredientRouter,
    recipeRouter,
    taskRouter,
    recipeIngredientRouter
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
    if (process.platform === 'win32') {
        console.log(`At http://localhost:${port}`);
    }
    else {
        console.log(`At http://0.0.0.0:${port}`);
    }
});

module.exports = app;