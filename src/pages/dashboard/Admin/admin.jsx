import React, { useState, useEffect, useRef } from 'react'
import { getWeb3 } from "../../../utils.js";
import Docmedsync from "../../../contracts/Docmedsync.json";
import Loading from '../../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';
import { create } from "ipfs-http-client";
import { Input, Button, Text,Badge } from "@nextui-org/react";
import { message, ConfigProvider, theme } from 'antd';
import useDarkMode from 'use-dark-mode';
var Buffer = require('buffer/').Buffer


const projectId = '2HGrr5QuuBybx8VOY8J3Ol5Xee7';
const projectSecret = '72b4d401f91860370d2865422d0e1996';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');



const Admin = () => {

    const [web3, setWeb3] = useState(undefined);
    const [accounts, setAccounts] = useState(undefined);
    const [contract, setContract] = useState(undefined);
    const [ipfs, setIpfs] = useState(undefined);
    const history = useNavigate();
    const [hospital, setHospital] = useState({ name: "", address: "", ethAdd: "" });
    const [hospitalBuffer, setHospitalBuffer] = useState("");
    const [org, setOrg] = useState({ name: "", ethAdd: "" });
    const [orgBuffer, setOrgBuffer] = useState("");
    const [currentHospitalId, setCurrentHospitalId] = useState(undefined);
    const [currentOrgId, setCurrentOrgId] = useState(undefined);
    const inputRef = useRef(null);
    const darkMode = useDarkMode(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const isReady = () => {
        return (
            typeof contract !== 'undefined'
            && typeof web3 !== 'undefined'
            && typeof accounts !== 'undefined'
            && typeof ipfs !== 'undefined'
            && typeof currentHospitalId !== 'undefined'
            && typeof currentOrgId !== 'undefined'
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

                const currHos = await contract.methods.hospitalId().call({ from: accounts[0] });
                const currOrg = await contract.methods.organizationId().call({ from: accounts[0] });

                setCurrentHospitalId(currHos);
                setCurrentOrgId(currOrg);
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

    if (!isReady()) {
        return <Loading />;
    }


    const updateIds = async () => {
        if (!isReady())
            return;
        const currHos = await contract.methods.hospitalId().call({ from: accounts[0] });
        const currOrg = await contract.methods.organizationId().call({ from: accounts[0] });

        setCurrentHospitalId(currHos);
        setCurrentOrgId(currOrg);
    }

    const handleChangeHospital = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            setHospitalBuffer(Buffer(reader.result));
        }
    }

    const handleChangeOrg = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            setOrgBuffer(Buffer(reader.result));
        }
    }

    const handleSubmitHospital = async (e) => {
        e.preventDefault();
        try {
            messageApi.open({
                key:"1",
                type: 'loading',
                content: 'Transaction in progress...',
                duration: 0,
              });
            setLoading(true);
            const result = await ipfs.add(hospitalBuffer);
          
            await contract.methods.addHospital(hospital.name, hospital.address, hospital.ethAdd.trim(), result.path).send({ from: accounts[0] });
            await updateIds();
            messageApi.open({
                key:"1",
                type: 'success',
                content: <>Hospital Registered Successfully!</>,
                duration: 5,
            });
            
        } catch (error) {
            messageApi.open({
                key:"1",
                type: 'error',
                content: <>Hospital could not be added. Make sure you are an admin and check input fields</>,
                duration: 5,
            });
            
            console.error(error);
        }
        
        setLoading(false);
        setHospital({ name: "", address: "", ethAdd: "" });
    }

    const handleSubmitOrg = async (e) => {
        e.preventDefault();
        try {

            messageApi.open({
                key:"2",
                type: 'loading',
                content: 'Transaction in progress...',
                duration: 0,
              });
            const result = await ipfs.add(orgBuffer);
          
            await contract.methods.addOrganization(org.name, org.ethAdd.trim(), result.path).send({ from: accounts[0] });
            await updateIds();
            messageApi.open({
                key:"2",
                type: 'success',
                content: <>Organization Registered Successfully!</>,
                duration: 5,
            });
            //window.alert("Organization Registered Successfully");
        } catch (error) {
            messageApi.open({
                key:"2",
                type: 'error',
                content: <>Organization Could not be added. Make sure you are an admin and check input fields</>,
                duration: 5,
            });
            //window.alert("Organization Could not be added. Make sure you are an admin and check input fields");
            console.error(error);
        }
        setOrg({ name: "", ethAdd: "" });
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
                            <Text color="primary" h2>Admin's Dashboard</Text>
                            <Text >Various operations the Admin can do.</Text>

                        </div>

                    </div>

                    <div className="add-hospital"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            marginLeft: "10%",
                            marginTop: "4%",
                            marginBottom: "2%"
                        }}>
                        <Text h4 color="primary" css={{ marginBottom: "2rem" }}>ADD NEW HOSPTIAL</Text>
                        <Badge variant="flat" color="warning" size="md" css={{ marginBottom: "2rem" }}>{`Current Id : ${currentHospitalId}`}</Badge>
                        <form onSubmit={handleSubmitHospital} >

                            <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>

                                <Input

                                    clearable
                                    type="text"
                                    bordered
                                    labelPlaceholder="Hospital's Name"
                                    color="primary"
                                    required={true}
                                    width='400px'
                                    value={hospital.name}
                                    onChange={e => setHospital({ ...hospital, name: e.target.value })}


                                />

                                <Input
                                    clearable
                                    type="text"
                                    bordered
                                    labelPlaceholder="Address of Hospital"
                                    color="primary"
                                    required={true}
                                    width='400px'
                                    value={hospital.address}
                                    onChange={e => setHospital({ ...hospital, address: e.target.value })}



                                />
                                <Input
                                    clearable
                                    type="text"
                                    bordered
                                    labelPlaceholder="Ethereum Address"
                                    color="primary"
                                    required={true}
                                    width='400px'
                                    value={hospital.ethAdd}
                                    onChange={e => setHospital({ ...hospital, ethAdd: e.target.value })}



                                />
                            </div>

                            <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem", marginTop: "1rem", marginBottom: "0.5rem" }}>
                                <Input
                                    clearable
                                    type="file"
                                    bordered
                                    color="primary"
                                    required={true}
                                    width='400px'
                                    onChange={handleChangeHospital}

                                    css={{ display: 'flex', justifyItems: "end", border: "none" }}

                                />

                            </div>

                            <div>

                                <Button type='submit' shadow auto color="primary" rounded>Submit  </Button>
                            </div>
                        </form>
                    </div>


                    <div className="add-organization"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            marginLeft: "10%",
                            marginTop: "4%",
                            marginBottom: "2%"
                        }}>
                        <Text h4 color="primary" css={{ marginBottom: "2rem" }}>ADD NEW ORGANISATION</Text>
                        <Badge variant="flat" color="warning" size="md" css={{ marginBottom: "2rem" }}>{`Current Id : ${currentOrgId}`}</Badge>
                     
                        <form onSubmit={handleSubmitOrg} >

                            <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>

                                <Input
                                    clearable
                                    type="text"
                                    bordered
                                    labelPlaceholder="Organization's Name"
                                    color="primary"
                                    required={true}
                                    width='400px'
                                    value={org.name}
                                    onChange={e => setOrg({ ...org, name: e.target.value })}



                                />
                                <Input
                                    clearable
                                    type="text"
                                    bordered
                                    labelPlaceholder="Ethereum Address"
                                    color="primary"
                                    required={true}
                                    width='400px'
                                    value={org.ethAdd}
                                    onChange={e => setOrg({ ...org, ethAdd: e.target.value })}


                                />

                               
                            </div>
                            <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem", marginTop: "1rem" }}>
                                <Input
                                    clearable
                                    type="file"
                                    bordered
                                    color="primary"
                                    required={true}
                                    width='400px'
                                    onChange={handleChangeOrg}


                                />
                                <Button type='submit' shadow auto color="primary" rounded>Submit</Button>
                            </div>

                        </form>
                    </div>






                </div>
            </section >
        </>
    )
}

export default Admin
