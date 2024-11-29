export default () => ({
    database: {
        connectionString: process.env.MONGO_URL,
    },
    companyMail: {
        address: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD
    }
});