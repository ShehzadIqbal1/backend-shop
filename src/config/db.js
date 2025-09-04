const mongoose = require('mongoose');
const connectDB = async (uri) => {
await mongoose.connect(uri, {
useNewUrlParser: true,
useUnifiedTopology: true,
});
2
console.log('MongoDB connected');
};
module.exports = connectDB;