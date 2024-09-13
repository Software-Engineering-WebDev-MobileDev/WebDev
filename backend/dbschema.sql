CREATE TABLE tblUserRoles (
    RoleID VARCHAR(50) PRIMARY KEY,   -- Unique identifier (UUID)
    RoleName VARCHAR(50) NOT NULL UNIQUE,  -- Role name (e.g., 'employee', 'management')
    RoleDescription VARCHAR(255)   -- Optional description of the role
);

CREATE TABLE tblUsers (
    EmployeeID VARCHAR(50) PRIMARY KEY,  -- Employee identifier
    FirstName VARCHAR(64) NOT NULL,  -- First name
    LastName VARCHAR(64) NOT NULL,  -- Last name
    Username VARCHAR(20) UNIQUE NOT NULL,  -- Unique username
    Password VARCHAR(256) NOT NULL,  -- Password hash
    RoleID VARCHAR(50) NOT NULL,  -- Role reference
    EmploymentStatus BIT NOT NULL DEFAULT 1,  -- Employment status (1 for active, 0 for inactive)
    StartDate DATE NOT NULL,  -- Date employee started
    EndDate DATE,  -- Date employee left (NULL if still active)
    FOREIGN KEY (RoleID) REFERENCES tblUserRoles(RoleID),  -- Foreign key to UserRoles
    CHECK (EmploymentStatus IN (0, 1))  -- Constraint to enforce valid employment statuses (0 or 1)
);

CREATE TABLE tblEmail (
    EmailID VARCHAR(50) PRIMARY KEY,
    EmailAddress VARCHAR(320) NOT NULL,
    EmployeeID VARCHAR(50) NOT NULL,
    EmailTypeID VARCHAR(50) NOT NULL, 
    Valid BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE CASCADE,
    FOREIGN KEY (EmailTypeID) REFERENCES tblEmailTypes(EmailTypeID),
    CHECK (EmailAddress LIKE '%@%') -- Simple check to ensure valid email format
);

CREATE TABLE tblEmailTypes (
    EmailTypeID VARCHAR(50) PRIMARY KEY,
    EmailTypeDescription VARCHAR(50) NOT NULL,
    Active BIT NOT NULL DEFAULT 1
);

CREATE TABLE tblPhoneNumbers (
    PhoneNumberID VARCHAR(50) PRIMARY KEY,
    PhoneNumber VARCHAR(10) NOT NULL, -- Removed AreaCode, making this 10 digits
    PhoneTypeID VARCHAR(50) NOT NULL, 
    Valid BIT NOT NULL DEFAULT 1,
    EmployeeID VARCHAR(50) NOT NULL,
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE CASCADE,
    FOREIGN KEY (PhoneTypeID) REFERENCES tblPhoneTypes(PhoneTypeID),
    CHECK (PhoneNumber LIKE '[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]') -- Ensure 10-digit number
);

CREATE TABLE tblPhoneTypes (
    PhoneTypeID VARCHAR(50) PRIMARY KEY,
    PhoneTypeDescription VARCHAR(50) NOT NULL,
    Active BIT NOT NULL DEFAULT 1
);

CREATE TABLE tblSessions (
    SessionID VARCHAR(50) PRIMARY KEY,
    EmployeeID VARCHAR(50) NOT NULL,
    CreateDateTime DATETIME NOT NULL,
    LastActivityDateTime DATETIME NOT NULL, --- Maybe END instead
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE CASCADE
);

-- Recipe and Inventory Tables
CREATE TABLE tblCategories (
    CategoryID VARCHAR(50) PRIMARY KEY,         
    CategoryName VARCHAR(50) NOT NULL                    -- Name of the category (e.g., bread, pastry, frosting).
);

CREATE TABLE tblIngredients (
    IngredientID VARCHAR(50) PRIMARY KEY,
    IngredientDescription VARCHAR(50) NOT NULL, -- Tie this to the recipes. 
    CategoryID VARCHAR(50),
    Measurement VARCHAR(50),
    FOREIGN KEY (CategoryID) REFERENCES tblCategories(CategoryID) ON DELETE SET NULL
);

CREATE TABLE tblInventory (
    EntryID VARCHAR(50) PRIMARY KEY,
    Quantity DECIMAL(10,2) NOT NULL CHECK (Quantity <> 0), -- Non-zero, can be positive or negative
    EmployeeID VARCHAR(50) NOT NULL,
    Notes VARCHAR(255),
    Cost DECIMAL(10,2) CHECK (Cost >= 0), -- Ensure non-negative cost
    CreateDateTime DATETIME NOT NULL,
    ExpireDateTime DATETIME,
    IngredientID VARCHAR(50),
    ReorderAmount DECIMAL(10,2), 
    MinimumQuantity DECIMAL(10,2),
    MaximumQuantity DECIMAL(10,2),
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID),
    FOREIGN KEY (RecipeID) REFERENCES tblRecipes(RecipeID),
    FOREIGN KEY (IngredientID) REFERENCES tblIngredients(IngredientID)
);

CREATE TABLE tblInventoryAudit (
    InventoryAuditID VARCHAR(50) PRIMARY KEY,
    IngredientID VARCHAR(50) NOT NULL,
    OldQuantity DECIMAL(10,2) NOT NULL CHECK (OldQuantity >= 0),  -- Previous inventory quantity
    NewQuantity DECIMAL(10,2) NOT NULL CHECK (NewQuantity >= 0),  -- New inventory quantity
    ChangeReason VARCHAR(255),  -- Reason for the inventory change (e.g., restock, recipe use)
    EmployeeID VARCHAR(50) NOT NULL,  -- Employee responsible for the change
    ChangeDate DATETIME NOT NULL DEFAULT GETDATE(),  -- Date and time of the change
    PONumber VARCHAR(50),   
    FOREIGN KEY (IngredientID) REFERENCES tblIngredients(IngredientID) ON DELETE CASCADE,
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE CASCADE
);

CREATE TABLE tblRecipes (  -- need something that ties to ingredients
    RecipeID VARCHAR(50) PRIMARY KEY,        -- Unique identifier (UUID)
    RecipeName VARCHAR(100) NOT NULL,                  -- Name of the recipe
    Description VARCHAR(MAX),                 -- Detailed description
    CategoryID VARCHAR(50),                    -- Category (e.g., bread, cake)
    PrepTime INT CHECK (PrepTime >= 0),                            -- Preparation time in minutes
    CookTime INT CHECK (CookTime >= 0),                            -- Cooking time in minutes
    TotalTime INT CHECK (TotalTime >= 0),         -- Total time (prep_time + cook_time) -- Maybe take out. 
    Servings INT NOT NULL CHECK (Servings > 0),                    -- Positive servings count
    Instructions VARCHAR(MAX),               -- Step-by-step instructions
    CreatedAt DATETIME NOT NULL,                      -- Creation timestamp
    UpdatedAt DATETIME,                       -- Last updated timestamp
    FOREIGN KEY (CategoryID) REFERENCES tblCategories(CategoryID)
);

CREATE TABLE tblScalingFactors (  -- May not be needed
    ScalingFactorID VARCHAR(50) PRIMARY KEY,    -- Unique identifier (UUID)
    RecipeID VARCHAR(50) NOT NULL,              -- Foreign key referencing tblRecipes
    ScaleFactor DECIMAL(5,2) NOT NULL CHECK (ScaleFactor > 0), -- Positive scaling factor
    Description VARCHAR(255),                   -- Description or reason for the scaling factor
    CreatedAt DATETIME NOT NULL,                -- Timestamp of the scaling factor entry
    UpdatedAt DATETIME,                         -- Timestamp of the last update
    FOREIGN KEY (RecipeID) REFERENCES tblRecipes(RecipeID)
);

CREATE TABLE tblIngredientModifiers (
    ModifierID VARCHAR(50) PRIMARY KEY,   -- Unique identifier (UUID)
    ModifierDescription VARCHAR(255) NOT NULL, -- Description of the modifier (e.g., "room temperature", "nearly frozen")
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()  -- Timestamp of when the modifier was created
);

CREATE TABLE tblRecipeIngredients (
    RecipeIngredientID VARCHAR(50) PRIMARY KEY,  -- Unique identifier (UUID)
    RecipeID VARCHAR(50) NOT NULL,    -- Foreign key referencing tblRecipes
    IngredientID VARCHAR(50) NOT NULL,  -- Foreign key referencing tblIngredients
    Quantity DECIMAL(10,2) NOT NULL CHECK (Quantity > 0), -- Quantity of the ingredient
    UnitOfMeasure VARCHAR(50) NOT NULL,  -- Unit of measurement (e.g., grams, tablespoons)
    ModifierID VARCHAR(50),  -- Foreign key referencing tblIngredientModifiers (optional)
    FOREIGN KEY (RecipeID) REFERENCES tblRecipes(RecipeID) ON DELETE CASCADE,
    FOREIGN KEY (IngredientID) REFERENCES tblIngredients(IngredientID) ON DELETE CASCADE,
    FOREIGN KEY (ModifierID) REFERENCES tblIngredientModifiers(ModifierID) ON DELETE SET NULL
);

-- Create tblRecipeIngredientModifiers table
CREATE TABLE tblRecipeIngredientModifiers (
    RecipeIngredientModifierID VARCHAR(50) PRIMARY KEY,
    RecipeIngredientID VARCHAR(50) NOT NULL,
    ModifierID VARCHAR(50) NOT NULL,
    FOREIGN KEY (RecipeIngredientID) REFERENCES tblRecipeIngredients(RecipeIngredientID),
    FOREIGN KEY (ModifierID) REFERENCES tblIngredientModifiers(ModifierID)
);

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

-- Task Management Tables
CREATE TABLE tblTasks (
    TaskID VARCHAR(50) PRIMARY KEY,
    RecipeID VARCHAR(50) NOT NULL,  -- Recipe to be baked
    AmountToBake DECIMAL(10,2) NOT NULL CHECK (AmountToBake > 0), -- Positive amount to bake
    Status VARCHAR(20) NOT NULL DEFAULT 'Pending',  -- Task status
    DueDate DATETIME,  -- When the task should be completed
    AssignmentDate DATETIME NOT NULL DEFAULT GETDATE(),  -- When the task was assigned
    CompletionDate DATETIME,  -- When the task was marked as completed
    AssignedEmployeeID VARCHAR(50),  -- Employee who is assigned the task
    FOREIGN KEY (RecipeID) REFERENCES tblRecipes(RecipeID) ON DELETE CASCADE,
    FOREIGN KEY (AssignedEmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE SET NULL
);

CREATE TABLE tblTaskComments (
    CommentID VARCHAR(50) PRIMARY KEY,
    TaskID VARCHAR(50) NOT NULL,
    EmployeeID VARCHAR(50) NOT NULL,
    CommentText VARCHAR(MAX) NOT NULL,
    CommentDate DATETIME NOT NULL DEFAULT GETDATE(), -- Automatically set comment date
    FOREIGN KEY (TaskID) REFERENCES tblTasks(TaskID) ON DELETE CASCADE,
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE SET NULL
);

CREATE TABLE tblTaskAssignmentHistory (
    AssignmentHistoryID VARCHAR(50) PRIMARY KEY,
    TaskID VARCHAR(50) NOT NULL,
    AssignedByEmployeeID VARCHAR(50),  -- Employee who assigned the task
    AssignedToEmployeeID VARCHAR(50),  -- Employee who received the task
    AssignmentDate DATETIME NOT NULL DEFAULT GETDATE(),  -- When the assignment occurred
    FOREIGN KEY (TaskID) REFERENCES tblTasks(TaskID) ON DELETE CASCADE,
    FOREIGN KEY (AssignedByEmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE SET NULL,
    FOREIGN KEY (AssignedToEmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE SET NULL
);

CREATE TABLE tblTaskStatusAudit (
    StatusAuditID VARCHAR(50) PRIMARY KEY,
    TaskID VARCHAR(50) NOT NULL,
    OldStatus VARCHAR(20) NOT NULL,   -- Previous task status
    NewStatus VARCHAR(20) NOT NULL,   -- New task status
    StatusChangedByEmployeeID VARCHAR(50),  -- Employee who changed the status
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
