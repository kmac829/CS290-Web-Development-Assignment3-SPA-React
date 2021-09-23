import mongoose from "mongoose"

// Connect to the database in the MongoDB server running locally on port 27017
mongoose.connect(
    'mongodb://localhost:27017',
    { useNewUrlParser: true }
);

// Connect to to the database
const db = mongoose.connection;

// The open event is called when the database connection opens
db.once('open', () => {
    console.log('Successfully connected to MongoDB using Mongoose!');
});

// Mongoose to create indexes
mongoose.set('useCreateIndex', true);


//* Define the schema

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: Number, required: false }
});


 // Compile the model from the schema. 
const User = mongoose.model("User", userSchema);

/**
 * Create a user
 * @param {String} name 
 * @param {Number} age 
 * @param {String} email
 * @param {number} phoneNumber 
 * @returns A promise. Resolves to the JSON object for the document created by calling save
 */
const createUser = async (name, age, email, phoneNumber) => {
    const user = new User({ name: name, age: age, email: email, phoneNumber: phoneNumber });
    // Call save to persist this object as a document in MongoDB
    return user.save();
}

/**
 * Retrive users based on the filter, projection and limit parameters
 * @param {Object} filter 
 * @param {String} projection 
 * @param {Number} limit 
 * @returns 
 */
const findUsers = async (filter, projection, limit) => {
    const query = User.find(filter)
        .select(projection)
        .limit(limit);
    return query.exec();
}
const findUsersByFilter = async (_id, name, age, email, phoneNumber, projection, limit) => {
    let filter = {}
    if (_id) filter["_id"] = _id
    if (name) filter["name"] = name
    if (age) filter["age"] = age
    if (email) filter["email"] = email
    if (phoneNumber) filter["phoneNumber"] = phoneNumber
    const query = User.find(filter)
        .select(projection)
        .limit(limit);
    return query.exec();
}

/**
 * Replace name, age, email, and phoneNumber properties with the id value 
 * @param {String} _id 
 * @param {String} name 
 * @param {Number} age 
 * @param {String} email 
 * * @param {Number} phoneNumber 
 * @returns A promise. Resolves to the number of documents modified
 */
const replaceUser = async (_id, name, age, email, phoneNumber) => {
    let userobj = (await User.find({"_id": _id}).limit(1))[0]
    if (name) userobj["name"] = name
    if (age) userobj["age"] = age
    if (email) userobj["email"] = email
    if (phoneNumber) userobj["phoneNumber"] = phoneNumber
    const result = await User.replaceOne({ _id: _id },userobj);
    return result.nModified;
}

/**
 * Delete the user with provided id value
 * @param {String} _id 
 * @returns A promise. Resolves to the count of deleted documents
 */
const deleteByFilter = async (_id, name, age, email, phoneNumber) => {
    let filter = {}
    if (_id) filter["_id"] = _id
    if (name) filter["name"] = name
    if (age) filter["age"] = age
    if (email) filter["email"] = email
    if (phoneNumber) filter["phoneNumber"] = phoneNumber
    const result = await User.deleteMany(filter);
    // Return the count of deleted document. 
    return result.deletedCount;
}

export { createUser, findUsers, replaceUser, deleteByFilter, findUsersByFilter };