CREATE TABLE tblUsers (
    EmployeeID VARCHAR(50) PRIMARY KEY,
    FirstName VARCHAR(64) NOT NULL,
    LastName VARCHAR(64) NOT NULL,
    Username VARCHAR(20) UNIQUE NOT NULL,
    Password VARCHAR(256) NOT NULL
);

CREATE TABLE tblEmail (
    EmailID VARCHAR(50) PRIMARY KEY,
    EmailAddress VARCHAR(320) NOT NULL,
    EmployeeID VARCHAR(50) NOT NULL,
    EmailTypeID VARCHAR(50) NOT NULL, 
    Valid BIT NOT NULL DEFAULT 1,
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE CASCADE,
    FOREIGN KEY (EmailTypeID) REFERENCES tblEmailTypes(EmailTypeID)  
);

CREATE TABLE tblEmailTypes (
    EmailTypeID VARCHAR(50) PRIMARY KEY,
    EmailTypeDescription VARCHAR(50) NOT NULL,
    Active BIT NOT NULL DEFAULT 1
);

CREATE TABLE tblPhoneNumbers (
    PhoneNumberID VARCHAR(50) PRIMARY KEY,
    AreaCode VARCHAR(3) NOT NULL,
    PhoneNumber VARCHAR(7) NOT NULL,
    PhoneTypeID VARCHAR(50) NOT NULL, 
    Valid BIT NOT NULL DEFAULT 1,
    EmployeeID VARCHAR(50) NOT NULL,
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE CASCADE,
    FOREIGN KEY (PhoneTypeID) REFERENCES tblPhoneTypes(PhoneTypeID) 
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
    LastActivityDateTime DATETIME NOT NULL,
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID) ON DELETE CASCADE
);

-- Recipe and Inventory Tables
CREATE TABLE tblCategories (
    CategoryID VARCHAR(320) PRIMARY KEY,         
    CategoryName VARCHAR(50) NOT NULL                    -- Name of the category (e.g., bread, pastry, frosting).
);

CREATE TABLE tblIngredients (
    IngredientID VARCHAR(50) PRIMARY KEY,
    IngredientDescription VARCHAR(50) NOT NULL,
    CategoryID VARCHAR(320),
    Measurement VARCHAR(50),
    MaximumAmount DECIMAL(10,2),
    ReorderAmount DECIMAL(10,2),
    MinimumAmount DECIMAL(10,2)
    FOREIGN KEY (CategoryID) REFERENCES tblCategories(CategoryID) ON DELETE SET NULL
);

CREATE TABLE tblInventory (
    EntryID VARCHAR(50) PRIMARY KEY,
    Quantity DECIMAL(10,2) NOT NULL, --represents amount added or removed. 5.5 ounces added, -5.5 ounces removed
    EmployeeID VARCHAR(50) NOT NULL,
    Notes VARCHAR(255),
    Cost DECIMAL(10,2),
    CreateDateTime DATETIME NOT NULL,
    ExpireDateTime DATETIME,
    PONumber VARCHAR(50),
    RecipeID VARCHAR(320),
    IngredientID VARCHAR(320),
    FOREIGN KEY (EmployeeID) REFERENCES tblUsers(EmployeeID),
    FOREIGN KEY (RecipeID) REFERENCES tblRecipes(RecipeID),
    FOREIGN KEY (IngredientID) REFERENCES tblIngredients(IngredientID)
);


CREATE TABLE tblRecipes (
    RecipeID VARCHAR(320) PRIMARY KEY,        -- Unique identifier (UUID).
    RecipeName VARCHAR(100) NOT NULL,                  -- Name of the recipe.
    Description VARCHAR(MAX),                 -- Detailed description.
    CategoryID VARCHAR(320),                    -- Category (e.g., bread, cake).
    PrepTime INT,                            -- Preparation time in minutes.
    CookTime INT,                            -- Cooking time in minutes.
    TotalTime INT,                           -- Total time (prep_time + cook_time).
    Servings INT NOT NULL,                            -- Number of servings.
    Instructions VARCHAR(MAX),               -- Step-by-step instructions.
    CreatedAt DATETIME NOT NULL,                      -- Creation timestamp.
    UpdatedAt DATETIME                       -- Last updated timestamp.
    FOREIGN KEY (CategoryID) REFERENCES tblCategories(CategoryID)
);

CREATE TABLE tblScalingFactors (
    ScalingFactorID VARCHAR(320) PRIMARY KEY,    -- Unique identifier (UUID).
    RecipeID VARCHAR(320) NOT NULL,                      -- Foreign key referencing tblRecipes.
    ScaleFactor DECIMAL(5,2) NOT NULL,                   -- The scaling factor (e.g., 1.5 to increase by 50%).
    Description VARCHAR(255),                   -- Description or reason for the scaling factor.
    CreatedAt DATETIME NOT NULL,                         -- Timestamp of the scaling factor entry.
    UpdatedAt DATETIME,                         -- Timestamp of the last update.
    FOREIGN KEY (RecipeID) REFERENCES tblRecipes(RecipeID)
);

CREATE TABLE tblRecipeIngredients (
    RecipeID VARCHAR(320) NOT NULL,                        -- Foreign key referencing tblRecipes.
    IngredientID VARCHAR(320) NOT NULL,                    -- Foreign key referencing tblIngredients.
    Quantity DECIMAL(10,2) NOT NULL,                       -- Quantity of the ingredient in the recipe.
    PRIMARY KEY (RecipeID, IngredientID),        -- Composite primary key.
    FOREIGN KEY (RecipeID) REFERENCES tblRecipes(RecipeID),
    FOREIGN KEY (IngredientID) REFERENCES tblIngredients(IngredientID)
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
    RecipeID VARCHAR(320) NOT NULL,  -- Recipe to be baked
    AmountToBake DECIMAL(10,2) NOT NULL,  -- Amount to bake in the shift
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
    CommentText TEXT NOT NULL,
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
