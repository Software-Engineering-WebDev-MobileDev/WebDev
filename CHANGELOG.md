# Changelog

All notable changes to this project will be documented in this file.

This format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Indev1] - 2024-09-19

## [0.1.3] - 2024-10-01

### Added
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

## [0.1.2] - 2024-09-27

### Changed
- Update SQL schema to hopefully fulfil all MVP requirements
- Updated API endpoints to reflect the new schema
- Updated [documentation](./backend/DOCUMENTATION.md) to reflect the new parameters and output of the schema
- Updated [documentation](./backend/DOCUMENTATION.md) to reflect the new setup for frontend development

## [0.1.1] - 2024-09-19

## Added
- Numerous new html pages
- Links to these new pages through the hamburger dropdown
- Hard coded ingredient html page
- Added css style to cooperate with ingredient page
- Display for the ingredients
- Icon and background color styles
- New source for icons

## [0.1.0] - 2024-09-18

## Added
- Multiple text colors, and a number of styling options for buttons
- Temporary text to the Dashboard due to it not being ready yet
- Clicking on the logo/site name takes you back to the homepage

## Removed
- Previous Dashboard look

## Changed
- "Login" into "Sign in"
- All colors to match the thematics of the website
- Transparency to the Sign in and Register pages
- The name of the site to "Rolling Scones" instead of "Bakery Site"
- Commented out a large amount of currently unused code in index.html

## [Unreleased]

## [0.0.9] - 2024-09-18

## Added
- style.css (Implementation to come later)
- jsource folder (to keep our code and code we draw from separate)
- Added chart, dataTables, jquery, jsbootstrap, and sweetalert to jsource
- functions.js to hold general functions
- functions.js to src reference 

## Removed
- Unnecessary registration information from register form
- All APIs from api.js 
- dateTimeZip function
- References to deprecated registration information
- DivEnvironment and all references
- dateTime.js, due to moving all its contents to functions.js
- emailstorage.js, due to moving all its contents to functions.js
- api.js, due to deleting all its contents

## Changed
- Contents previously in dateTime.js are now in functions.js
- Contents previously in emailstorage.js are now in functions.js
- Reordered js src to have the source files above our working code

## Fixed
- Website functionality break
- Hamburger button icon break
- Issue where the email was not storing upon logging out
- Issue where refreshing the page would cause you to log out automatically

## [0.0.8] - 2024-09-16

## Added
- New function for saving email in the login window between sessions
- Split the javascript code into numerous separate files
- Referencing to the javascript code in the html

## Changed
- Converted all css links into actual files within /css 
- Converted all js links into actual files within /js


## [0.0.7] - 2024-09-07

## Added
- Comments indicating not currently useful but later potentially useful functions
- Added comments starting with !!! to easily return to potentially useful functions

## Removed
- Code framework for audio playing
- Various deprecated and commented out blocks of code
- All audio files

## [0.0.6] - 2024-09-03

## Added

- Bread Icon Picture
- Bread Background Picture (Temporary)

## Removed
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

## Removed
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

[0.0.2]: https://github.com/Swolford0408/MobileDev/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/Swolford0408/MobileDev/releases/tag/v0.0.1
