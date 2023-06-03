import React, { useState, useEffect } from 'react'
import Patient from "../../../components/Patient/Patient"
import Record from '../../../components/Record/Record';
import { getWeb3 } from "../../../utils.js";
import Docmedsync from "../../../contracts/Docmedsync.json";
import Loading from '../../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Text } from "@nextui-org/react";
import { message, ConfigProvider, theme } from 'antd';
import useDarkMode from 'use-dark-mode';

const PatientDashboard = () => {

    const [web3, setWeb3] = useState(undefined);
    const [accounts, setAccounts] = useState(undefined);
    const [contract, setContract] = useState(undefined);
    const history = useNavigate();
    const [yourId, setYourId] = useState("");
    const [patient, setPatient] = useState(null);
    const [yourIdRec, setYourIdRec] = useState("");
    const [records, setRecords] = useState([]);
    const [addAuthId, setAddAuthId] = useState("");
    const [addAuthAddress, setAddAuthAddress] = useState("");
    const [removeAuthId, setRemoveAuthId] = useState("");
    const [removeAuthAddress, setRemoveAuthAddress] = useState("");

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
                    throw new Error('Make sure you are on the correct network. Set the network to Goerli Test Network');
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
            messageApi.open({
                key: "1",
                type: 'loading',
                content: 'Loading Data...',
                duration: 0,
            });
            const pat = await contract.methods.getPatientDetails(yourId).call({ from: accounts[0] });
            setPatient(pat);
            messageApi.open({
                key:"1",
                type: 'success',
                content: <>Data loaded Successfully!</>,
                duration: 5,
            });
        } catch (err) {
            messageApi.open({
                key:"1",
                type: 'error',
                content: <>Could not get details of patient. Please make sure you have the correct rights and you have the correct Id</>,
                duration: 5,
            });
            //window.alert("Could not get details of patient. Please make sure you have the correct rights and you have the correct Id")
        }
        setYourId("");
    }

    const getRecords = async (e) => {
        e.preventDefault();
        setRecords([]);
        try {
            const recs = await contract.methods.getPatientRecords(yourIdRec).call({ from: accounts[0] });
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
        setYourIdRec("");
    }

    const handleAddAuthAddress = async (e) => {
        e.preventDefault();
        try {
            await contract.methods.addAuthByAddress(addAuthAddress.trim()).send({ from: accounts[0] });
            window.alert("Authorized successfully");
        } catch (error) {
            window.alert("Could not authorized. Make sure you have the right privileges");
            console.error(error);
        }
        setAddAuthAddress("");
    }

    const handleAddAuthId = async (e) => {
        e.preventDefault();
        try {
            await contract.methods.addAuthById(addAuthId).send({ from: accounts[0] });
            window.alert("Authorized successfully");
        } catch (error) {
            window.alert("Could not authorized. Make sure you have the right privileges");
            console.error(error);
        }
        setAddAuthId("");
    }

    const handleRemoveAuthAddress = async (e) => {
        e.preventDefault();
        try {
            await contract.methods.revokeAuthByAddress(removeAuthAddress.trim()).send({ from: accounts[0] });
            window.alert("Unauthorized successfully");
        } catch (error) {
            window.alert("Could not authorized. Make sure you have the right privileges.");
            console.error(error);
        }
        setRemoveAuthAddress("");
    }

    const handleRemoveAuthId = async (e) => {
        e.preventDefault();
        try {
            await contract.methods.revokeAuthById(removeAuthId).send({ from: accounts[0] });
            window.alert("Unauthorized successfully");
        } catch (error) {
            window.alert("Could not authorized. Make sure you have the right privileges.");
            console.error(error);
        }
        setRemoveAuthId("");
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
            <section className="patient-dash-wrapper" >
                <div className="container">
                    <div className="section-title">
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Text color="primary" h2>Patients's Dashboard</Text>
                            <Text >Various operations the Patient can do.</Text>

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
                        }}
                    >

                        <div >
                            <Text h4 color="primary" css={{ marginBottom: "2rem" }}>Get your Details</Text>
                            <form onSubmit={getPatient}>

                                <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>

                                    <Input
                                        clearable
                                        type="text"
                                        bordered
                                        labelPlaceholder="Your Id"
                                        color="primary"
                                        required={true}
                                        width="25rem"
                                        value={yourId}
                                        onChange={e => setYourId(e.target.value)}

                                    />


                                    <Button type='submit' shadow auto color="primary" css={{ zIndex: "1" }} rounded  >Click Here</Button>
                                </div>

                            </form>
                            {!patient
                                ? <></>
                                : <Patient patient={patient} />}
                        </div>


                        <div className="get-records">
                            <Text h4 color="primary" css={{ marginBottom: "2rem" }}>Get your Records</Text>
                            <div>
                                <form onSubmit={getRecords}>
                                    <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>

                                        <Input
                                            clearable
                                            type="text"
                                            bordered
                                            labelPlaceholder="Your Id"
                                            color="primary"
                                            required={true}
                                            width="25rem"
                                            value={yourIdRec}
                                            onChange={e => setYourIdRec(e.target.value)}

                                        />


                                        <Button type='submit' shadow auto color="primary" rounded css={{ zIndex: "1" }}>Click Here  </Button>
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
                        <div className="give-authorization">
                            <Text color="primary" h4 css={{ marginBottom: "2rem" }}>Give Authorization</Text>
                            <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>
                                <div>
                                    <form onSubmit={handleAddAuthAddress}>
                                        <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>

                                            <Input
                                                clearable
                                                type="text"
                                                bordered
                                                labelPlaceholder="Organization's Address"
                                                color="primary"
                                                required={true}
                                                width="25rem"
                                                value={addAuthAddress}
                                                onChange={e => setAddAuthAddress(e.target.value)}

                                            />

                                            <Button type='submit' shadow auto color="primary" rounded css={{ zIndex: "1" }} >Click Here  </Button>
                                        </div>
                                    </form>
                                </div>
                                <div><Text h4 css={{}}>OR</Text></div>
                                <div>
                                    <form onSubmit={handleAddAuthId}>
                                        <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>
                                            <Input
                                                clearable
                                                type="text"
                                                bordered
                                                labelPlaceholder="Organization's Id"
                                                color="primary"
                                                required={true}
                                                width="25rem"
                                                value={addAuthId}
                                                onChange={e => setAddAuthId(e.target.value)}

                                            />

                                            <Button type='submit' shadow auto color="primary" rounded css={{ zIndex: "1" }} >Click Here  </Button>

                                        </div>


                                    </form>

                                </div>

                            </div>
                        </div>
                        <div className="remove-authorization" >
                            <Text h4 color="primary" css={{ marginBottom: "2rem" }}>Remove Authorization</Text>
                            <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>
                                <div >
                                    <form onSubmit={handleRemoveAuthAddress}>
                                        <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>

                                            <Input
                                                clearable
                                                type="text"
                                                bordered
                                                labelPlaceholder="Organization's Address"
                                                color="primary"
                                                required={true}
                                                width="25rem"
                                                value={removeAuthAddress}
                                                onChange={e => setRemoveAuthAddress(e.target.value)}

                                            />

                                            <Button type='submit' shadow auto color="primary" rounded css={{ zIndex: "1" }}>Click Here  </Button>
                                        </div>


                                    </form>



                                </div>
                                <div> <Text h4 >OR</Text></div>
                                <div>
                                    <form onSubmit={handleRemoveAuthId}>
                                        <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>
                                            <Input
                                                clearable
                                                type="text"
                                                bordered
                                                labelPlaceholder="Organization's  Id"
                                                color="primary"
                                                required={true}
                                                width="25rem"
                                                value={removeAuthId}
                                                onChange={e => setRemoveAuthId(e.target.value)}

                                            />

                                            <Button type='submit' shadow auto color="primary" rounded css={{ zIndex: "1" }}>Click Here  </Button>
                                        </div>


                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </section >
        </>
    )
}
export default PatientDashboard
