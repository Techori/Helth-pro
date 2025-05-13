MongoDB Schema for RI-Medicare
1. User Schema

firstName: String (required)
lastName: String (required)
email: String (required, unique)
password: String (required)
role: String (enum: ['patient', 'hospital', 'admin', 'sales', 'crm', 'agent', 'support'])
avatar: String
date: Date (default: current date)

2. Hospital Schema

name: String (required)
address: String (required)
city: String (required)
state: String (required)
zipCode: String (required)
contactPerson: String (required)
contactEmail: String (required)
contactPhone: String (required)
status: String (enum: ['active', 'pending', 'inactive'], default: 'pending')
user: ObjectId (reference to User model)
date: Date (default: current date)

3. HealthCard Schema

cardNumber: String (required, unique)
user: ObjectId (reference to User model, required)
availableCredit: Number (required, default: 25000)
usedCredit: Number (default: 0)
status: String (enum: ['active', 'expired', 'pending'], default: 'pending')
issueDate: Date (default: current date)
expiryDate: Date (required)

4. Loan Schema

user: ObjectId (reference to User model, required)
amount: Number (required)
termMonths: Number (required)
interestRate: Number (required)
status: String (enum: ['approved', 'pending', 'rejected'], default: 'pending')
applicationDate: Date (default: current date)
approvalDate: Date
monthlyPayment: Number
remainingBalance: Number

5. Transaction Schema

user: ObjectId (reference to User model, required)
amount: Number (required)
type: String (enum: ['payment', 'refund', 'charge'], required)
description: String (required)
status: String (enum: ['completed', 'pending', 'failed'], default: 'pending')
hospital: String
date: Date (default: current date)

6. Notification Schema

user: ObjectId (reference to User model, required)
title: String (required)
message: String (required)
read: Boolean (default: false)
created_at: Date (default: current date)

