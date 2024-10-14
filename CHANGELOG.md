# Changelog

All notable changes to this project will be documented in this file.

This format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## TO-DO
- ~~Make it so that entering the wrong user or password informs the user of this problem~~
- ~~Use a more secure way of changing pages, as well as using the return and homepage functionality~~
- Implement the email in use checker
- Make an error for an already in-use employee ID
- Make a "main" email and phone number as well as additional ones you can add in account
- Employee ID needs requirements
- ~~Fix the Employee ID registration appearance, it's too close to the left~~
- Make a confirmation option for the clear button so people don't accidentally hit it, possibly make it smaller
- Integrate templating into the tasks endpoint

## Backend
- ~~Inventory Routes~~
- ~~Deployment~~

## [Unreleased]

## 2024-10-14

### Added
- Logout when hovered turns red and turns the text white
- All taskbar options now have a hovering feature similar to standard buttons

### Fixed
- Resolved massive Merge conflict
- .val issue in account creation that fixes the inability to create an account
- Errors not showing on login page


## 2024-10-13

### Changed
- Changed logout functionality to new cleaner way to perform it

## 2024-10-11

### Added
- Tasks page content
  - Task overview page
  - Individual task details
  - Task adding
  - Task updates
  - Task completion button
  - Practically all client-side rendered
- Added input validation to task routes
- Added session id requirement to task routes

### Changed
- Made task routes return needed data
- Possibly broke things by making task routes require more data. 

### Fixed
- Made recipe routes generate the UUID correctly so that task routes' validation allows recipe ids that are in the database.

## 2024-10-10

### Added
- Create Templates using Nunjucks
- Templatize account, index, ingredient_view, ingredient, recipe, task pages
- Created base.html and base_form.html to hold templates
- Username and Password return an error now if incorrect on the login page
 
### Changed
- Fixed style of errors on login to match the rest of the site
### Broken
- Known bug: hamburger menu only displays on index.html

## [0.2.1] - 2024-10-10

### Changed
- Dashboard has been changed to an Error page as it was not needed
- Hamburger Button doesn't appear until logged in
- The Ingredients page is now called "Inventory" within the site itself

### Fixed
- Employee ID now properly is aligned on the registration page

### Removed
- About Page
- About Button Functionality

## 2024-10-09

### Added
- New code added to indicate what page the user is on
- Refreshing now keeps you on the page you are supposed to be

### Changed
- Switched all instances of sessionStorage to localStorage
- Commented out checkEmail until it works
- Switched all instances of previous sessionID to session_id to work with new backend
- Phone Regex is more lax, now able to only be 10 digits instead of just the strict requirements before

### Fixed
- Multiple lines of code in main.js that had no purpose (like validatePassword which doesn't exist)

## 2024-10-08

### Added
- Added purchase order routes, tests, and documentation
- Added primary phone and email types to the API
- Added user profile endpoint for full user information
- Added an overview of the repository to [README.md](./README.md)
- Added user role change endpoint
- Added better error logging to [login.js](./backend/routes/login.js)
### Changed
- Updated email and phone number option during account creation in the API

---

## [0.2.0] - 2024-10-03

### Changed
- Username or Email is now just Username on the login page
- Register and Return buttons are now javascript based instead of hrefs
- About page return button modified the same way as the previous two

### Fixed
- TypeError related to non-existent addEventListener on txtLoginEmail
- CSP Violations

### Removed
- Unnecessary ajax command from session deletion function

## 2024-10-02

### Added
- Added `nunjucks` for template rendering.
  - Use `nunjucks` as the view engine
  - Set up paths to render templates with and without `.html` in the path, along with doing so in the delivery optimization middleware

### Changed
- FINALLY connected our backend to frontend
- Both Register and Login functionality works with the backend

### Fixed
- Website vulnerabilities related to inline event handlers, moved from HTML to JS

## 2024-10-01

### Added
- Password requirements to actual register functionality, now needs 8 characters, one number, and one special character to get in
- Email Validation
- Skeletal functionality for checking if email is already in use
- Error message styling
- Inventory routes to:
  - Get inventory
  - Get inventory item
  - Add inventory item
  - Update inventory item
  - Delete inventory item
  - Update inventory item
  - Update inventory quantity
  - Get inventory change history
  - Delete an inventory change
  - Get inventory amounts

### Changed
- ~~Turned the long if statement wall in buttons.js into a forEach conditional loop, condensing the code and cleaning it up~~
- Completely converted the swal-based registration validation to inline validation
- Password Requirements now update the moment you meet them, rather than one input after
- Old backend posts to new backend

### Broken
- ~~Currently login and registration throw a 400 error, so creating a user or logging in is impossible.~~

## 2024-09-19

### Added
- Parameters to comments in functions.js
- Created CapsLock check function for the register page as well (Still broken atm)
- Created Password Requirements function to automatically tell the user when their password needs certain additions

### Removed
- Remaining unneccessary images

### Changed
- Moved Unreleased to its actual intended position, as somewhere to store all the code before a pushed version

## [0.1.2] - 2024-09-27

### Changed
- Update SQL schema to hopefully fulfil all MVP requirements
- Updated API endpoints to reflect the new schema
- Updated [documentation](./backend/DOCUMENTATION.md) to reflect the new parameters and output of the schema
- Updated [documentation](./backend/DOCUMENTATION.md) to reflect the new setup for frontend development

## [0.1.1] - 2024-09-19

### Added
- Numerous new html pages
- Links to these new pages through the hamburger dropdown
- Hard coded ingredient html page
- Added css style to cooperate with ingredient page
- Display for the ingredients
- Icon and background color styles
- New source for icons

## [0.1.0] - 2024-09-18

### Added
- Multiple text colors, and a number of styling options for buttons
- Temporary text to the Dashboard due to it not being ready yet
- Clicking on the logo/site name takes you back to the homepage

### Removed
- Previous Dashboard look

### Changed
- "Login" into "Sign in"
- All colors to match the thematics of the website
- Transparency to the Sign in and Register pages
- The name of the site to "Rolling Scones" instead of "Bakery Site"
- Commented out a large amount of currently unused code in index.html

## [0.0.9] - 2024-09-18

### Added
- style.css (Implementation to come later)
- jsource folder (to keep our code and code we draw from separate)
- Added chart, dataTables, jquery, jsbootstrap, and sweetalert to jsource
- functions.js to hold general functions
- functions.js to src reference 

### Removed
- Unnecessary registration information from register form
- All APIs from api.js 
- dateTimeZip function
- References to deprecated registration information
- DivEnvironment and all references
- dateTime.js, due to moving all its contents to functions.js
- emailstorage.js, due to moving all its contents to functions.js
- api.js, due to deleting all its contents

### Changed
- Contents previously in dateTime.js are now in functions.js
- Contents previously in emailstorage.js are now in functions.js
- Reordered js src to have the source files above our working code

### Fixed
- Website functionality break
- Hamburger button icon break
- Issue where the email was not storing upon logging out
- Issue where refreshing the page would cause you to log out automatically

## [0.0.8] - 2024-09-16

### Added
- New function for saving email in the login window between sessions
- Split the javascript code into numerous separate files
- Referencing to the javascript code in the html

### Changed
- Converted all css links into actual files within /css 
- Converted all js links into actual files within /js


## [0.0.7] - 2024-09-07

### Added
- Comments indicating not currently useful but later potentially useful functions
- Added comments starting with !!! to easily return to potentially useful functions

### Removed
- Code framework for audio playing
- Various deprecated and commented out blocks of code
- All audio files

## [0.0.6] - 2024-09-03

### Added

- Bread Icon Picture
- Bread Background Picture (Temporary)

### Removed
- Old Icon Image
- Old Background Picture

## [0.0.5] - 2024-08-28

### Added

- Partial backend skeleton
- Dockerized the project
- Serve the (currently static) frontend with a route in Express.js
- General preparation for CI/CD setup

## [0.0.4] - 2024-08-28

### Changed
- All instances of the word "SmartCoop" in use as text with BakerySite
- Commented out deprecated About page

### Removed
- Google Maps API Key, due to the project being public
- OpenWeather API key, due to the project being public

## [0.0.3] - 2024-08-28

- (Apologies if I don't have this properly understood stylistically - Gage)
### Added

- SmartCoop folder as a basis for the website's code structure

### Changed

- Wrong folder of SmartCoop originally uploaded, proper one now in place
- SmartCoop folder name into BakerySite as a temporary name and to theme this project properly

### Removed

- README.md from the BakerySite (previously SmartCoop) folder due to it being deprecated

## [0.0.2] - 2024-08-28

### Added

- Added Changelog

## [0.0.1] - 2024-08-28

### Added

- Initial Commit

[0.2.0]: https://github.com/Software-Engineering-WebDev-MobileDev/WebDev/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/Software-Engineering-WebDev-MobileDev/WebDev/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Software-Engineering-WebDev-MobileDev/WebDev/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Software-Engineering-WebDev-MobileDev/WebDev/compare/v0.0.9...v0.1.0
[0.0.9]: https://github.com/Software-Engineering-WebDev-MobileDev/WebDev/compare/v0.0.8...v0.0.9
[0.0.8]: https://github.com/Software-Engineering-WebDev-MobileDev/WebDev/compare/v0.0.7...v0.0.8
[0.0.7]: https://github.com/Software-Engineering-WebDev-MobileDev/WebDev/compare/v0.0.6...v0.0.7
[0.0.6]: https://github.com/Software-Engineering-WebDev-MobileDev/WebDev/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/Software-Engineering-WebDev-MobileDev/WebDev/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/Software-Engineering-WebDev-MobileDev/WebDev/compare/v0.0.2...v0.0.4
[0.0.2]: https://github.com/Software-Engineering-WebDev-MobileDev/WebDev/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/Swolford0408/MobileDev/releases/tag/v0.0.1
