# Blood-Bank-BlockChain
blockchain blood bank management system
This is a smart contract for a Blood Bank Management System implemented on the Ethereum blockchain. The system allows users to register as donors, patients, and hospitals, facilitating the donation and request of blood.

Smart Contract Overview

Admin Functions
adminLogin(): Allows the admin to log in.
grantDonorPermission(address donorAddress): Grants permission to a donor.
grantPatientPermission(address patientAddress): Grants permission to a patient.


Donor Functions
registerAsDonor(string memory name, BloodType bloodType): Registers a donor.
donateBlood(BloodType bloodType, uint amount): Allows a donor to donate blood.
getTotalBloodDonated(): Gets the total amount of blood donated.
getBloodInventory(BloodType bloodType): Gets the blood inventory for a specific blood type.

Patient Functions
registerAsPatient(string memory name, BloodType bloodType): Registers a patient.
requestBlood(BloodType bloodType, uint amount): Allows a patient to request blood.
getPatientRequests(address patientAddress, BloodType bloodType): Gets a patient's blood donation requests.


Common Functions
getRegisteredUsers(): Gets the addresses of registered donors and patients.

Readme Instructions

Smart Contract Deployment:
Deploy the smart contract on the Ethereum blockchain.
The deployer becomes the admin.

Admin Login:
Call the adminLogin function to log in as the admin.
User Registration:
Donors and patients can register using registerAsDonor and registerAsPatient, respectively.

Permissions:
Admin can grant and revoke permissions for donors and patients.

Blood Donation:
Donors can donate blood using the donateBlood function.

Blood Request:
Patients can request blood using the requestBlood function.

Data Retrieval:
Retrieve information on registered users, total blood donated, and blood inventory using appropriate functions.

Events:
The contract emits events for various actions. Monitor these events for system activity.

Web Interface:
Develop a user-friendly web interface to interact with the smart contract.
Use web3.js or a similar library for frontend-backend interaction.
Styling:

Customize the provided HTML and CSS for a visually appealing and user-friendly experience.
