// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BloodBank {
    address public admin;
    uint public totalDonors;
    uint public totalPatients;
    uint public totalHospitals;
    uint public totalBloodDonated;

    address[] public donorAddresses;
    address[] public patientAddresses;

    enum BloodType { A, B, AB, O }

    struct Donor {
        string name;
        BloodType bloodType;
        bool isRegistered;
    }

    struct Patient {
        string name;
        BloodType bloodType;
        bool isRegistered;
    }

    struct Hospital {
        string name;
        address location;
        bool isRegistered;
    }

    struct Request {
    bool isResponded;
    BloodType bloodType;
    uint amount;
    bool response;
   }

   
    mapping(address => Donor) public donors;
    mapping(address => Patient) public patients;
    mapping(address => Hospital) public hospitals;
    mapping(address => bool) public allowedDonors;
    mapping(address => bool) public allowedPatients;
    mapping(address => bool) public bloodRequests;
    mapping(BloodType => uint) public bloodInventory;
    mapping(address => mapping(BloodType => uint)) public donorBalances;
    mapping(address => mapping(BloodType => Request[])) public patientRequests;
    mapping(address => Request[]) public patientResponses; // Add mapping to store responses

    event AdminLoggedIn(address admin);
    event DonorRegistered(address donor, string name, BloodType bloodType);
    event PatientRegistered(address patient, string name, BloodType bloodType);
    event HospitalRegistered(address hospital, string name, address location);
    event BloodDonated(address donor, BloodType bloodType, uint amount);
    event BloodRequested(address patient, BloodType bloodType);
    event DonorPermissionGranted(address donor);
    event DonorPermissionRevoked(address donor);
    event PatientPermissionGranted(address patient);
    event PatientPermissionRevoked(address patient);
    event RequestResponded(address patient, bool response, BloodType bloodType, uint amount);
    event BloodRequested(address patient, Request request);

    modifier isAdmin() {
        require(msg.sender == admin, "Only the admin can perform this action");
        _;
    }
    modifier onlyAdminOrPatient() {
        require(msg.sender == admin || allowedPatients[msg.sender], "Permission denied");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function adminLogin() public returns (bool) {
        emit AdminLoggedIn(msg.sender);
        return true;
    }

    function grantDonorPermission(address donorAddress) public {
        require(!allowedDonors[donorAddress], "Donor already has permission");
        allowedDonors[donorAddress] = true;
        emit DonorPermissionGranted(donorAddress);
    }

    function revokeDonorPermission(address donorAddress) public {
        require(allowedDonors[donorAddress], "Donor does not have permission");
        allowedDonors[donorAddress] = false;
        emit DonorPermissionRevoked(donorAddress);
    }

    function isDonorAllowed(address donorAddress) public view returns (bool) {
        return allowedDonors[donorAddress];
    }

    function grantPatientPermission(address patientAddress) public {
        require(!allowedPatients[patientAddress], "Patient already has permission");
        allowedPatients[patientAddress] = true;
        emit PatientPermissionGranted(patientAddress);
    }

    function revokePatientPermission(address patientAddress) public {
        require(allowedPatients[patientAddress], "Patient does not have permission");
        allowedPatients[patientAddress] = false;
        emit PatientPermissionRevoked(patientAddress);
    }

    function isPatientAllowed(address patientAddress) public view returns (bool) {
        return allowedPatients[patientAddress];
    }

    function addPatient(address patientAddress, string memory name, BloodType bloodType) public isAdmin {
        require(!patients[patientAddress].isRegistered, "Patient already registered");
        patients[patientAddress] = Patient(name, bloodType, true);
        totalPatients++;
        emit PatientRegistered(patientAddress, name, bloodType);
    }

    function addHospital(address hospitalAddress, string memory name, address location) public isAdmin {
        require(!hospitals[hospitalAddress].isRegistered, "Hospital already registered");
        hospitals[hospitalAddress] = Hospital(name, location, true);
        totalHospitals++;
        emit HospitalRegistered(hospitalAddress, name, location);
    }

    function registerAsDonor(string memory name, BloodType bloodType) public {
        donors[msg.sender] = Donor(name, bloodType, true);
        donorAddresses.push(msg.sender);
        totalDonors++;
        emit DonorRegistered(msg.sender, name, bloodType);
    }

    function registerAsPatient(string memory name, BloodType bloodType) public {
        patients[msg.sender] = Patient(name, bloodType, true);
        patientAddresses.push(msg.sender);
        totalPatients++;
        emit PatientRegistered(msg.sender, name, bloodType);
    }

    function locateHospitalToDonate(address hospitalAddress) public view returns (string memory name, address location) {
        require(hospitals[hospitalAddress].isRegistered, "Hospital not registered");
        return (hospitals[hospitalAddress].name, hospitals[hospitalAddress].location);
    }
    function donateBlood(BloodType bloodType, uint amount) public {
    require(donors[msg.sender].isRegistered, "Donor not registered");       
    // Assuming a simplified storage for blood donation amounts
    donorBalances[msg.sender][bloodType]++;
    totalBloodDonated += amount;  // Increment the total blood donated
    emit BloodDonated(msg.sender, bloodType, amount);
}

    // Function to get the total amount of blood donated
    function getTotalBloodDonated() public view returns (uint) {
        return totalBloodDonated;
    }

    // Function to get the blood inventory for a specific blood type
    function getBloodInventory(BloodType bloodType) public view returns (uint) {
        return bloodInventory[bloodType];
    }

function requestBlood(BloodType bloodType, uint amount) public {
    require(patients[msg.sender].isRegistered, "You need to register as a patient first");
    // Create a new request object
    Request memory newRequest = Request({
        isResponded: false,
        bloodType: bloodType,
        amount: amount,
        response: false
    });
    // Add the request to the patient's requests
    patientRequests[msg.sender][newRequest.bloodType].push(newRequest);
    // Emit blood request event with the entire request object
    emit BloodRequested(msg.sender, newRequest);
}

function getPatientRequests(address patientAddress, BloodType bloodType) public view returns (Request[] memory) {
    Request[] storage requests = patientRequests[patientAddress][bloodType];
    Request[] memory result = new Request[](requests.length);
    for (uint i = 0; i < requests.length; i++) {
        result[i] = requests[i];
    }
    return result;
}

 function respondToRequest(address patientAddress, BloodType bloodType, bool response) public {
    require(patients[patientAddress].isRegistered, "Patient not registered");
    require(patientRequests[patientAddress][bloodType].length > 0, "No blood donation request found");

    // Get the last request made by the patient
    Request storage lastRequest = patientRequests[patientAddress][bloodType][patientRequests[patientAddress][bloodType].length - 1];

    // Update the response for the last request
    lastRequest.isResponded = true;
    lastRequest.response = response;

    // Store the response
    patientResponses[patientAddress].push(lastRequest);

    // Emit event for responding to blood donation request
    emit RequestResponded(patientAddress, response, lastRequest.bloodType, lastRequest.amount);
}

    // Add a function to retrieve patient responses
    function getPatientResponses(address patientAddress) public view returns (Request[] memory) {
        return patientResponses[patientAddress];
    }
        function getRegisteredUsers() public view returns (address[] memory registeredDonors, address[] memory registeredPatients) {
        return (donorAddresses, patientAddresses);
    }
}

