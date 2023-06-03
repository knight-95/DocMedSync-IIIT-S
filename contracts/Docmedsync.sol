// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

import {Ownable} from "./Ownable.sol";

contract Docmedsync is Ownable {
    struct Hospital {
        uint256 id;
        string name;
        string physicalAddress;
        address walletAddress;
        string License;
    }

    struct Record {
        uint256 id;
        uint256 hospitalId;
        uint256 patientId;
        string condition;
        string description;
        string allergies;
        string Document;
    }

    struct Patient {
        uint256 id;
        string name;
        string gender;
        string bloodGroup;
        string DOB;
        uint256 phoneNumber;
        uint256[] records;
        string physicalAddress;
        string profilePicture;
        address walletAddress;
    }

    struct Organization {
        uint256 id;
        string name;
        address walletAddress;
        string License;
    }

    uint256 public hospitalId = 1;
    uint256 public recordId = 1;
    uint256 public organizationId = 1;

  
    mapping(uint256 => Hospital) private hospitals;

    
    mapping(address => uint256) private hospitalToId;

    mapping(uint256 => Record) private records;


    mapping(uint256 => Patient) private patients;

    mapping(address => uint256) private patientToId;

 
    mapping(uint256 => Organization) private organizations;

  
    mapping(address => uint256) private organizationToId;

   
    mapping(uint256 => mapping(address => bool)) private authorised;

   
    function getOwner() public view returns (address) {
        return owner;
    }

  
    function isAdmin(address _admin) public view returns (bool) {
        return admin[_admin];
    }

    
    function addHospital(
        string memory name,
        string memory physicalAddress,
        address walletAddress,
        string memory license
    ) public onlyAdmin {
        require(
            hospitalToId[walletAddress] == 0,
            "Already registered as an hospital"
        );
        hospitals[hospitalId] = Hospital(
            hospitalId,
            name,
            physicalAddress,
            walletAddress,
            license
        );
        hospitalToId[walletAddress] = hospitalId;
        hospitalId++;
    }

    function getHospitalById(uint256 _id)
        public
        view
        returns (Hospital memory)
    {
        require(hospitals[_id].id != 0, "No such hospital exists");
        Hospital memory hosp = hospitals[_id];
        return hosp;
    }

   
    function getHospitalByAddress(address _address)
        public
        view
        returns (Hospital memory)
    {
        require(hospitalToId[_address] != 0, "No such hospital exists");
        uint256 _id = hospitalToId[_address];
        require(hospitals[_id].id != 0, "No such hospital exists");
        Hospital memory hosp = hospitals[_id];
        return hosp;
    }

    
    function addNewRecord(
        uint256 _hospitalId,
        uint256 _patientId,
        string memory _condition,
        string memory _description,
        string memory _allergies,
        string memory _document
    ) public onlyHospital {
        require(patients[_patientId].id != 0, "The patient does not exist");
        Record memory rec = Record(
            recordId,
            _hospitalId,
            _patientId,
            _condition,
            _description,
            _allergies,
            _document
        );
        records[recordId] = rec;
        patients[_patientId].records.push(recordId);
        recordId++;
    }

    
    function addNewPatient(
        uint256 _id,
        string memory _name,
        string memory _gender,
        string memory _bloodGroup,
        string memory _dob,
        uint256 _phoneNumber,
        string memory _physicalAddress,
        string memory _profilePicture,
        address _walletAddress
    ) public onlyHospital {
        require(
            patients[_id].id == 0 && patientToId[_walletAddress] == 0,
            "Patient already exists"
        );
        uint256[] memory _records;
        patientToId[_walletAddress] = _id;
        patients[_id] = Patient(
            _id,
            _name,
            _gender,
            _bloodGroup,
            _dob,
            _phoneNumber,
            _records,
            _physicalAddress,
            _profilePicture,
            _walletAddress
        );
    }

   
    function addOrganization(
        string memory _name,
        address _walletAddress,
        string memory _license
    ) public onlyAdmin {
        require(
            organizationToId[_walletAddress] == 0,
            "Organization already exists"
        );
        organizations[organizationId] = Organization(
            organizationId,
            _name,
            _walletAddress,
            _license
        );
        organizationToId[_walletAddress] = organizationId;

        organizationId++;
    }

    
    function getOrganizationById(uint256 _id)
        public
        view
        returns (Organization memory)
    {
        require(organizations[_id].id != 0, "No such organization exists");
        return organizations[_id];
    }

   
    function getOrganizationByAddress(address _addr)
        public
        view
        returns (Organization memory)
    {
        uint256 _id = organizationToId[_addr];
        require(
            _id != 0 && organizations[_id].id != 0,
            "No such organization exists"
        );
        return organizations[_id];
    }

    
    function addAuthByAddress(address addr) public onlyPatient {
        uint256 _id = patientToId[msg.sender];
        authorised[_id][addr] = true;
    }

    function addAuthById(uint256 _id) public onlyPatient {
        Organization memory org = organizations[_id];
        require(org.id != 0, "No such organization found");
        uint256 patientId = patientToId[msg.sender];
        authorised[patientId][org.walletAddress] = true;
    }

    function revokeAuthByAddress(address addr) public onlyPatient {
        uint256 _id = patientToId[msg.sender];
        require(authorised[_id][addr] == true, "Already not authorised");

        authorised[_id][addr] = false;
    }

    
    function revokeAuthById(uint256 _id) public onlyPatient {
        Organization memory org = organizations[_id];
        require(org.id != 0, "No such organization found");
        uint256 patientId = patientToId[msg.sender];

        require(
            authorised[patientId][org.walletAddress] == true,
            "Already not authorised"
        );
        authorised[patientId][org.walletAddress] = false;
    }

    
    function getPatientDetails(uint256 _id)
        public
        view
        onlyAuthorised(_id)
        returns (
            uint256,
            string memory,
            string memory,
            string memory,
            string memory,
            uint256,
            string memory,
            string memory,
            address
        )
    {
        require(_id != 0 && patients[_id].id != 0, "No such patient found");
        Patient memory pat = patients[_id];
        return (
            pat.id,
            pat.name,
            pat.gender,
            pat.bloodGroup,
            pat.DOB,
            pat.phoneNumber,
            pat.physicalAddress,
            pat.profilePicture,
            pat.walletAddress
        );
    }

    
    function getPatientRecords(uint256 _id)
        public
        view
        onlyAuthorised(_id)
        returns (
            uint256[] memory,
            string[] memory,
            string[] memory,
            string[] memory,
            string[] memory
        )
    {
        Patient memory patient = patients[_id];
        require(_id != 0 && patient.id != 0, "No such patient found");
        require(patient.records.length > 0, "No record found");

        uint256 len = patient.records.length;
        uint256[] memory rec = patient.records;

        uint256[] memory hosId = new uint256[](len);
        string[] memory cond = new string[](len);
        string[] memory desc = new string[](len);
        string[] memory aller = new string[](len);
        string[] memory docs = new string[](len);

        for (uint256 i = 0; i < rec.length; i++) {
            Record memory curr = records[rec[i]];
            hosId[i] = curr.hospitalId;
            cond[i] = curr.condition;
            desc[i] = curr.description;
            aller[i] = curr.allergies;
            docs[i] = curr.Document;
        }

        return (hosId, cond, desc, aller, docs);
    }

    function getHospitals()
        public
        view
        returns (
            uint256[] memory,
            string[] memory,
            string[] memory,
            string[] memory
        )
            
    {
        //uint256 len = hospitals.length;
        //uint256[] memory hosId = new uint256[](len);
        //string[] memory name = new string[](len);
        //string[] memory add = new string[](len);
        //string[] memory license = new string[](len);
        //return (hosId,name,add,license);
        
    }

    modifier onlyAuthorised(uint256 _id) {
        uint256 hosId = hospitalToId[msg.sender];
        require(
            (authorised[_id][msg.sender] == true) ||
                (hosId != 0 && hospitals[hosId].id != 0) ||
                (_id != 0 && patients[_id].walletAddress == msg.sender),
            "Only authorised addressed"
        );
        _;
    }

    modifier onlyPatient() {
        uint256 _id = patientToId[msg.sender];
        require(_id != 0 && patients[_id].id != 0, "Only patient is allowed");
        _;
    }

    modifier onlyHospital() {
        uint256 _id = hospitalToId[msg.sender];
        require(
            _id != 0 && hospitals[_id].id != 0,
            "Only hospitals are allowed"
        );
        _;
    }
}
