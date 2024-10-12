const bodyParser = require('body-parser');
const express = require('express');
const {v4} = require('uuid');
const {return_500, return_400, return_498} = require('./codes');
const {isNumber, email_types, phone_types, validate_email} = require('./validate');

// Database setup:
const config = require('../config.js');
const Database = require('../database');
const database = new Database(config);

// Used for API routes
const app = express.Router();

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// Valid user roles
const user_roles = {
    owner: 0,
    admin: 1,
    manager: 2,
    employee: 3
}

app.get("/user_email", (req, res) => {
    try {
        const session_id = req.header("session_id");

        database.sessionToEmployeeID(session_id).then((employee_id) => {
            if (employee_id) {
                database.executeQuery(
                    `SELECT *
                     FROM tblEmail
                     WHERE EmployeeID = '${employee_id}'`
                ).then((result) => {
                    res.status(200).send(
                        {
                            status: "success",
                            emails: result.recordsets[0]
                        }
                    );
                }).catch((e) => {
                    console.log(e);
                    return_500(res);
                })
            }
            else {
                return_498(res);
            }
        }).catch((e) => {
            console.log(e);
            return_500(res);
        });
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        }
        else {
            console.log(e);
            return_500(res);
        }
    }
});

app.get("/users_email", (req, res) => {
    try {
        const session_id = req.header("session_id");
        const employee_id = req.header("employee_id");

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (!employee_id.match(/[0-9A-Za-z]{0,50}/)) {
            return_400(res, "Employee is not valid");
        }
        else {
            database.sessionToEmployeeID(session_id).then((user_employee_id) => {
                if (user_employee_id) {
                    database.executeQuery(
                        `SELECT *
                         FROM tblEmail
                         WHERE EmployeeID = '${employee_id}'`
                    ).then((result) => {
                        res.status(200).send(
                            {
                                status: "success",
                                emails: result.recordsets[0]
                            }
                        );
                    }).catch((e) => {
                        console.log(e);
                        return_500(res);
                    })
                }
                else {
                    return_498(res);
                }
            }).catch((e) => {
                console.log(e);
                return_500(res);
            });
        }
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        }
        else {
            return_500(res);
        }
    }
});

app.post('/add_user_email', (req, res) => {
    try {
        const session_id = req.header("session_id");
        const email_id = v4().replace(/-/g, '');
        const email_address = req.header("email_address");
        const type = req.header("type");


        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            )
        }
        else if (email_address === undefined) {
            return_400(res, "Missing email_address");
        }
        else if (type === undefined) {
            return_400(res, "Missing (email) type");
        }
        // Quick and dirty email validation.
        else if (validate_email(email_address)) {
            return_400(res, "Invalid email address");
        }
        // Make sure that the email is a valid type
        else if (!email_types.includes(type)) {
            return_400(res, "Invalid email type");
        }
        else {
            database.sessionToEmployeeID(session_id).then((employee_id) => {
                if (employee_id) {
                    database.executeQuery(
                        `INSERT INTO tblEmail (EmailID, EmailAddress, EmployeeID, EmailTypeID, Valid)
                         VALUES ('${email_id}', '${email_address}', '${employee_id}', '${type}', 1)`
                    ).then(() => {
                        res.status(201).send(
                            {
                                status: "success"
                            }
                        );
                    }).catch((e) => {
                        console.log(e);
                        return_500(res);
                    });
                }
                else {
                    return_498(res);
                }
            }).catch((e) => {
                console.log(e);
                return_500(res);
            })
        }
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        }
        else {
            return_500(res);
        }
    }
});

app.delete('/user_email', (req, res) => {
    try {
        const session_id = req.header("session_id");
        const email_address = req.header("email_address");

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (email_address === undefined) {
            return_400(res, "Missing email_address");
        }
        else if (validate_email(email_address)) {
            return_400(res, "Bad email address");
        }
        else {
            database.sessionToEmployeeID(session_id).then((employee_id) => {
                if (employee_id) {
                    database.executeQuery(
                        `DELETE
                         FROM tblEmail
                         WHERE EmailAddress = '${email_address}'
                           AND EmployeeID = '${employee_id}'`
                    ).then((result) => {
                        if (result.rowsAffected >= 1) {
                            res.status(200).send(
                                {
                                    status: "success"
                                }
                            );
                        }
                        else {
                            res.status(409).send(
                                {
                                    status: "error",
                                    reason: "Email address does not exist for the user"
                                }
                            );
                        }
                    }).catch((e) => {
                        console.log(e);
                        return_500(res);
                    })
                }
                else {
                    return_498(res);
                }
            }).catch((e) => {
                console.log(e);
                return_500(res);
            });
        }
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        }
        else {
            return_500(res);
        }
    }
});

app.get('/user_phone', (req, res) => {
    try {
        const session_id = req.header("session_id");

        database.sessionToEmployeeID(session_id).then((employee_id) => {
            if (employee_id) {
                database.executeQuery(
                    `SELECT *
                     FROM tblPhoneNumbers
                     WHERE EmployeeID = '${employee_id}'`
                ).then((result) => {
                    res.status(200).send(
                        {
                            status: "success",
                            phone_numbers: result.recordsets[0]
                        }
                    );
                }).catch((e) => {
                    console.log(e);
                    return_500(res);
                })
            }
            else {
                return_498(res);
            }
        }).catch((e) => {
            console.log(e);
            return_500(res);
        });
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        }
        else {
            return_500(res);
        }
    }
});

app.get('/users_phone', (req, res) => {
    try {
        const session_id = req.header("session_id");
        const employee_id = req.header("employee_id");

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (!employee_id.match(/[0-9A-Za-z]{0,50}/)) {
            return_400(res, "Employee is not valid");
        }
        else {
            database.sessionToEmployeeID(session_id).then((user_employee_id) => {
                if (user_employee_id) {
                    database.executeQuery(
                        `SELECT *
                         FROM tblPhoneNumbers
                         WHERE EmployeeID = '${employee_id}'`
                    ).then((result) => {
                        res.status(200).send(
                            {
                                status: "success",
                                phone_numbers: result.recordsets[0]
                            }
                        );
                    }).catch((e) => {
                        console.log(e);
                        return_500(res);
                    })
                }
                else {
                    return_498(res);
                }
            }).catch((e) => {
                console.log(e);
                return_500(res);
            });
        }
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        }
        else {
            return_500(res);
        }
    }
});

app.post('/add_user_phone', (req, res) => {
    try {
        const session_id = req.header("session_id");
        const phone_number_id = v4().replace(/-/g, '');
        const phone_number = req.header("phone_number");
        const phone_type = req.header("type");

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (phone_number === undefined) {
            return_400(res, "Missing phone_number");
        }
        else if (phone_type === undefined) {
            return_400(res, "Missing phone_type")
        }
        else if (!phone_number.match(/^\(?\d{3}\)?[\d -]?\d{3}[\d -]?\d{4}$/)) {
            return_400(res, "Invalid phone number")
        }
        else if (!phone_types.includes(phone_type)) {
            return_400(res, "Invalid phone type");
        }
        else {
            const digits = phone_number.replace(/\D/g, '');

            database.sessionToEmployeeID(session_id).then((employee_id) => {
                if (employee_id) {
                    database.executeQuery(
                        `INSERT INTO tblPhoneNumbers (PhoneNumberID, PhoneNumber, PhoneTypeID, Valid, EmployeeID)
                         VALUES ('${phone_number_id}', '${digits}', '${phone_type}', 1, '${employee_id}')`
                    ).then(() => {
                        res.status(201).send(
                            {
                                status: "success"
                            }
                        );
                    }).catch((e) => {
                        console.log(e);
                        return_500(res);
                    })
                }
                else {
                    return_498(res);
                }
            }).catch((e) => {
                console.log(e);
                return_500(res);
            });
        }
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        }
        else {
            return_500(res);
        }
    }
});

app.delete('/user_phone', (req, res) => {
    try {
        const session_id = req.header("session_id");
        const phone_number = req.header("phone_number");

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (!phone_number.match(/^\(?\d{3}\)?[\d -]?\d{3}[\d -]?\d{4}$/)) {
            return_400(res, "Invalid phone number")
        }
        else {
            database.sessionToEmployeeID(session_id).then((employee_id) => {
                if (employee_id) {
                    const digits = phone_number.replace(/\D/g, '');
                    database.executeQuery(
                        `DELETE
                         FROM tblPhoneNumbers
                         WHERE PhoneNumber = '${digits}'
                           AND EmployeeID = '${employee_id}'`
                    ).then((result) => {
                        if (result.rowsAffected >= 1) {
                            res.status(200).send(
                                {
                                    status: "success"
                                }
                            );
                        }
                        else {
                            res.status(409).send(
                                {
                                    status: "error",
                                    reason: "Phone number does not exist for the user"
                                }
                            );
                        }
                    }).catch((e) => {
                        console.log(e);
                        return_500(res);
                    })
                }
                else {
                    return_498(res);
                }
            }).catch((e) => {
                console.log(e);
                return_500(res);
            });
        }
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        }
        else {
            return_500(res);
        }
    }
});

app.get('/user_list', (req, res) => {
    try {
        // Pagination, default of one page of 20 users
        const page = isNumber(req.header("page")) ? Number(req.header("page")) : 1;
        const page_size = isNumber(req.header("page_size")) ? Number(req.header("page_size")) : 20;
        const session_id = req.header("session_id");

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (page_size > 30) {
            return_400(res, "Invalid page size. Page size must be <= 30");
        }
        else if (page_size < 1) {
            return_400(res, "Invalid page size. Page size must be > 0");
        }
        else if (page < 1) {
            return_400(res, "Page must be >= 1")
        }
        else if (!Number.isInteger(page_size)) {
            return_400(res, "page_size must be an integer");
        }
        else if (!Number.isInteger(page)) {
            return_400(res, "page must be an integer");
        }
        else {
            // Get the users and return the requested count and page
            database.sessionToEmployeeID(session_id).then((employee_id) => {
                if (employee_id) {
                    database.executeQuery(
                        `SELECT EmployeeID, FirstName, LastName, Username
                         FROM tblUsers`
                    ).then((result_rows) => {
                        // Make sure that there are results
                        if (result_rows.rowsAffected > 0) {
                            // Paginate and return the results
                            let user_list = result_rows.recordsets[0];
                            res.status(200).send(
                                {
                                    status: "success",
                                    page: page,
                                    page_count: Math.ceil(user_list.length / page_size),
                                    content: user_list.slice(page * page_size - page_size, page * page_size)
                                }
                            );
                            // Otherwise, we know that there are no users in the database
                        }
                        else {
                            res.status(503).send(
                                {
                                    status: "error",
                                    reason: "No users in the database. Try creating some users first"
                                }
                            );
                        }
                    }).catch((e) => {
                        console.log(e);
                        return_500(res);
                    })
                }
                else {
                    return_498(res);
                }
            });
        }
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        }
        else {
            return_500(res);
        }
    }
});

app.get('/my_info', (req, res) => {
    try {
        const session_id = req.header("session_id");

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else {
            database.sessionToEmployeeID(session_id).then(async (employee_id) => {
                if (employee_id) {
                    let basic_info = database.executeQuery(
                        `SELECT EmployeeID,
                                FirstName,
                                LastName,
                                Username,
                                RoleName,
                                RoleDescription,
                                EmploymentStatus,
                                StartDate,
                                EndDate
                         FROM tblUsers AS tU
                                  INNER JOIN tblUserRoles AS tUR ON tU.RoleID = tUR.RoleID
                         WHERE EmployeeID = '${employee_id}'`
                    ).then((result) => {
                        return result.recordsets[0][0];
                    }).catch((e) => {
                        console.error(e);
                        return [];
                    });
                    let emails = database.executeQuery(
                        `SELECT EmailID, EmailAddress, em.EmailTypeID, EmailTypeDescription, Valid
                         FROM tblEmail AS em
                                  INNER JOIN tblEmailTypes AS et ON em.EmailTypeID = et.EmailTypeID
                         WHERE em.EmployeeID = '${employee_id}'`
                    ).then((result) => {
                        return result.recordsets[0];
                    }).catch((e) => {
                        console.error(e);
                        return [];
                    });
                    let phone_numbers = database.executeQuery(
                        `SELECT PhoneNumberID, PhoneNumber, pn.PhoneTypeID, PhoneTypeDescription, Valid
                         FROM tblPhoneNumbers AS pn
                                  INNER JOIN tblPhoneTypes AS pt ON pn.PhoneTypeID = pt.PhoneTypeID
                         WHERE pn.EmployeeID = '${employee_id}'`
                    ).then((result) => {
                        return result.recordsets[0];
                    }).catch((e) => {
                        console.error(e);
                        return [];
                    });
                    basic_info = await basic_info;
                    res.status(200).send(
                        {
                            status: "success",
                            content: {
                                EmployeeID: employee_id,
                                FirstName: basic_info["FirstName"],
                                LastName: basic_info["LastName"],
                                Username: basic_info["Username"],
                                RoleName: basic_info["RoleName"],
                                RoleDescription: basic_info["RoleDescription"],
                                EmploymentStatus: basic_info["EmploymentStatus"],
                                StartDate: basic_info["StartDate"],
                                EndDate: basic_info["EndDate"],
                                Emails: await emails,
                                PhoneNumbers: await phone_numbers
                            }
                        }
                    );
                }
                else {
                    return_498(res);
                }
            }).catch((e) => {
                console.error(e);
                return_500(res);
            })
        }
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        }
        else {
            return_500(res);
        }
    }
});

app.post('/user_role_change', (req, res) => {
    try {
        const session_id = req.header("session_id");
        const target_employee_id = req.header("target_employee_id");
        const role = req.header("role");

        if (session_id === undefined) {
            res.status(403).send(
                {
                    status: "error",
                    reason: "Missing session_id in headers"
                }
            );
        }
        else if (target_employee_id === undefined) {
            return_400(res, "Missing target_employee_id in headers");
        }
        else if (role === undefined) {
            return_400(res, "Missing role in headers")
        }
        else if (!target_employee_id.match(/^[A-Za-z0-9]+$/) || target_employee_id.length > 50) {
            return_400(res, "Invalid target_employee_id format");
        }
        else if (!Object.getOwnPropertyNames(user_roles).includes(role)) {
            return_400(res, "Invalid role");
        }
        else {
            database.sessionToEmployeeID(session_id).then(async (employee_id) => {
                if (employee_id === target_employee_id) {
                    return_400(res, "Cannot change users' own role");
                }
                else if (employee_id) {
                    let target_role = database.executeQuery(
                        `SELECT RoleID FROM tblUsers WHERE EmployeeID = '${target_employee_id}'`
                    ).then((result) => {
                        if (result.rowsAffected[0] === 1) {
                            return result.recordsets[0][0]["RoleID"]
                        }
                        else {
                            return Infinity;
                        }
                    }).catch((e) => {
                        console.error(e);
                        return Infinity;
                    });
                    let user_role = database.executeQuery(
                        `SELECT RoleID FROM tblUsers WHERE EmployeeID = '${employee_id}'`
                    ).then((result) => {
                        if (result.rowsAffected[0] === 1) {
                            return result.recordsets[0][0]["RoleID"]
                        }
                        else {
                            return Infinity;
                        }
                    }).catch((e) => {
                        console.error(e);
                        return Infinity;
                    });
                    target_role = await target_role;
                    user_role = await user_role;
                    target_role = Number(target_role);
                    user_role = Number(user_role);

                    if (target_role === Infinity || user_role === Infinity) {
                        return_400(res, "Bad target_employee_id")
                    }
                    else if (target_role <= user_role) {
                        res.status(403).send(
                            {
                                status: "error",
                                reason: "Insufficient user permission to change target_employee_id"
                            }
                        );
                    }
                    else if (Number(role) < user_role) {
                        res.status(403).send(
                            {
                                status: "error",
                                reason: "Insufficient user permission to elevate target to role"
                            }
                        );
                    }
                    else {
                        database.executeQuery(
                            `UPDATE tblUsers SET RoleID = '${user_roles[role]}' WHERE EmployeeID = '${target_employee_id}'`
                        ).then(() => {
                            res.status(200).send(
                                {
                                    status: "success"
                                }
                            );
                        }).catch((e) => {
                            console.error(e);
                            return_500(res);
                        });
                    }
                }
                else {
                    return_498(res);
                }
            }).catch((e) => {
                console.error(e);
                return_500(res);
            })
        }
    }
    catch (e) {
        if (e instanceof TypeError) {
            return_400(res, "Invalid query parameters");
        }
        else {
            return_500(res);
        }
    }
});

module.exports = app;
