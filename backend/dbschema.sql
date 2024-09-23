-- User Roles Table: Stores different roles that can be assigned to users
CREATE TABLE tblUserRoles (
    RoleID          VARCHAR(50) PRIMARY KEY,     -- Unique identifier (UUID)
    RoleName        VARCHAR(50) NOT NULL UNIQUE, -- Role name (e.g., 'employee', 'management')
    RoleDescription VARCHAR(255)                 -- Optional description of the role
);

-- Users Table: Stores user information, such as employees and their roles
CREATE TABLE tblUsers (
    EmployeeID       VARCHAR(50) PRIMARY KEY,               -- Unique identifier for each employee (UUID format)
    FirstName        VARCHAR(64)        NOT NULL,           -- Employee's first name
    LastName         VARCHAR(64)        NOT NULL,           -- Employee's last name
    Username         VARCHAR(20) UNIQUE NOT NULL,           -- Unique username for login
    Password         VARCHAR(256)       NOT NULL,           -- Hashed password for security
    RoleID           VARCHAR(50)        NOT NULL,           -- Reference to the role assigned to the employee (UUID format)
    EmploymentStatus BIT                NOT NULL DEFAULT 1, -- Active (1) or inactive (0) employment status
    StartDate        DATE               NOT NULL,           -- Date when the employee started working
    EndDate          DATE,                                  -- Date when the employee left (NULL if still active)
    FOREIGN KEY (RoleID) REFERENCES tblUserRoles (RoleID) ON UPDATE CASCADE,  -- Foreign key to UserRoles table
);

-- Email Types Table: Stores types of emails (e.g., personal, work)
CREATE TABLE tblEmailTypes (
    EmailTypeID          VARCHAR(50) PRIMARY KEY,       -- Unique identifier for each email type (UUID format)
    EmailTypeDescription VARCHAR(50) NOT NULL,          -- Description of the email type (e.g., 'personal', 'work')
    Active               BIT         NOT NULL DEFAULT 1 -- Indicator if the email type is active
);

-- Email Table: Stores email addresses for each employee
CREATE TABLE tblEmail (
    EmailID      VARCHAR(50) PRIMARY KEY,                                        -- Unique identifier for each email (UUID format)
    EmailAddress VARCHAR(320) NOT NULL,                                          -- Email address with max length of 320 characters (standard for emails)
    EmployeeID   VARCHAR(50)  NOT NULL,                                          -- Reference to the employee who owns the email (UUID format)
    EmailTypeID  VARCHAR(50)  NOT NULL,                                          -- Type of email (personal, work, etc.) (UUID format)
    Valid        BIT          NOT NULL DEFAULT 1,                                -- Indicator if the email is valid (1 = valid, 0 = invalid)
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers (EmployeeID) ON DELETE CASCADE, -- Cascading delete on employee removal
    FOREIGN KEY (EmailTypeID) REFERENCES tblEmailTypes (EmailTypeID) ON UPDATE CASCADE,            -- Reference to email types table
);

-- Phone Types Table: Stores types of phone numbers (e.g., mobile, home)
CREATE TABLE tblPhoneTypes (
    PhoneTypeID          VARCHAR(50) PRIMARY KEY,       -- Unique identifier for each phone type
    PhoneTypeDescription VARCHAR(50) NOT NULL,          -- Description of the phone type (e.g., 'mobile', 'home')
    Active               BIT         NOT NULL DEFAULT 1 -- Indicator if the phone type is active
);

-- Phone Numbers Table: Stores phone numbers for each employee
CREATE TABLE tblPhoneNumbers (
    PhoneNumberID VARCHAR(50) PRIMARY KEY,                                       -- Unique identifier for each phone number (UUID format)
    PhoneNumber   VARCHAR(10) NOT NULL,                                          -- 10-digit phone number
    PhoneTypeID   VARCHAR(50) NOT NULL,                                          -- Type of phone number (e.g., mobile, home, work)
    Valid         BIT         NOT NULL DEFAULT 1,                                -- Indicator if the phone number is valid (1 = valid, 0 = invalid)
    EmployeeID    VARCHAR(50) NOT NULL,                                          -- Reference to the employee who owns the phone number
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers (EmployeeID) ON DELETE CASCADE, -- Cascading delete on employee removal
    FOREIGN KEY (PhoneTypeID) REFERENCES tblPhoneTypes (PhoneTypeID) ON UPDATE CASCADE,            -- Reference to phone types table
);

-- Sessions Table: Logs user session information (sign-ins and activity)
CREATE TABLE tblSessions (
    SessionID            VARCHAR(50) PRIMARY KEY, -- Unique identifier for each session (UUID format)
    EmployeeID           VARCHAR(50) NOT NULL,    -- Reference to the employee who signed in
    CreateDateTime       DATETIME    NOT NULL,    -- Date and time the session was created
    LastActivityDateTime DATETIME    NOT NULL,    -- Date and time of the last activity in the session
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers (EmployeeID) ON UPDATE CASCADE
);

-- Inventory Tables --

-- Inventory Table: Tracks stock levels of ingredients in inventory
CREATE TABLE tblInventory (
    InventoryID VARCHAR(50) PRIMARY KEY,  -- Unique identifier for each inventory entry (UUID format)
    Name        VARCHAR(50) NOT NULL,
    ShelfLife   INT,
    ShelfLifeUnit   VARCHAR(10),  
    ReorderAmount DECIMAL(10,2) NOT NULL,  -- Suggested reorder amount for the ingredient
    ReorderUnit VARCHAR(20)     NOT NULL
);

CREATE TABLE tblInventoryHistory (
    HistID      VARCHAR(50) PRIMARY KEY,
    ChangeAmount DECIMAL(10, 2),
    EmployeeID  VARCHAR(50),
    InventoryID VARCHAR(50),
    Description VARCHAR(255),
    Date        DATETIME NOT NULL DEFAULT GETDATE(),
    ExpirationDate DATETIME, 
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID) ON UPDATE CASCADE,
    FOREIGN KEY (InventoryID) REFERENCES tblInventory(InventoryID) ON UPDATE CASCADE
)

CREATE TABLE tblPurchaseOrder (
    PurchaseOrderID VARCHAR(50) PRIMARY KEY,
    InventoryID     VARCHAR(50),
    Date            DATETIME    NOT NULL DEFAULT GETDATE(),
    OrderQuantity   DECIMAL(10, 2) NOT NULL,
    Vendor          VARCHAR(255),
    PayableAmount   DECIMAL(10, 2),
    PayableDate     DATETIME,
    EmployeeID      VARCHAR(50),
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID) ON UPDATE CASCADE,
    FOREIGN KEY (InventoryID) REFERENCES tblInventory(InventoryID) ON UPDATE CASCADE
)

-- Recipe Tables --

-- Stores information about recipes
CREATE TABLE tblRecipes (
    RecipeID     VARCHAR(50) PRIMARY KEY,                          -- Unique identifier for the recipe
    RecipeName   VARCHAR(100) NOT NULL,                            -- Name of the recipe
    Description  VARCHAR(MAX),                                     -- Detailed description of the recipe
    Category     VARCHAR(50)  NOT NULL,                                      -- Reference to the category the recipe belongs to
    PrepTime     INT          NOT NULL,                                              -- Preparation time in minutes
    CookTime     INT          NOT NULL,                                              -- Cooking time in minutes
    Servings     INT          NOT NULL,                            -- Number of servings
    Instructions VARCHAR(MAX) NOT NULL,                                     -- Step-by-step cooking instructions
    CreatedAt    DATETIME     NOT NULL,                            -- Timestamp when the recipe was created
    UpdatedAt    DATETIME     NOT NULL DEFAULT GETDATE(),                                         -- Timestamp of the last update
);

-- Defines the ingredients used in a recipe, including quantities and modifiers
CREATE TABLE tblIngredients (
    IngredientID VARCHAR(50) PRIMARY KEY, -- Unique identifier for the recipe ingredient
    InventoryID     VARCHAR(50) NOT NULL,
    Quantity DECIMAL(10,2) NOT NULL, -- Quantity of the ingredient
    UnitOfMeasure VARCHAR(50) NOT NULL, -- Unit of measurement
    FOREIGN KEY (InventoryID) REFERENCES tblInventory (InventoryID) ON UPDATE CASCADE
);

-- Stores modifiers for ingredients (e.g., "room temperature", "nearly frozen")
CREATE TABLE tblIngredientModifiers (
    ModifierID          VARCHAR(50) PRIMARY KEY,                -- Unique identifier for the modifier
    ModifierName        VARCHAR(255) NOT NULL,                  -- Description of the modifier
);

CREATE TABLE tblRecipeIngredientModifier (
    RecipeID    VARCHAR(50),
    IngredientID VARCHAR(50),
    ModifierID  VARCHAR(50),
    ScaleFactor DECIMAL(5,2),
    PRIMARY KEY (RecipeID, IngredientID, ModifierID),
    FOREIGN KEY (RecipeID) REFERENCES tblRecipes(RecipeID) ON UPDATE CASCADE,
    FOREIGN KEY (IngredientID) REFERENCES tblIngredients(IngredientID) ON UPDATE CASCADE,
    FOREIGN KEY (ModifierID) REFERENCES tblModifiers(ModifierID) ON UPDATE CASCADE
)

-- Task Management Tables --

-- Stores tasks related to baking recipes
CREATE TABLE tblTasks (
    TaskID             VARCHAR(50) PRIMARY KEY,                   -- Unique identifier for the task
    RecipeID           VARCHAR(50)    NOT NULL,                   -- Reference to the recipe to be baked
    AmountToBake       DECIMAL(10, 2) NOT NULL,                   -- Amount to bake
    Status             VARCHAR(20)    NOT NULL DEFAULT 'Pending', -- Task status (e.g., 'Pending', 'Completed')
    AssignmentDate     DATETIME       NOT NULL DEFAULT GETDATE(), -- Date the task was assigned
    DueDate            DATETIME,                                  -- Due date for the task
    CompletionDate     DATETIME,                                  -- Date the task was completed
    AssignedEmployeeID VARCHAR(50),                               -- Employee assigned to the task
    FOREIGN KEY (RecipeID) REFERENCES tblRecipes (RecipeID) ON UPDATE CASCADE,
    FOREIGN KEY (AssignedEmployeeID) REFERENCES tblUsers (EmployeeID) ON UPDATE CASCADE
);

-- Stores comments related to tasks
CREATE TABLE tblTaskComments (
    CommentID   VARCHAR(50) PRIMARY KEY,                 -- Unique identifier for the comment
    TaskID      VARCHAR(50)  NOT NULL,                   -- Reference to the task
    EmployeeID  VARCHAR(50)  NOT NULL,                   -- Reference to the employee who made the comment
    CommentText VARCHAR(MAX) NOT NULL,                   -- Text of the comment
    CommentDate DATETIME     NOT NULL DEFAULT GETDATE(), -- Date and time the comment was made
    FOREIGN KEY (TaskID) REFERENCES tblTasks (TaskID) ON UPDATE CASCADE,
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers (EmployeeID) ON UPDATE CASCADE
);

-- Stores history of task assignments
CREATE TABLE tblTaskAssignmentHistory (
    AssignmentHistoryID  VARCHAR(50) PRIMARY KEY,                -- Unique identifier for the assignment history
    TaskID               VARCHAR(50) NOT NULL,                   -- Reference to the task
    AssignedByEmployeeID VARCHAR(50),                            -- Employee who assigned the task
    AssignedToEmployeeID VARCHAR(50),                            -- Employee who received the task
    AssignmentDate       DATETIME    NOT NULL DEFAULT GETDATE(), -- Date and time of the assignment
    FOREIGN KEY (TaskID) REFERENCES tblTasks (TaskID) ON UPDATE CASCADE,
    FOREIGN KEY (AssignedByEmployeeID) REFERENCES tblUsers (EmployeeID) ON UPDATE CASCADE,
    FOREIGN KEY (AssignedToEmployeeID) REFERENCES tblUsers (EmployeeID) ON UPDATE CASCADE
);

-- Stores history of task status changes
CREATE TABLE tblTaskStatusAudit (
    StatusAuditID             VARCHAR(50) PRIMARY KEY,                -- Unique identifier for the status audit
    TaskID                    VARCHAR(50) NOT NULL,                   -- Reference to the task
    OldStatus                 VARCHAR(20) NOT NULL,                   -- Previous task status
    NewStatus                 VARCHAR(20) NOT NULL,                   -- New task status
    StatusChangedByEmployeeID VARCHAR(50),                            -- Employee who changed the status
    StatusChangeDate          DATETIME    NOT NULL DEFAULT GETDATE(), -- Date and time of the status change
    FOREIGN KEY (TaskID) REFERENCES tblTasks (TaskID) ON UPDATE CASCADE,
    FOREIGN KEY (StatusChangedByEmployeeID) REFERENCES tblUsers (EmployeeID) ON UPDATE CASCADE
);

/*
SELECT 
    InventoryID, 
    Name, 
    CreateDateTime, 
    CASE 
        WHEN ShelfLifeUnit = 'days' THEN DATEADD(day, ShelfLifeQuantity, CreateDateTime)
        WHEN ShelfLifeUnit = 'weeks' THEN DATEADD(week, ShelfLifeQuantity, CreateDateTime)
        WHEN ShelfLifeUnit = 'months' THEN DATEADD(month, ShelfLifeQuantity, CreateDateTime)
        WHEN ShelfLifeUnit = 'years' THEN DATEADD(year, ShelfLifeQuantity, CreateDateTime)
        ELSE NULL  -- Handles cases where ShelfLifeUnit is not recognized
    END AS ExpirationDate
FROM tblInventory;

*/

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