
export const ResponseMessages = {
    USER: {
        CREATED: "User created successfully",
        UPDATED: "User updated successfully",
        DELETED: "User deleted successfully",
        FAILED_CREATE: 'Failed to create user',
        FAILED_UPDATE: 'Failed to update the user',
        FAILED_DELETE: 'Failed to delete the user',
        FAILED_FETCH: 'Failed to fetch the users',
    },
    GENERAL: {
        NOT_FOUND: "User with this ID not found",
        INVALID_ID: 'Invalid ID',
        EMAIL_ALREADY_EXISTS: "Email Already registered",
        EMAIL_NOT_FOUND: "User with this email not found"
    },
    VALIDATION: {
        FIRST_NAME_INVALID: 'First name should only contain alphabets and spaces',
        LAST_NAME_INVALID: 'Last name should only contain alphabets and spaces',
    },
    LEAVE: {
        CREATED: "Leave request added successfully",
        UPDATED: "Leave status updated successfully",
        FAILED_CREATE: "Failed to create the Leave",
        FAILED_FETCH: "Failed to fetch leaves",
        FAILED_UPDATE: "Failed to update the leave status",
        INVALID_STATUS: `Invalid status. Status must be either "approved" or "rejected"`
    },
    LEAVETYPE: {
        CREATED: "Leave type created successfully",
        FAILED_CREATE: "Failed to create the Leave type",
        FAILED_FETCH: 'Failed to fetch the Leave types',
        TYPE_ALREADY_EXISTS: "Leave type already exists",
    },
    LEAVEPOLICY: {
        CREATED: 'Leave policy created successfully',
        UPDATED: "Leave policy updated successfully",
        FAILED_CREATE: "Failed to create the Leave policy",
        FAILED_UPDATE: "Failed to update the leave policy",
        POLICIY_ALREADY_EXISTS: "Leave policy already exists",
        NOT_FOUND: "Leave policy not found",
        FAILED_FETCH: 'Failed to fetch the Leave policies',
    },
    LEAVEBALANCE: {
        FAILED_FETCH: "Failed to fetch the leave Balance"
    },
    HOLIDAY: {
        CREATED: "Holiday is successfully added",
        UPDATED: "Holiday is successfully updated",
        DELETED: "Holiday is successfully deleted",
        FAILED_FETCH: "faild to fetch the holidays",
        FAILED_CREATE: "faild to create the holiday",
        FAILED_UPDATE: "faild to update the holiday",
        FAILED_DELETE: "faild to delete the holiday",
        NOT_FOUND: "Holiday with this id not found"
    }

};


