import React, { useState, useEffect } from 'react'
import Patient from '../../../components/Patient/Patient';
import Record from '../../../components/Record/Record';
import { getWeb3 } from "../../../utils.js";
import Docmedsync from "../../../contracts/Docmedsync.json";
import Loading from '../../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';
import { create } from "ipfs-http-client";
import { gateway } from '../../../config';
import { Input, Button, Text } from "@nextui-org/react";
import { message, ConfigProvider, theme, Image } from 'antd';
import { Descriptions } from 'antd';
import "./Hospital.css";
import useDarkMode from 'use-dark-mode';


var Buffer = require('buffer/').Buffer
const projectId = '2HGrr5QuuBybx8VOY8J3Ol5Xee7';
const projectSecret = '72b4d401f91860370d2865422d0e1996';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const Hospital = () => {

    const [web3, setWeb3] = useState(undefined);
    const [accounts, setAccounts] = useState(undefined);
    const [contract, setContract] = useState(undefined);
    const [ipfs, setIpfs] = useState(undefined);
    const history = useNavigate();
    const [patientId, setPatientId] = useState("");
    const [patient, setPatient] = useState(null);
    const [patientAdd, setPatientAdd] = useState({ name: "", id: "", gender: "", bloodgroup: "", dob: "", number: "", address: "", ethAdd: "" });
    const [patientBuffer, setPatientBuffer] = useState(undefined);
    const [recordAdd, setRecordAdd] = useState({ hosId: "", patId: "", cond: "", desc: "", allergy: "" });
    const [recordBuffer, setRecordBuffer] = useState(undefined);
    const [records, setRecords] = useState([]);
    const [patId, setPatId] = useState("");
    const [hospital, setHospital] = useState();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const darkMode = useDarkMode(false);
    const isReady = () => {
        return (
            typeof contract !== 'undefined'
            && typeof web3 !== 'undefined'
            && typeof accounts !== 'undefined'
        );
    }

    useEffect(() => {
        const init = async () => {
            try {
                const web3 = await getWeb3();
                const accounts = await web3.eth.getAccounts();
                const networkId = await web3.eth.net.getId();
                const deployedNetwork = Docmedsync.networks[networkId];
                if (deployedNetwork === undefined)
                    throw new Error('Make sure you are on the corrent network. Set the network to Goerli Test Network');
                const contract = new web3.eth.Contract(
                    Docmedsync.abi,
                    deployedNetwork && deployedNetwork.address,
                );
                const ipfsNode = create({
                    host: 'ipfs.infura.io',
                    port: 5001,
                    protocol: 'https',
                    headers: {
                        authorization: auth,
                    },
                });
                setWeb3(web3);
                setAccounts(accounts);
                setContract(contract);
                setIpfs(ipfsNode);
            } catch (error) {
                window.alert(error);
                history("/dashboard");
            }
        }
        init();
        if (isReady()) {
            window.ethereum.on('accountsChanged', accounts => {
                setAccounts(accounts);
            });
        }
    }, [history]);

    const getPatient = async (e) => {
        e.preventDefault();
        try {
            
            messageApi.open({
                key: "2",
                type: 'loading',
                content: 'Fetching Data...',
                duration: 0,
            });

            const pat = await contract.methods.getPatientDetails(patientId).call({ from: accounts[0] });
            setPatient(pat);

            messageApi.open({
                key: "2",
                type: 'success',
                content: 'Data Fetched Successfully!',
                duration: 5,
            });
            
        } catch (err) {
            messageApi.open({
                key: "2",
                type: 'error',
                content: 'Could not get details of patient.Please make sure you have the correct rights and you have the correct Id',
                duration: 5,
            });
            
        }
        setPatientId("");
    }

    const getRecords = async (e) => {
        e.preventDefault();
        setRecords([]);
        try {
            messageApi.open({
                key: "5",
                type: 'loading',
                content: 'Fetching Data...',
                duration: 0,
            });
            const recs = await contract.methods.getPatientRecords(patId).call({ from: accounts[0] });
            const recsArray = [];
            for (let i = 0; i < recs[0].length; i++) {
                recsArray.push({
                    hospitalId: recs[0][i],
                    condition: recs[1][i],
                    description: recs[2][i],
                    allergy: recs[3][i],
                    docs: recs[4][i]
                })
            }
            console.log(recsArray);
            setRecords(recsArray);
            messageApi.open({
                key: "5",
                type: 'success',
                content: 'Record Fetched Successfully!',
                duration: 5,
            });
        } catch (err) {
            console.log(err)
            messageApi.open({
                key: "5",
                type: 'error',
                content: 'Could not get records of patient.Please make sure you have the correct rights and you have the correct Id',
                duration: 5,
            });

        }
        setPatId("");
    }


    const handleChangePatient = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            setPatientBuffer(Buffer(reader.result));
        }
    }

    const handleSubmitPatient = async (e) => {
        e.preventDefault();
        try {
            messageApi.open({
                key: "1",
                type: 'loading',
                content: 'Transaction in progress...',
                duration: 0,
            });
            setLoading(true);
            const result = await ipfs.add(patientBuffer);
            console.log(result);
            console.log(patientAdd);
            await contract.methods.addNewPatient(patientAdd.id, patientAdd.name, patientAdd.gender, patientAdd.bloodgroup, patientAdd.dob, patientAdd.number, patientAdd.address, result.path, patientAdd.ethAdd.trim()).send({ from: accounts[0] });
            messageApi.open({
                key: "1",
                type: 'success',
                content: "Patient Registered Successfully!",
                duration: 5,
            });
        
        } catch (error) {
            messageApi.open({
                key: "1",
                type: 'error',
                content: "Patient could not be added. Make sure you are an admin and check input fields",
                duration: 5,
            });
            console.error(error);
        }
        //setPatientAdd({ name: "", id: "", gender: "", bloodgroup: "", dob: "", number: "", address: "", ethAdd: "" });
    }

    const handleSubmitRecord = async (e) => {
        e.preventDefault();
        try {
            messageApi.open({
                key: "3",
                type: 'loading',
                content: 'Transaction in progress...',
                duration: 0,
            });
            const result = await ipfs.add(recordBuffer);
            await contract.methods.addNewRecord(recordAdd.hosId, recordAdd.patId, recordAdd.cond, recordAdd.desc, recordAdd.allergy, result.path).send({ from: accounts[0] });
            messageApi.open({
                key: "3",
                type: 'success',
                content: "Record added Successfully!",
                duration: 5,
            });
       
        } catch (error) {
            messageApi.open({
                key: "3",
                type: 'error',
                content: "Record could not be added. Make sure you are an authorized and check input fields",
                duration: 5,
            });
            console.error(error);
          
        }
        setRecordAdd({ hosId: "", patId: "", cond: "", desc: "", allergy: "" })
    }

    const handleChangeRecord = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            setRecordBuffer(Buffer(reader.result));
        }
    }

    const getHospital = async (e) => {
        e.preventDefault();
        try {
            messageApi.open({
                key: "4",
                type: 'loading',
                content: 'Fetching Data...',
                duration: 0,
            });
            const hos = await contract.methods.getHospitalByAddress(accounts[0]).call();
            setHospital(hos);

            messageApi.open({
                key: "4",
                type: 'success',
                content: 'Data Fetched Successfully!',
                duration: 5,
            });

        } catch (error) {
            console.log(error)
                messageApi.open({
                key: "2",
                type: 'error',
                content: 'Could not get your details. Please make sure you are registerd as a Hospital',
                duration: 5,
            });

        }
    }

    if (!isReady()) {
        return <Loading />;
    }

    return (
        <>
            <ConfigProvider
                theme={{
                    algorithm: darkMode.value == false ? theme.defaultAlgorithm : theme.darkAlgorithm,

                }}
            >
                {contextHolder}
            </ConfigProvider>
            <section className="auth-dash-wrapper">
                <div className="container" >
                    <div className="section-title" >
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Text color="primary" h2>Hospital's Dashboard</Text>
                            <Text >Various operations a hospital can do.</Text>

                        </div>

                    </div>

                    <div className="get-details"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            marginLeft: "8rem",
                            marginTop: "1rem",
                            marginBottom: "3rem",
                            gap: "2rem"
                        }}>
                        <div>
                            <form onSubmit={getHospital}>
                                <Text h4 css={{ marginBottom: "2rem" }}>Get Details of hosptial</Text>
                                <div>

                                    <Button type='submit' shadow auto color="primary" rounded css={{ zIndex: "1" }}>Click Here  </Button>
                                </div>
                            </form>
                            <div className="details">
                                {!hospital
                                    ? <></>
                                    : (
                                        <div
                                            style={{ marginTop: "2rem" }}
                                        >
                                            <ConfigProvider
                                                theme={{
                                                    algorithm: darkMode.value == false ? theme.defaultAlgorithm : theme.darkAlgorithm,

                                                }}
                                            >


                                                <Descriptions
                                                    title={<h3>HOSPITAL INFO</h3>}
                                    
                                                    bordered
                                                    extra={
                                                        <Image
                                                            width={200}
                                                            height={112}
                                                            src={`${gateway}${hospital.License}`}
                                                            alt="Hospital Image"
                                                        />
                                                    }
                                                    column={{
                                                        xxl: 4,
                                                        xl: 3,
                                                        lg: 3,
                                                        md: 3,
                                                        sm: 2,
                                                        xs: 1,
                                                    }}
                                                >
                                                   
                                                    <Descriptions.Item label="Hospital Name">{hospital.name}</Descriptions.Item>
                                                    <Descriptions.Item label="Hospital Id">{hospital.id}</Descriptions.Item>
                                                    <Descriptions.Item label="Hospital's Ethereum Address">{hospital.walletAddress}</Descriptions.Item>
                                                    <Descriptions.Item label="Hospital's Address">{hospital.physicalAddress}</Descriptions.Item>


                                                </Descriptions>
                                            </ConfigProvider>



                                        </div>
                                    )
                                }
                            </div>



                        </div>
                        <br></br>
                        <div className="get-details-patient">
                            <div>
                                <form onSubmit={getPatient}>
                                    <Text h4 css={{ marginBottom: "2rem" }}>Get Details of patient</Text>
                                    <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>

                                        <Input
                                            clearable
                                            type="text"
                                            bordered
                                            labelPlaceholder="Patient's Id"
                                            color="primary"
                                            required={true}
                                            width='400px'
                                            value={patientId}
                                            onChange={e => setPatientId(e.target.value)}

                                        />


                                        <Button type='submit' shadow auto color="primary" rounded css={{ zIndex: "1" }}>Click Here  </Button>
                                    </div>

                                </form>
                                {!patient
                                    ? <></>
                                    : <Patient patient={patient} />}
                            </div>
                        </div>
                        <div className="get-details">
                            <div>
                                <form onSubmit={getRecords}>

                                    <Text h4 css={{ marginBottom: "2rem" }}>Get Records of patient</Text>
                                    <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>

                                        <Input
                                            clearable
                                            type="text"
                                            bordered
                                            labelPlaceholder="Patient's Id"
                                            color="primary"
                                            required={true}
                                            width='400px'
                                            value={patId}
                                            onChange={e => setPatId(e.target.value)}

                                        />


                                        <Button type='submit' shadow auto color="primary" css={{ zIndex: "1" }} rounded>Click Here  </Button>
                                    </div>
                                </form>
                                {records.length > 0
                                    ?
                                    records.map((record, index) => {
                                        return <div key={index}><Record record={record} /></div>
                                    })
                                    : <></>
                                }
                            </div>


                        </div>


                        <div className="get-details-patient">
                            <div>
                                <Text h4 css={{ marginBottom: "2rem" }}>Add new Patient</Text>
                                <form onSubmit={handleSubmitPatient}>


                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",

                                            gap: "2rem"
                                        }}
                                    >
                                        <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>

                                            <Input
                                                clearable
                                                type="text"
                                                bordered
                                                labelPlaceholder="Patient's Name"
                                                color="primary"
                                                required={true}
                                                width='400px'
                                                value={patientAdd.name}
                                                onChange={e => setPatientAdd({ ...patientAdd, name: e.target.value })}

                                            />

                                            <Input
                                                clearable
                                                type="text"
                                                bordered
                                                labelPlaceholder="Patient's Id"
                                                color="primary"
                                                required={true}
                                                width='400px'
                                                value={patientAdd.id}
                                                onChange={e => setPatientAdd({ ...patientAdd, id: e.target.value })}

                                            />
                                            <Input
                                                clearable
                                                type="text"
                                                bordered
                                                labelPlaceholder="Patient's Gender"
                                                color="primary"
                                                required={true}
                                                width='400px'
                                                value={patientAdd.gender}
                                                onChange={e => setPatientAdd({ ...patientAdd, gender: e.target.value })}

                                            />
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                                            <Input
                                                clearable
                                                type="text"
                                                bordered
                                                labelPlaceholder="Patient's Blood Group"
                                                color="primary"
                                                required={true}
                                                width='400px'
                                                value={patientAdd.bloodgroup}
                                                onChange={e => setPatientAdd({ ...patientAdd, bloodgroup: e.target.value })}

                                            />
                                            <Input
                                                clearable
                                                type="text"
                                                bordered
                                                labelPlaceholder="Patient's Date of Birth"
                                                color="primary"
                                                required={true}
                                                width='400px'
                                                value={patientAdd.dob}
                                                onChange={e => setPatientAdd({ ...patientAdd, dob: e.target.value })}
                                            />
                                            <Input
                                                clearable
                                                type="text"
                                                bordered
                                                labelPlaceholder="Patient's Phone number"
                                                color="primary"
                                                required={true}
                                                width='400px'
                                                value={patientAdd.number}
                                                onChange={e => setPatientAdd({ ...patientAdd, number: e.target.value })}

                                            />
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem", marginTop: "0.5rem", marginBottom: "0.5rem" }}>

                                            <Input
                                                clearable
                                                type="text"
                                                bordered
                                                labelPlaceholder="Patient's Address "
                                                color="primary"
                                                required={true}
                                                width='400px'
                                                value={patientAdd.address}
                                                onChange={e => setPatientAdd({ ...patientAdd, address: e.target.value })}

                                            />
                                            <Input
                                                clearable
                                                type="text"
                                                bordered
                                                labelPlaceholder="Ethereum Address"
                                                color="primary"
                                                required={true}
                                                width='400px'
                                                value={patientAdd.ethAdd}
                                                onChange={e => setPatientAdd({ ...patientAdd, ethAdd: e.target.value })}

                                            />
                                            <Input
                                                clearable
                                                type="file"
                                                bordered
                                                color="primary"
                                                required={true}
                                                width='400px'
                                                onChange={handleChangePatient}

                                            />
                                        </div>


                                        <div>

                                            <Button type='submit' shadow auto color="primary" css={{ zIndex: "1" }} rounded>Submit  </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className='add-records' style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        marginLeft: "8rem",
                        marginTop: "1rem",
                        marginBottom: "3rem",
                        gap: "2rem"
                    }}>
                        <Text h4 css={{ marginBottom: "2rem" }}>Add new Record</Text>
                        <div>
                            <form onSubmit={handleSubmitRecord}>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",

                                        gap: "2rem"
                                    }}
                                >

                                    <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>

                                        <Input
                                            clearable
                                            type="text"
                                            bordered
                                            labelPlaceholder="Hospital's Id"
                                            color="primary"
                                            required={true}
                                            width='400px'
                                            value={recordAdd.hosId}
                                            onChange={e => setRecordAdd({ ...recordAdd, hosId: e.target.value })}



                                        />
                                        <Input
                                            clearable
                                            type="text"
                                            bordered
                                            labelPlaceholder="Patient's Id"
                                            color="primary"
                                            required={true}
                                            width='400px'
                                            value={recordAdd.patId}
                                            onChange={e => setRecordAdd({ ...recordAdd, patId: e.target.value })}



                                        />
                                        <Input
                                            clearable
                                            type="text"
                                            bordered
                                            labelPlaceholder="Patient's Condition"
                                            color="primary"
                                            required={true}
                                            width='400px'
                                            value={recordAdd.cond}
                                            onChange={e => setRecordAdd({ ...recordAdd, cond: e.target.value })}



                                        />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem", marginTop: "0.5rem" }}>
                                        <Input
                                            clearable
                                            type="text"
                                            bordered
                                            labelPlaceholder="Description"
                                            color="primary"
                                            required={true}
                                            width='400px'
                                            value={recordAdd.desc}
                                            onChange={e => setRecordAdd({ ...recordAdd, desc: e.target.value })}



                                        />
                                        <Input
                                            clearable
                                            type="text"
                                            bordered
                                            labelPlaceholder="Patient's Allergies"
                                            color="primary"
                                            required={true}
                                            width='400px'
                                            value={recordAdd.allergy}
                                            onChange={e => setRecordAdd({ ...recordAdd, allergy: e.target.value })}


                                        />
                                        <Input
                                            clearable
                                            type="file"
                                            bordered

                                            color="primary"
                                            required={true}
                                            width='400px'
                                            onChange={handleChangeRecord}



                                        />
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem", marginTop: "0.5rem" }} s>
                                        <Button type='submit' shadow auto color="primary" rounded css={{ zIndex: "1" }}>Submit </Button>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>










                </div>
            </section >
        </>
    )
}

export default Hospital
