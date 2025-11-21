export default () => ({
    mongo: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017',
        dbName: process.env.MONGO_DB_NAME || 'productdb',
        retryAttempts: parseInt(process.env.MONGO_RETRY_ATTEMPTS ?? '5'),
        retryDelay: parseInt(process.env.MONGO_RETRY_DELAY ?? '3000'),
    },
});
