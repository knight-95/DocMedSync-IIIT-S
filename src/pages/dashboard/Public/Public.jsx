import React, { useState, useEffect } from 'react'
import { getWeb3 } from "../../../utils.js";
import Docmedsync from "../../../contracts/Docmedsync.json";
import { Input, Button, Text } from "@nextui-org/react";
import Loading from '../../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';
import { gateway } from '../../../config.js';




const PublicDashBoard = () => {

    const [web3, setWeb3] = useState(undefined);
    const [accounts, setAccounts] = useState(undefined);
    const [contract, setContract] = useState(undefined);
    const history = useNavigate();
    const [owner, setOwner] = useState(null);
    const [admin, setAdmin] = useState("");
    const [isAdmin, setIsAdmin] = useState("");
    const [hospitalId, setHospitalId] = useState("");
    const [hospital, setHospital] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [orgId, setOrgId] = useState("");
    const [org, setOrg] = useState(null);

    


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
                    throw new Error('Make sure you are on the corrent network. Set the network to Ropsten Test Network');
                const contract = new web3.eth.Contract(
                    Docmedsync.abi,
                    deployedNetwork.address,
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

    const getOwner = async (e) => {
        //e.preventDefault();

        const owner = await contract.methods.getOwner().call();
        setOwner(owner);
    }

    const getAdmin = async (e) => {
        e.preventDefault();

        const isAdmin = await contract.methods.isAdmin(admin).call();
        if (isAdmin)
            setIsAdmin(admin + " is an admin");
        else
            setIsAdmin(admin + " is not an admin");
        setAdmin("");
    }

    const getHospital = async (e) => {
        e.preventDefault();
        try {
            
            const hos = await contract.methods.getHospitalById(hospitalId).call();
            setHospital(hos);
         
        } catch (error) {
            console.log(error)
            window.alert("Could not get details of hospital. Please check Hospial Id")
        }
        setHospitalId("");
    }

    const getHospitals = async (e) => {
        try {
            
            const currHosId = await contract.methods.hospitalId().call({ from: accounts[0] });
            const hos_list = [];
            for (let i = 1; i <= (currHosId - 1); i++) {
                const hos = await contract.methods.getHospitalById(i).call();
                hos_list.push(hos);
                
            }
            setHospitals(hos_list);
            console.log(hos_list);
            history("hospitals",{state:{data:hos_list}});
            
            
        } catch (error) {
            console.log(error)
            window.alert("Could not get details of hospital. Please check Hospial Id")
        }
        setHospitalId("");
    }

    const getOrg = async (e) => {
        e.preventDefault();
        try {
            const hos = await contract.methods.getOrganizationById(orgId).call();
            setOrg(hos);
        } catch (error) {
            window.alert("Could not get details of Organization. Please check Organization Id")
        }
        setOrgId("");
    }

    if (!isReady()) {
        return <Loading />;
    }
    return (
        <>
            <section className="public-dash-wrapper">
                <div className="container" >
                    <div className="section-title" >
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Text color="primary" h2>Public Dashboard</Text>
                            <Text >Explore the different features available for public use.</Text>

                        </div>

                    </div>
                    <div className="get-owner"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            marginLeft: "10%",
                            marginTop: "4%",
                            marginBottom: "2%"
                        }}>
                        <Text h4 css={{ marginBottom: "2rem" }}>Get Address of the Owner</Text>


                        <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", alignItems: "center", gap: "2rem",zIndex:"1" }}>

                            <Button type='submit' onPress={getOwner} shadow auto color="primary" rounded>Click Here </Button>
                            <Text color='success'>
                                {owner ? (`Owner's Address : ${owner}`)
                                    : ""}
                            </Text>
                        </div>

                    </div>
                    <div className="check-admin"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            marginLeft: "10%",
                            marginTop: "4%",
                            marginBottom: "2%",
                        }}>
                        <Text h4 css={{ marginBottom: "2rem" }}>Check for Admin</Text>
                        <form onSubmit={getAdmin}>

                            <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>

                                <Input
                                    clearable
                                    type="text"
                                    bordered
                                    labelPlaceholder="Admin's Address"
                                    color="primary"
                                    required={true}
                                    width='400px'
                                    value={admin}

                                    onChange={e => setAdmin(e.target.value)}

                                />
                                <Button type='submit' shadow auto color="primary" rounded>Click Here </Button>
                            </div>
                        </form>
                        <div className="is-admin">
                            <Text color="secondary" css={{ marginTop: "1rem" }}>{isAdmin}</Text>
                        </div>
                    </div>


                    <div className="get-hospital-details"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            marginLeft: "10%",
                            marginTop: "4%",
                            marginBottom: "2%"
                        }}>
                        <Text h4 css={{ marginBottom: "2rem" }}>Get Details of Hospital</Text>
                        <form onSubmit={getHospital}>

                            <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>

                                <Input
                                    type="number"
                                    bordered
                                    labelPlaceholder="Hospital's Id"
                                    color="primary"
                                    required={true}
                                    width='400px'
                                    value={hospitalId}
                                    onChange={e => setHospitalId(e.target.value)}

                                />
                                <Button type='submit' shadow auto color="primary" rounded>Click Here </Button>
                                <Button  shadow auto color="primary" onPress={getHospitals} >View All</Button>
                            </div>
                        </form>
             
                        <div className="details">
                            {!hospital
                                ? <></>
                                : (<ul>
                                    <li className="row">
                                        <span className="col-md-3">Hospital Name :</span> {hospital.name}
                                    </li>
                                    <li className="row">
                                        <span className="col-md-3">Hospital Id :</span> {hospital.id}
                                    </li>
                                    <li className="row">
                                        <span className="col-md-3">Hospital's Address :</span> {hospital.physicalAddress}
                                    </li>
                                    <li className="row">
                                        <span className="col-md-3">Hospital's Ethereum Address :</span> {hospital.walletAddress}
                                    </li>
                                    <li className="row">
                                        <span className="col-md-3 license">License :</span>
                                        <img src={`${gateway}${hospital.License}`} alt="license of hospital" />
                                    </li>
                                </ul>)}
                        </div>
                    </div>

                    <div className="get-organization-details"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            marginLeft: "10%",
                            marginTop: "4%",
                            marginBottom: "2%"
                        }}>
                        <Text h4 css={{ marginBottom: "2rem" }}>Get Details of Organization</Text>
                        <form onSubmit={getOrg}>

                            <div style={{ display: "flex", flexDirection: "row", justifyItems: "center", gap: "2rem" }}>

                                <Input
                                    clearable
                                    type="text"
                                    bordered
                                    labelPlaceholder="Organization's Id"
                                    color="primary"
                                    required={true}
                                    width='400px'
                                    value={orgId}

                                    onChange={e => setOrgId(e.target.value)}

                                />
                                <Button type='submit' shadow auto color="primary" rounded>Click Here </Button>
                            </div>
                        </form>
                        <div className="details">
                            {!org
                                ? <></>
                                : (<ul>
                                    <li className="row">
                                        <span className="col-md-3">Organization Name :</span> {org.name}
                                    </li>
                                    <li className="row">
                                        <span className="col-md-3">Organization Id :</span> {org.id}
                                    </li>
                                    <li className="row">
                                        <span className="col-md-3">Organization's Ethereum Address :</span> {org.walletAddress}
                                    </li>
                                    <li className="row">
                                        <span className="col-md-3 license">License :</span>
                                        <img src={`${gateway}${org.License}`} alt="license of hospital" />
                                    </li>
                                </ul>)}
                        </div>

                    </div>




                </div>
            </section>
        </>
    )
}

export default PublicDashBoard