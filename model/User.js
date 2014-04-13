var userSchema = mongoose.Schema({
    'name': {type:String, index: true},
    'username':  {type: String, index: true},
    'email':{type:String, index: true},
    'password':  {type: String},
    'formCompleted':  {type: Boolean, default:false},
    'linkedinId':{type:String},
    'validationToken':{type:String},
    'isActive':{type:Boolean, default:false},
    'skills':{type:[]},
    'tools':{type:[]},
    'funct':{type:String},
    'department':{type:String},
    'createdAt': {type: Date,    default: function () { return new Date;} },
});


userSchema.methods.validPassword=function(password){
    return this.password === password;
};

User = mongoose.model('User', userSchema);



// get account objects for a set of account ids
User.getAccountsByIds = function (ids, callback) {
    Person.find({_id: {$in: ids}}, function (err, accounts){
        callback(accounts);
    });
};



