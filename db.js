var mongoose = require('mongoose');
var encodedPwd = encodeURIComponent("Max_1234");
mongoose.connect(`mongodb://user-cli:${encodedPwd}@ds016058.mlab.com:16058/security-jwt-database`);