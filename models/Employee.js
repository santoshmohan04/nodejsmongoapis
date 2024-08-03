const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeSchema = new Schema({
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
}, { collection: 'employeesdata' });

const Employee = mongoose.model('Employee', employeeSchema);

async function findEmployee() {
    try {
        const employee = await Employee.findOne();
        console.log(employee);
        return employee;
    } catch (error) {
        console.error('Error finding employee:', error);
        throw error;
    }
}

module.exports = findEmployee;