const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    created_time: { type: Date, required: true, default: Date.now },
    updated_time: { type: Date, required: true, default: Date.now },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    employee_name: String,
    employee_age: Number,
    employee_salary: Number,
    email: { type: String, required: true, unique: true },
    contactNumber: String,
    age: Number,
    dob: String,
    salary: Number,
    address: String,
    S_No: Number,
    surname: String,
});


module.exports = mongoose.model('Employee', employeeSchema);