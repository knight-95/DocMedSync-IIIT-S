import React, { useState, useEffect } from 'react'
import Patient from '../../../components/Patient/Patient';
import Record from '../../../components/Record/Record';
//import "./Auth.css";
import { getWeb3 } from "../../../utils.js";
import Docmedsync from "../../../contracts/Docmedsync.json";
import Loading from '../../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Text } from "@nextui-org/react";
import { message, ConfigProvider, theme } from 'antd';
import useDarkMode from 'use-dark-mode';

const Auth = () => {

    const [web3, setWeb3] = useState(undefined);
    const [accounts, setAccounts] = useState(undefined);
    const [contract, setContract] = useState(undefined);
    const history = useNavigate();
    const [patientId, setPatientId] = useState("");
    const [patientIdRec, setPatientIdRec] = useState("");
    const [patient, setPatient] = useState(null);
    const [records, setRecords] = useState([]);

    const darkMode = useDarkMode(false);
    const [messageApi, contextHolder] = message.useMessage();

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
                    throw new Error('Make sure you are on the corret network. Set the network to Goerli Test Network');
                const contract = new web3.eth.Contract(
                    Docmedsync.abi,
                    deployedNetwork && deployedNetwork.address,
                );

                setWeb3(web3);
                setAccounts(accounts);
                setContract(contract);
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
            const pat = await contract.methods.getPatientDetails(patientId).call({ from: accounts[0] });
            setPatient(pat);
        } catch (err) {
            window.alert("Could not get details of patient. Please make sure you have the correct rights and you have the correct Id")
        }
        setPatientId("");
    }

    const getRecords = async (e) => {
        e.preventDefault();
        setRecords([]);
        try {
            const recs = await contract.methods.getPatientRecords(patientIdRec).call({ from: accounts[0] });
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
            setRecords(recsArray);
        } catch (err) {
            console.log(err)
            window.alert("Could not get records of patient. Please make sure you have the correct rights and you have the correct Id")
        }
        setPatientIdRec("");
    }

    if (!isReady()) {
        return <Loading />;
    }

    return (
        <>
            <section className="auth-dash-wrapper">
                <div className="container">
                    <div className="section-title">
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Text color="primary" h2>Authorized Dashboard</Text>
                            <Text >Various operations an authorized person can do.</Text>

                        </div>
                    </div>

                    <div className="get-details-patient" style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        marginLeft: "8rem",
                        marginTop: "4rem",
                        marginBottom: "2rem"
                    }}>
                        <Text color='primary' h4 css={{ marginBottom: "2rem" }}> Get details of Patient</Text>
                        <div>
                            <form onSubmit={getPatient}>
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
                                    <Button type='submit' shadow auto color="primary" rounded>Click Here </Button>
                                </div>
                            </form>
                            {!patient
                                ? <></>
                                : <Patient patient={patient} />}
                        </div>
                    </div>

                    <div className="get-records" style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        marginLeft: "8rem",
                        marginTop: "4rem",
                        marginBottom: "2rem"
                    }}>
                        <Text color='primary' h4 css={{ marginBottom: "2rem" }}>Get Records of Patient</Text>
                        <div>
                            <form onSubmit={getRecords}>
                                <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>

                                    <Input
                                        clearable
                                        type="text"
                                        bordered
                                        labelPlaceholder="Patient's Id"
                                        color="primary"
                                        required={true}
                                        width='400px'
                                        value={patientIdRec}
                                        onChange={e => setPatientIdRec(e.target.value)}

                                    />
                                    <Button type='submit' shadow auto color="primary" rounded>Click Here </Button>
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
                </div>
            </section>
        </>
    )
}

export default Auth
