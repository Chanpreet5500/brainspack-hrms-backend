
export const ResponseMessages = {
    USER: {
        CREATED: "User created successfully",
        UPDATED: "User updated successfully",
        DELETED: "User deleted successfully",
        FAILED_CREATE: 'Failed to create user',
        FAILED_UPDATE: 'Failed to update the user',
        FAILED_DELETE: 'Failed to delete the user',
        FAILED_FETCH: 'Failed to fetch users',
    },
    GENERAL: {
        NOT_FOUND: "User with this ID not found",
        INVALID_ID: 'Invalid ID',
        EMAIL_ALREADY_EXISTS: "Email Already registered"
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
        INVALID_STATUS: `Invalid status. Status must be either "Approved" or "Rejected"`
    }

};


