-- User Roles Table: Stores different roles that can be assigned to users
CREATE TABLE tblUserRoles (
    RoleID VARCHAR(50) PRIMARY KEY,   -- Unique identifier (UUID)
    RoleName VARCHAR(50) NOT NULL UNIQUE,  -- Role name (e.g., 'employee', 'management')
    RoleDescription VARCHAR(255)   -- Optional description of the role
);

-- Users Table: Stores user information, such as employees and their roles
CREATE TABLE tblUsers (
    EmployeeID VARCHAR(50) PRIMARY KEY,  -- Unique identifier for each employee (UUID format)
    FirstName VARCHAR(64) NOT NULL,  -- Employee's first name
    LastName VARCHAR(64) NOT NULL,  -- Employee's last name
    Username VARCHAR(20) UNIQUE NOT NULL,  -- Unique username for login
    Password VARCHAR(256) NOT NULL,  -- Hashed password for security
    RoleID VARCHAR(50) NOT NULL,  -- Reference to the role assigned to the employee (UUID format)
    EmploymentStatus BIT NOT NULL DEFAULT 1,  -- Active (1) or inactive (0) employment status
    StartDate DATE NOT NULL,  -- Date when the employee started working
    EndDate DATE,  -- Date when the employee left (NULL if still active)
    FOREIGN KEY (RoleID) REFERENCES tblUserRoles(RoleID),  -- Foreign key to UserRoles table
);

-- Email Types Table: Stores types of emails (e.g., personal, work)
CREATE TABLE tblEmailTypes (
    EmailTypeID VARCHAR(50) PRIMARY KEY,  -- Unique identifier for each email type (UUID format)
    EmailTypeDescription VARCHAR(50) NOT NULL,  -- Description of the email type (e.g., 'personal', 'work')
    Active BIT NOT NULL DEFAULT 1  -- Indicator if the email type is active
);

-- Email Table: Stores email addresses for each employee
CREATE TABLE tblEmail (
    EmailID VARCHAR(50) PRIMARY KEY,    -- Unique identifier for each email (UUID format)
    EmailAddress VARCHAR(320) NOT NULL,  -- Email address with max length of 320 characters (standard for emails)
    EmployeeID VARCHAR(50) NOT NULL,  -- Reference to the employee who owns the email (UUID format)
    EmailTypeID VARCHAR(50) NOT NULL,  -- Type of email (personal, work, etc.) (UUID format)
    Valid BIT NOT NULL DEFAULT 1,  -- Indicator if the email is valid (1 = valid, 0 = invalid)
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE CASCADE,  -- Cascading delete on employee removal
    FOREIGN KEY (EmailTypeID) REFERENCES tblEmailTypes(EmailTypeID),  -- Reference to email types table
);

-- Phone Types Table: Stores types of phone numbers (e.g., mobile, home)
CREATE TABLE tblPhoneTypes (
    PhoneTypeID VARCHAR(50) PRIMARY KEY,  -- Unique identifier for each phone type
    PhoneTypeDescription VARCHAR(50) NOT NULL,  -- Description of the phone type (e.g., 'mobile', 'home')
    Active BIT NOT NULL DEFAULT 1  -- Indicator if the phone type is active
);

-- Phone Numbers Table: Stores phone numbers for each employee
CREATE TABLE tblPhoneNumbers (
    PhoneNumberID VARCHAR(50) PRIMARY KEY,  -- Unique identifier for each phone number (UUID format)
    PhoneNumber VARCHAR(10) NOT NULL,  -- 10-digit phone number 
    PhoneTypeID VARCHAR(50) NOT NULL,  -- Type of phone number (e.g., mobile, home, work)
    Valid BIT NOT NULL DEFAULT 1,  -- Indicator if the phone number is valid (1 = valid, 0 = invalid)
    EmployeeID VARCHAR(50) NOT NULL,  -- Reference to the employee who owns the phone number
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE CASCADE,  -- Cascading delete on employee removal
    FOREIGN KEY (PhoneTypeID) REFERENCES tblPhoneTypes(PhoneTypeID),  -- Reference to phone types table
);

-- Sessions Table: Logs user session information (sign-ins and activity)
CREATE TABLE tblSessions (
    SessionID VARCHAR(50) PRIMARY KEY,  -- Unique identifier for each session (UUID format)
    EmployeeID VARCHAR(50) NOT NULL,  -- Reference to the employee who signed in
    CreateDateTime DATETIME NOT NULL,  -- Date and time the session was created
    LastActivityDateTime DATETIME NOT NULL,  -- Date and time of the last activity in the session
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE CASCADE  -- Cascading delete on employee removal
);

-- Recipe and Inventory Tables --

-- Categories Table: Stores different categories for ingredients (e.g., bread, pastry)
CREATE TABLE tblCategories (
    CategoryID VARCHAR(50) PRIMARY KEY,  -- Unique identifier for each category
    CategoryName VARCHAR(50) NOT NULL  -- Name of the category
);

-- Stores scaling factors for recipes (e.g., doubling, tripling)
CREATE TABLE tblScalingFactors (
    ScalingFactorID VARCHAR(50) PRIMARY KEY, -- Unique identifier for the scaling factor
    -- RecipeID VARCHAR(50) NOT NULL, -- Reference to the recipe
    ScaleFactor DECIMAL(5,2) NOT NULL, -- Scaling factor (e.g., 2 for doubling)
    Description VARCHAR(255), -- Description or reason for the scaling factor
    CreatedAt DATETIME NOT NULL, -- Timestamp of the scaling factor entry
    UpdatedAt DATETIME, -- Timestamp of the last update
    -- FOREIGN KEY (RecipeID) REFERENCES tblRecipes(RecipeID)
);

-- Stores information about recipes
CREATE TABLE tblRecipes (
    RecipeID VARCHAR(50) PRIMARY KEY, -- Unique identifier for the recipe
    RecipeName VARCHAR(100) NOT NULL, -- Name of the recipe
    Description VARCHAR(MAX), -- Detailed description of the recipe
    CategoryID VARCHAR(50), -- Reference to the category the recipe belongs to
    PrepTime INT, -- Preparation time in minutes
    CookTime INT, -- Cooking time in minutes
    TotalTime INT, -- Total time for the recipe (prep_time + cook_time)
    Servings INT NOT NULL, -- Number of servings
    Instructions VARCHAR(MAX), -- Step-by-step cooking instructions
    CreatedAt DATETIME NOT NULL, -- Timestamp when the recipe was created
    UpdatedAt DATETIME, -- Timestamp of the last update
    FOREIGN KEY (CategoryID) REFERENCES tblCategories(CategoryID) -- Foreign key linking to recipe category table
);

-- Defines the ingredients used in a recipe, including quantities and modifiers
CREATE TABLE tblRecipeIngredients (
    RecipeIngredientID VARCHAR(50) PRIMARY KEY, -- Unique identifier for the recipe ingredient
    RecipeID VARCHAR(50) NOT NULL, -- Reference to the recipe
    IngredientDescription VARCHAR(50) NOT NULL, -- Reference to the ingredient
    Quantity DECIMAL(10,2) NOT NULL, -- Quantity of the ingredient
    UnitOfMeasure VARCHAR(50) NOT NULL, -- Unit of measurement
    QuantityInStock Decimal(10,2) NOT NULL,
    ReorderFlag BIT NOT NULL DEFAULT 0,
    ModifierID VARCHAR(50), -- Reference to an ingredient modifier (optional)
    ScalingFactorID VARCHAR(50),
    FOREIGN KEY (RecipeID) REFERENCES tblRecipes(RecipeID) ON DELETE CASCADE,
    FOREIGN KEY (ScalingFactorID) REFERENCES tblScalingFactors(ScalingFactorID) ON DELETE SET NULL
);

-- Stores modifiers for ingredients (e.g., "room temperature", "nearly frozen")
CREATE TABLE tblIngredientModifiers (
    ModifierID VARCHAR(50) PRIMARY KEY, -- Unique identifier for the modifier
    ModifierDescription VARCHAR(255) NOT NULL, -- Description of the modifier
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE() -- Timestamp of when the modifier was created
);

-- Associates ingredient modifiers with recipe ingredients
CREATE TABLE tblRecipeIngredientModifiers (
    RecipeIngredientModifierID VARCHAR(50) PRIMARY KEY, -- Unique identifier for the recipe ingredient modifier
    RecipeIngredientID VARCHAR(50) NOT NULL, -- Reference to the recipe ingredient
    ModifierID VARCHAR(50) NOT NULL, -- Reference to the ingredient modifier
    FOREIGN KEY (RecipeIngredientID) REFERENCES tblRecipeIngredients(RecipeIngredientID),
    FOREIGN KEY (ModifierID) REFERENCES tblIngredientModifiers(ModifierID)
);

-- Inventory Table: Tracks stock levels of ingredients in inventory
CREATE TABLE tblInventory (
    EntryID VARCHAR(50) PRIMARY KEY,  -- Unique identifier for each inventory entry (UUID format)
    IngredientDescription VARCHAR(50) NOT NULL,
    Quantity DECIMAL(10,2) NOT NULL,  -- Quantity (non-zero, can be positive or negative)
    EmployeeID VARCHAR(50) NOT NULL,  -- Reference to the employee managing the inventory
    Notes VARCHAR(255),  -- Optional notes about the inventory entry
    Cost DECIMAL(10,2),  -- Cost of the item, must be non-negative
    CreateDateTime DATETIME NOT NULL,  -- Date and time the entry was created
    ExpireDateTime DATETIME,  -- Optional expiration date for perishable items
    ReorderAmount DECIMAL(10,2),  -- Suggested reorder amount for the ingredient
    MinimumQuantity DECIMAL(10,2),  -- Minimum stock level to maintain
    MaximumQuantity DECIMAL(10,2),  -- Maximum stock level allowed
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID),  -- Reference to employee table
    FOREIGN KEY (IngredientDescription) REFERENCES tblRecipeIngredients(IngredientDescription) ON DELETE SET NULL
);

-- Inventory Audit Table: Logs changes to inventory levels for auditing
CREATE TABLE tblInventoryAudit (
    InventoryAuditID VARCHAR(50) PRIMARY KEY,  -- Unique identifier for each audit entry (UUID format)
    InventoryEntryID VARCHAR(50) NOT NULL,  -- Reference to the ingredient being audited
    OldQuantity DECIMAL(10,2) NOT NULL,  -- Previous quantity before the change
    NewQuantity DECIMAL(10,2) NOT NULL,  -- New quantity after the change
    ChangeReason VARCHAR(255),  -- Reason for the change (e.g., restock, usage)
    EmployeeID VARCHAR(50) NOT NULL,  -- Employee who made the change
    ChangeDate DATETIME NOT NULL DEFAULT GETDATE(),  -- Date and time of the change
    PONumber VARCHAR(50),  -- Optional purchase order number related to the change
    FOREIGN KEY (InventoryEntryID) REFERENCES tblInventory(EntryID),  -- Cascading delete on ingredient removal
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID)  -- Cascading delete on employee removal
);

-- Task Management Tables --

-- Stores tasks related to baking recipes
CREATE TABLE tblTasks (
    TaskID VARCHAR(50) PRIMARY KEY, -- Unique identifier for the task
    RecipeID VARCHAR(50) NOT NULL, -- Reference to the recipe to be baked
    AmountToBake DECIMAL(10,2) NOT NULL, -- Amount to bake
    Status VARCHAR(20) NOT NULL DEFAULT 'Pending', -- Task status (e.g., 'Pending', 'Completed')
    DueDate DATETIME, -- Due date for the task
    AssignmentDate DATETIME NOT NULL DEFAULT GETDATE(), -- Date the task was assigned
    CompletionDate DATETIME, -- Date the task was completed
    AssignedEmployeeID VARCHAR(50), -- Employee assigned to the task
    FOREIGN KEY (RecipeID) REFERENCES tblRecipes(RecipeID) ON DELETE CASCADE,
    FOREIGN KEY (AssignedEmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE SET NULL
);

-- Stores comments related to tasks
CREATE TABLE tblTaskComments (
    CommentID VARCHAR(50) PRIMARY KEY, -- Unique identifier for the comment
    TaskID VARCHAR(50) NOT NULL, -- Reference to the task
    EmployeeID VARCHAR(50) NOT NULL, -- Reference to the employee who made the comment
    CommentText VARCHAR(MAX) NOT NULL, -- Text of the comment
    CommentDate DATETIME NOT NULL DEFAULT GETDATE(), -- Date and time the comment was made
    FOREIGN KEY (TaskID) REFERENCES tblTasks(TaskID) ON DELETE CASCADE,
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE SET NULL
);

-- Stores history of task assignments
CREATE TABLE tblTaskAssignmentHistory (
    AssignmentHistoryID VARCHAR(50) PRIMARY KEY, -- Unique identifier for the assignment history
    TaskID VARCHAR(50) NOT NULL, -- Reference to the task
    AssignedByEmployeeID VARCHAR(50), -- Employee who assigned the task
    AssignedToEmployeeID VARCHAR(50), -- Employee who received the task
    AssignmentDate DATETIME NOT NULL DEFAULT GETDATE(), -- Date and time of the assignment
    FOREIGN KEY (TaskID) REFERENCES tblTasks(TaskID) ON DELETE CASCADE,
    FOREIGN KEY (AssignedByEmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE SET NULL,
    FOREIGN KEY (AssignedToEmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE SET NULL
);

-- Stores history of task status changes
CREATE TABLE tblTaskStatusAudit (
    StatusAuditID VARCHAR(50) PRIMARY KEY, -- Unique identifier for the status audit
    TaskID VARCHAR(50) NOT NULL, -- Reference to the task
    OldStatus VARCHAR(20) NOT NULL, -- Previous task status
    NewStatus VARCHAR(20) NOT NULL, -- New task status
    StatusChangedByEmployeeID VARCHAR(50), -- Employee who changed the status
    StatusChangeDate DATETIME NOT NULL DEFAULT GETDATE(), -- Date and time of the status change
    FOREIGN KEY (TaskID) REFERENCES tblTasks(TaskID) ON DELETE CASCADE,
    FOREIGN KEY (StatusChangedByEmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE SET NULL
);



/*
Usage Examples:
Assign a task:

INSERT INTO tblTasks (TaskID, RecipeID, AmountToBake, Status, DueDate, AssignmentDate, AssignedEmployeeID)
VALUES ('task-001', 'recipe-001', 100.00, 'Pending', '2024-09-10', GETDATE(), 'emp-001');

-- Record the assignment
INSERT INTO tblTaskAssignmentHistory (AssignmentHistoryID, TaskID, AssignedByEmployeeID, AssignedToEmployeeID)
VALUES ('history-001', 'task-001', 'emp-supervisor', 'emp-001');

Add a Comment
INSERT INTO tblTaskComments (CommentID, TaskID, EmployeeID, CommentText)
VALUES ('comment-001', 'task-001', 'emp-001', 'Started baking; should be finished by the end of the shift.');


Mark Task as Complete:
UPDATE tblTasks
SET Status = 'Completed', CompletionDate = GETDATE()
WHERE TaskID = 'task-001';

Reassign a Task:
-- Update the task with a new employee
UPDATE tblTasks
SET AssignedEmployeeID = 'emp-002'
WHERE TaskID = 'task-001';

-- Record the reassignment
INSERT INTO tblTaskAssignmentHistory (AssignmentHistoryID, TaskID, AssignedByEmployeeID, AssignedToEmployeeID)
VALUES ('history-002', 'task-001', 'emp-001', 'emp-002');


*/


/*
Example Usage:

-- Retrieve scaling factor for a specific recipe
SELECT ScaleFactor
FROM tblScalingFactors
WHERE RecipeID = 'some-recipe-id';

-- Assume the scaling factor is 1.5
-- Retrieve ingredient quantities for the recipe
SELECT IngredientID, Quantity
FROM tblRecipeIngredients
WHERE RecipeID = 'some-recipe-id';

-- Apply scaling factor
SELECT IngredientID, Quantity * 1.5 AS ScaledQuantity
FROM tblRecipeIngredients
WHERE RecipeID = 'some-recipe-id';

*/