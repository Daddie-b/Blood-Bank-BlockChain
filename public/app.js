let web3;

// Check if Web3 is injected by Metamask
if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    // Request account access if needed
    window.ethereum.enable().catch(error => {
        console.error('Error enabling Metamask accounts:', error.message);
    });
} else {
    // Handle the case where the user doesn't have Metamask installed or not connected to the Ethereum network
    alert("Please install Metamask to use this application.");
}

// Contract Address and ABI (replace with your actual deployed contract address and ABI)
const contractAddress = '0x399bbF80299a58e697a3028927f5Ee4c0d6fFb83';
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "admin",
				"type": "address"
			}
		],
		"name": "AdminLoggedIn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "BloodDonated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			}
		],
		"name": "BloodRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			},
			{
				"components": [
					{
						"internalType": "bool",
						"name": "isResponded",
						"type": "bool"
					},
					{
						"internalType": "enum BloodBank.BloodType",
						"name": "bloodType",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "response",
						"type": "bool"
					}
				],
				"indexed": false,
				"internalType": "struct BloodBank.Request",
				"name": "request",
				"type": "tuple"
			}
		],
		"name": "BloodRequested",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			}
		],
		"name": "DonorPermissionGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			}
		],
		"name": "DonorPermissionRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "donor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			}
		],
		"name": "DonorRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "hospital",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "location",
				"type": "address"
			}
		],
		"name": "HospitalRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			}
		],
		"name": "PatientPermissionGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			}
		],
		"name": "PatientPermissionRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			}
		],
		"name": "PatientRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "patient",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "response",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "RequestResponded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "hospitalAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "location",
				"type": "address"
			}
		],
		"name": "addHospital",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "patientAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			}
		],
		"name": "addPatient",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "adminLogin",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "allowedDonors",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "allowedPatients",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "bloodInventory",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "bloodRequests",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "donateBlood",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "donorAddresses",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "donorBalances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "donors",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			}
		],
		"name": "getBloodInventory",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "patientAddress",
				"type": "address"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			}
		],
		"name": "getPatientRequests",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "isResponded",
						"type": "bool"
					},
					{
						"internalType": "enum BloodBank.BloodType",
						"name": "bloodType",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "response",
						"type": "bool"
					}
				],
				"internalType": "struct BloodBank.Request[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "patientAddress",
				"type": "address"
			}
		],
		"name": "getPatientResponses",
		"outputs": [
			{
				"components": [
					{
						"internalType": "bool",
						"name": "isResponded",
						"type": "bool"
					},
					{
						"internalType": "enum BloodBank.BloodType",
						"name": "bloodType",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "response",
						"type": "bool"
					}
				],
				"internalType": "struct BloodBank.Request[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRegisteredUsers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "registeredDonors",
				"type": "address[]"
			},
			{
				"internalType": "address[]",
				"name": "registeredPatients",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalBloodDonated",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "donorAddress",
				"type": "address"
			}
		],
		"name": "grantDonorPermission",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "patientAddress",
				"type": "address"
			}
		],
		"name": "grantPatientPermission",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hospitals",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "location",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "donorAddress",
				"type": "address"
			}
		],
		"name": "isDonorAllowed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "patientAddress",
				"type": "address"
			}
		],
		"name": "isPatientAllowed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "hospitalAddress",
				"type": "address"
			}
		],
		"name": "locateHospitalToDonate",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "location",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "patientAddresses",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "patientRequests",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isResponded",
				"type": "bool"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "response",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "patientResponses",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isResponded",
				"type": "bool"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "response",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "patients",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			}
		],
		"name": "registerAsDonor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			}
		],
		"name": "registerAsPatient",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "requestBlood",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "patientAddress",
				"type": "address"
			},
			{
				"internalType": "enum BloodBank.BloodType",
				"name": "bloodType",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "response",
				"type": "bool"
			}
		],
		"name": "respondToRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "donorAddress",
				"type": "address"
			}
		],
		"name": "revokeDonorPermission",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "patientAddress",
				"type": "address"
			}
		],
		"name": "revokePatientPermission",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalBloodDonated",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalDonors",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalHospitals",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalPatients",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] ;
const bloodBankContract = new web3.eth.Contract(contractABI, contractAddress);

function redirectTo(page) {
    window.location.href = page;
}

// Function to handle admin login
async function adminLogin() {
    try {
        // Get the entered admin address
        const adminAddress = document.getElementById('adminAddress').value;

        // Validate admin address (replace this with your actual validation logic)
        const isValidAdmin = await isValidAdminAddress(adminAddress);

        if (isValidAdmin) {
            alert('Admin Login Successful');
            // Redirect to the admin dashboard after login
            redirectTo('admin_dashboard.html');
        } else {
            alert('Invalid Admin Address');
        }
    } catch (error) {
        console.error('Error logging in as admin:', error.message);
    }
}

// Function to validate admin address (replace this with your actual validation logic)
async function isValidAdminAddress(adminAddress) {
    // For simplicity, let's assume any non-empty admin address is valid
    return adminAddress.trim() !== '';
}

async function registerDonor() {
    await registerUser('Donor');
}

async function registerPatient() {
    await registerUser('Patient');
}

// Function to register a user (donor or patient)
async function registerUser() {
    try {
        const userName = document.getElementById('userName').value;
        const userType = document.getElementById('userType').value;

        // Get the selected blood type from the dropdown (select) element
        const bloodTypeSelect = document.getElementById('bloodType');
        const selectedBloodType = bloodTypeSelect.options[bloodTypeSelect.selectedIndex].value;

        // Define a mapping of blood type names to numeric values
        const bloodTypeMapping = {
            'A': 0,
            'B': 1,
            'AB': 2,
            'O': 3
        };

        // Convert the selectedBloodType to the corresponding numeric value
        const bloodTypeNumericValue = bloodTypeMapping[selectedBloodType.toUpperCase()];

        // Define the registration method based on the user type
        let registrationMethod;
        if (userType === 'Donor') {
            registrationMethod = bloodBankContract.methods.registerAsDonor;
        } else if (userType === 'Patient') {
            registrationMethod = bloodBankContract.methods.registerAsPatient;
        } else {
            // Handle other user types or show an error
            alert('Invalid user type selected.');
            return;
        }

        // Get the default account
        const defaultAccount = await web3.eth.getAccounts().then(accounts => accounts[0]);

        // Call the appropriate registration method in your smart contract
        const transaction = await registrationMethod(userName, bloodTypeNumericValue).send({ from: defaultAccount });

        console.log('Transaction Hash:', transaction.transactionHash);
        console.log('Gas Used:', transaction.gasUsed);
        // Check if the transaction was successful
        if (transaction.status) {
            alert(`${userType} registered successfully!`);
            // Redirect to the appropriate login page based on the user type
            if (userType === 'Donor') {
                redirectTo('donor_login.html');
            } else if (userType === 'Patient') {
                redirectTo('patient_login.html');
            } else {
                // Handle other user types or redirect accordingly
            }
        } else {
            alert('Transaction failed. Please check the transaction status.');
        }
    } catch (error) {
        console.error('Error registering user:', error.message);

        // Additional error handling and logging
        if (error.message.includes('insufficient funds')) {
            alert('Insufficient funds. Please make sure your account has enough ETH.');
        } else if (error.message.includes('gas too low')) {
            alert('Gas limit too low. Please increase the gas limit.');
        } else {
            alert('An unexpected error occurred. Please check the console for more details.');
        }
    }
}

// Function to handle granting user permission by admin
async function grantUserPermission() {
    try {
		
        const { registeredDonors, registeredPatients } = await bloodBankContract.methods.getRegisteredUsers().call();

        // Display the details of registered donors on the admin_dashboard.html
        const donorsDetailsList = document.getElementById('donorsDetailsList');
        donorsDetailsList.innerHTML = '';
        for (const donorAddress of registeredDonors) {
            const donorDetails = await bloodBankContract.methods.donors(donorAddress).call();
            const listItem = document.createElement('li');
            listItem.textContent = `Donor at ${donorAddress}: Name - ${donorDetails.name}, Blood Type - ${donorDetails.bloodType}`;
            donorsDetailsList.appendChild(listItem);
        }

        // Display the details of registered patients on the admin_dashboard.html
        const patientsDetailsList = document.getElementById('patientsDetailsList');
        patientsDetailsList.innerHTML = '';
        for (const patientAddress of registeredPatients) {
            const patientDetails = await bloodBankContract.methods.patients(patientAddress).call();
            const listItem = document.createElement('li');
            listItem.textContent = `Patient at ${patientAddress}: Name - ${patientDetails.name}, Blood Type - ${patientDetails.bloodType}`;
            patientsDetailsList.appendChild(listItem);
        }

        // Additional logic for granting user permission...
        const userAddress = prompt('Enter user address:'); // Prompt for simplicity, replace with your UI logic
        const isDonor = registeredDonors.includes(userAddress);
        const isPatient = registeredPatients.includes(userAddress);

        if (isDonor) {
            await bloodBankContract.methods.grantDonorPermission(userAddress).send({ from: userAddress });
            alert('Donor Permission Granted');
        } else if (isPatient) {
            await bloodBankContract.methods.grantPatientPermission(userAddress).send({ from: userAddress });
            alert('Patient Permission Granted');
        } else {
            alert('User not found in the registered donors or patients list');
        }
    } catch (error) {
        console.error('Error during granting user permission:', error.message);
    }
}

// Function to handle donor login
async function donorLogin() {
    try {
        const donorAddress = document.getElementById('donorAddress').value;
        const isDonorAllowed = await bloodBankContract.methods.isDonorAllowed(donorAddress).call();
        
        if (isDonorAllowed) {
            alert('Donor Login Successful');
            // Redirect to the donor dashboard or other donor-specific pages
            redirectTo('donor_dashboard.html');
        } else {
            alert('Donor Login Permission Denied. Please contact the admin.');
        }
    } catch (error) {
        console.error('Error during donor login:', error.message);
    }
}

// Function to handle patient login
async function patientLogin() {
    try {
        const patientAddress = document.getElementById('patientAddress').value;
        const isPatientAllowed = await bloodBankContract.methods.isPatientAllowed(patientAddress).call();
        
        if (isPatientAllowed) {
            alert('Patient Login Successful');
            // Redirect to the patient dashboard or other patient-specific pages
            redirectTo('patient_dashboard.html');
        } else {
            alert('Patient Login Permission Denied. Please contact the admin.');
        }
    } catch (error) {
        console.error('Error during patient login:', error.message);
    }
}

// Function to handle blood donation by donors

//add hospital
async function addHospital() {
    try {
        const hospitalName = prompt('Enter hospital name:');
        const hospitalLocation = prompt('Enter hospital location (address):');

        // Call the smart contract function for adding a hospital
        await bloodBankContract.methods.addHospital(hospitalLocation, hospitalName).send({ from: getCurrentUserAddress() });

        alert('Hospital Added Successfully');
    } catch (error) {
        console.error('Error during adding hospital:', error.message);
    }
}
// Function to get the current user's Ethereum address using web3.js
function getCurrentUserAddress() {
    // Assuming you have web3 available
    if (window.ethereum) {
        return window.ethereum.selectedAddress;
    } else {
        console.error('Web3 provider not found');
        return null;
    }
}


async function donateBlood() {
    try {
        const donorAddress = getCurrentUserAddress();
        const bloodType = prompt('Enter the blood type (A, B, AB, O):'); // Prompt for blood type
        const donationAmount = prompt('Enter the amount of blood to donate:'); // Prompt for amount

        // Convert the donationAmount to a number
        const amount = parseInt(donationAmount);

        // Call the smart contract function for blood donation
        await bloodBankContract.methods.donateBlood(bloodType, amount).send({ from: donorAddress });

		displayDonationDetails(donorAddress, bloodType, amount);
        alert('Blood Donation Successful');
    } catch (error) {
        console.error('Error during blood donation:', error.message);
    }
}
	// Function to dynamically display donation details
	function displayDonationDetails(donorAddress, bloodType, amount) {
		const donationDetailsList = document.getElementById('donationDetailsList');
		const listItem = document.createElement('li');
		listItem.textContent = `Donation from donor at ${donorAddress}. Blood Type: ${bloodType}, Amount: ${amount}`;
		donationDetailsList.appendChild(listItem);

		// Store donation details in local storage
		const donationKey = `donation_${new Date().getTime()}`;
		const donationData = { donorAddress, bloodType, amount };
		localStorage.setItem(donationKey, JSON.stringify(donationData));
	}

	function displayStoredDonationDetails() {
		const donationDetailsList = document.getElementById('donationDetailsList');
		const totalDonatedElement = document.getElementById('totalDonated'); // Add this line
	
		// Check if the element exists before attempting to append
		if (donationDetailsList) {
			let totalAmount = 0; // Initialize total amount
	
			// Iterate through local storage and display stored donation details
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key.startsWith('donation_')) {
					const donationData = JSON.parse(localStorage.getItem(key));
	
					// Create list item and append it to the list
					const listItem = document.createElement('li');
					listItem.textContent = `Donation from donor at ${donationData.donorAddress}. Blood Type: ${donationData.bloodType}, Amount: ${donationData.amount}`;
					donationDetailsList.appendChild(listItem);
	
					// Update total amount
					totalAmount += donationData.amount;
				}
			}
	
			// Display the total amount
			if (totalDonatedElement) {
				totalDonatedElement.textContent = `Total Donated: ${totalAmount} units`; // Update the content
			}
		} else {
			console.error('Element with ID "donationDetailsList" not found.');
		}
	}
	
	

	// Function to request blood
	async function requestBlood() {
		try {
			const patientAddress = getCurrentUserAddress();
			
			// Check if the patient address is available
			if (!patientAddress) {
				console.error('Patient address not available');
				return;
			}

			// Prompt the user for the blood type and amount
			const bloodType = prompt('Enter blood type (A, B, AB, O):');
			const amount = parseInt(prompt('Enter the amount of blood requested:'));

			// Call the smart contract function for blood request with specified blood type and amount
			await bloodBankContract.methods.requestBlood(bloodType, amount).send({ from: patientAddress });

			alert('Blood Request Sent');
		} catch (error) {
			console.error('Error during blood request:', error.message);
		}
	}

// Function to display blood donation requests
async function displayBloodRequests(targetElementId) {
    try {
        const bloodRequestsList = document.getElementById(targetElementId);

        if (!bloodRequestsList) {
            console.error(`Element with id '${targetElementId}' not found.`);
            return;
        }

        bloodRequestsList.innerHTML = '';

        const { registeredPatients } = await bloodBankContract.methods.getRegisteredUsers().call();

        for (const patientAddress of registeredPatients) {
            // Assuming BloodType.A is represented by the numeric value 0
            const bloodType = 0;
            const requests = await bloodBankContract.methods.getPatientRequests(patientAddress, bloodType).call();

            for (const request of requests) {
                if (!request.isResponded) {
                    const listItem = document.createElement('li');
                    listItem.textContent = `Blood request from patient at ${patientAddress}. Blood Type: ${request.bloodType}`;
                    bloodRequestsList.appendChild(listItem);
                }
            }
        }
    } catch (error) {
        console.error('Error during displaying blood donation requests:', error.message);
    }
}


	function mapBloodType(bloodTypeString) {
		const bloodTypeMap = {
			'A': 0,
			'B': 1,
			'AB': 2,
			'O': 3,
		};
		return bloodTypeMap[bloodTypeString];
	}

	// Function to display the response on the patient dashboard
	function displayResponse(patientAddress, response) {
		const patientDashboard = document.getElementById('patientDashboard');
		const responseMessage = response ? 'approved' : 'rejected';
		const listItem = document.createElement('li');
		listItem.textContent = `Your blood donation request has been ${responseMessage}.`;
		patientDashboard.appendChild(listItem);
	}

	

	async function respondToRequest() {
		try {
			const userAddress = getCurrentUserAddress();
	
			// Check if the user address is valid
			if (!userAddress) {
				alert('Invalid user address. Please make sure MetaMask is connected.');
				return;
			}
	
			const patientAddress = prompt('Enter patient address:');
	
			// Check if the patient address is valid
			if (!web3.utils.isAddress(patientAddress)) {
				alert('Invalid patient address. Please try again.');
				return;
			}
	
			const bloodType = prompt('Enter blood type (A, B, AB, O):');
			const response = confirm('Do you want to approve the blood donation request?');
	
			// Call the smart contract function for responding to blood donation requests
			await bloodBankContract.methods.respondToRequest(patientAddress, bloodType, response).send({ from: userAddress });
	
			alert('Your response has been sent.');

		} catch (error) {
			console.error('Error during responding to blood donation requests:', error.message);
		}
	}
	
	async function displayPatientResponses() {
		try {
			const { registeredPatients } = await bloodBankContract.methods.getRegisteredUsers().call();
	
			// Filter patients with responses
			const patientsWithResponses = await Promise.all(
				registeredPatients.map(async (patientAddress) => {
					const responses = await bloodBankContract.methods.getPatientResponses(patientAddress).call();
					return { patientAddress, hasResponses: responses.length > 0 };
				})
			);
	
			// Filter only patients with responses
			const patientsWithResponsesFiltered = patientsWithResponses.filter((patient) => patient.hasResponses);
	
			// Check if there are patients with responses
			if (patientsWithResponsesFiltered.length === 0) {
				console.log('No patients with responses found.');
				return;
			}
	
			// Prompt the user to select a patient with responses
			const selectedPatient = prompt('Select a patient with responses:\n' +
				patientsWithResponsesFiltered.map((patient, index) => `${index + 1}. ${patient.patientAddress}`).join('\n'));
	
			// Check if the user selected a valid option
			if (!selectedPatient || isNaN(selectedPatient) || selectedPatient < 1 || selectedPatient > patientsWithResponsesFiltered.length) {
				console.log('Invalid selection. Please select a valid option.');
				return;
			}
	
			const chosenPatient = patientsWithResponsesFiltered[selectedPatient - 1].patientAddress;
			const responses = await bloodBankContract.methods.getPatientResponses(chosenPatient).call();
	
			const patientDashboard = document.getElementById('patientDashboard');
	
			while (patientDashboard.firstChild) {
				patientDashboard.removeChild(patientDashboard.firstChild);
			}
	
			responses.forEach((response) => {
				const responseMessage = response.response ? 'approved' : 'rejected';
				const listItem = document.createElement('li');
				listItem.textContent = `Blood donation request from patient at ${chosenPatient} has been ${responseMessage}.`;
				patientDashboard.appendChild(listItem);
			});
		} catch (error) {
			console.error('Error during displaying patient responses:', error.message);
		}
	}
	
	
	
	
	
//0x399bbF80299a58e697a3028927f5Ee4c0d6fFb83
//0x399bbF80299a58e697a3028927f5Ee4c0d6fFb83  