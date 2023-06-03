import { Card, Grid, Row, Text, Link, Col, Button } from "@nextui-org/react";
import { Box } from '../../components/styles/box'


export default function About() {
    const list = [
        {
            title: "Docmedsync is a decentralised system for sharing electronic medical records (EMR). You have total control over your data thanks to its fundamental technology, which is based on the Ethereum network and IPFS. Your records are only accessible to authorised parties and registered medical institutions.",
            img: "docmed.png",

        },

    ];

    return (
        <div style={{ marginTop: "1rem" }}>

            <h1 style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
            }}>
                ABOUT US
            </h1>
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "row", justifyContent: "center" }}>

                {list.map((item, index) => (

                    <Card isPressable style={{ width: "80%" }}>
                        <Card.Body css={{ p: 0 }}>
                            <Card.Image
                                src={"docmed.png"}
                                // objectFit="fill"
                                width="80%"
                                height={210}
                                objectFit="contain"
                                alt="cover"
                            />
                        </Card.Body>
                        <Card.Footer css={{ justifyItems: "center", fitContent: "80%" }}>
                            <Row wrap="wrap" justify="CENTER" align="center">
                                <Text b>{item.title}</Text>

                            </Row>
                        </Card.Footer>
                    </Card>




                ))}

            </div>

            <div>
                <h3 style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginTop: "2rem", marginLeft: "10%", marginRight: "10%" }}>
                    <Button shadow color="error" auto css={{
                        zIndex: "1"

                    }}>

                        THE PROBLEM</Button></h3>
                <br></br>
                <h5 style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex start",
                    marginLeft: "10%",
                    marginRight: "10%",
                    padding: "1rem",
                    background: "rgba(255, 255, 255, 0.14)",
                    borderRadius: "10px",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(4.6px)",
                    webkitBackdropFilter: "blur(4.6px)",

                }}>
                    Docmedsync is a decentralized solution for Electronic Medical Records (EMR) sharing systems.
                    It is built on the Ethereum blockchain and leverages the InterPlanetary File System (IPFS) to provide a secure and efficient way of sharing medical records.
                    One of the major issues faced by traditional EMR systems is the lack of interoperability and data silos.
                    This makes it difficult for healthcare providers to access and share patient information, leading to inefficiencies and potential errors in care.
                    Docmedsync solves this problem by providing a decentralized platform where medical records can be securely stored and easily shared among authorized parties.
                </h5>
                <Box css={{
                    display: "flex", flexDirection: "column",
                    justifyContent: "center",
                    marginTop: "4rem",
                    marginLeft: "5%",
                    marginRight: "5%",
                    gap: "2rem",
                    width: "90%",
                    padding: "2rem",



                    '@sm': { flexDirection: "row" }
                }}>

                    <Card css={{ p: "$6", mw: "400px", }}>
                        <Card.Header>
                            <img
                                alt="nextui logo"
                                src="https://img.freepik.com/free-vector/computer-safety-technology-icon_53876-118352.jpg?w=2000"
                                width="34px"
                                height="34px"
                            />
                            <Grid.Container css={{ pl: "$6" }}>
                                <Grid xs={12}>
                                    <Text h4 css={{ lineHeight: "$xs" }}>
                                        Potential Cybersecurity Issues
                                    </Text>
                                </Grid>

                            </Grid.Container>
                        </Card.Header>
                        <Card.Body css={{ py: "$2" }}>
                            <Text>
                                Patients' information is stored in a centralised database that is vulnerable to DoS attacks and single points of failure.
                            </Text>
                        </Card.Body>


                    </Card>
                    <Card css={{ p: "$6", mw: "400px" }}>
                        <Card.Header>
                            <img
                                alt="nextui logo"
                                src="https://www.auditboard.com/img/blog/Privacy-vs-Security-blog.png"
                                width="34px"
                                height="34px"
                            />
                            <Grid.Container css={{ pl: "$6" }}>
                                <Grid xs={12}>
                                    <Text h4 css={{ lineHeight: "$xs" }}>
                                        Privacy of Patients
                                    </Text>
                                </Grid>

                            </Grid.Container>
                        </Card.Header>
                        <Card.Body css={{ py: "$2" }}>
                            <Text>
                                If a hack is ever made into the database. It is unethical for patient data to be exposed to the public. Systems that are centralised are also susceptible to privacy violations.
                            </Text>
                        </Card.Body>


                    </Card>
                    <Card css={{ p: "$6", mw: "400px" }}>
                        <Card.Header>
                            <img
                                alt="nextui logo"
                                src="https://thumbs.dreamstime.com/b/globe-stats-5682496.jpg"
                                width="34px"
                                height="34px"
                            />
                            <Grid.Container css={{ pl: "$6" }}>
                                <Grid xs={12}>
                                    <Text h4 css={{ lineHeight: "$xs" }}>
                                        Inaccurate Data
                                    </Text>
                                </Grid>

                            </Grid.Container>
                        </Card.Header>
                        <Card.Body css={{ py: "$2" }}>
                            <Text>
                                Anyone viewing an EMR could obtain inaccurate information if it is not updated right once after new information becomes available, such as after test results are received.
                            </Text>
                        </Card.Body>


                    </Card>
                    <Card css={{ p: "$6", mw: "400px", h: "initial" }}>
                        <Card.Header>
                            <img
                                alt="nextui logo"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj51mHkrj3C3RIrQC4O74Aj6dxu3EDWt_x4g&usqp=CAU"
                                width="34px"
                                height="34px"
                            />
                            <Grid.Container css={{ pl: "$6" }}>
                                <Grid xs={12}>
                                    <Text h4 css={{ lineHeight: "$xs" }}>
                                        Time and Money
                                    </Text>
                                </Grid>

                            </Grid.Container>
                        </Card.Header>
                        <Card.Body css={{ py: "$2" }}>
                            <Text>
                                To identify and deploy the ideal EHR system for your practise, it also needs time to demo EHR products and negotiate with EHR system providers.
                            </Text>
                        </Card.Body>


                    </Card>


                </Box>
                <div>
                    <h3 style={{
                        display: "flex", flexDirection: "row", justifyContent: "center", marginTop: "2rem", marginLeft: "10%", marginRight: "10%", padding: "0.1rem",

                    }}> <Button shadow color="gradient" auto css={{
                        zIndex: "$1",
                    }}>
                            OUR SOLUTIONS
                        </Button></h3>
                    <br></br>
                    <h5 style={{
                        display: "flex", flexDirection: "row", justifyContent: "center", marginLeft: "10%", marginRight: "10%", padding: "1rem",
                        background: "rgba(255, 255, 255, 0.14)",
                        borderRadius: "10px",
                        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                        backdropFilter: "blur(4.6px)",
                        webkitBackdropFilter: "blur(4.6px)",
                    }}>A decentralised, user-friendly electronic medical record system is offered by Docmedsync.
                        It is an online application that can be used for free and has a feature-rich, interactive user interface that makes it simple to use.
                        Docmedsync offers a powerful solution for EMR systems by providing a secure and efficient way of sharing medical records and enabling patients to have more control over their own data.
                        This helps to break down data silos and improves interoperability,
                        thus making the healthcare system more efficient and effective.
                    </h5>

                    <Box css={{
                        display: "flex", flexDirection: "column",
                        justifyContent: "center",

                        marginTop: "4rem",
                        marginLeft: "5%",
                        marginRight: "5%",
                        gap: "2rem", width: "auto",
                        padding: "2rem",




                        '@sm': { flexDirection: "row" }
                    }}>

                        <Card css={{ p: "$6", mw: "400px" }}>
                            <Card.Header>
                                <img
                                    alt="nextui logo"
                                    src="https://www.proofpoint.com/sites/default/files/styles/image_768_300/public/50-50-red-blue-cyber-computer_us.png?itok=2fm6BC2P"

                                    width="34px"
                                    height="34px"
                                />
                                <Grid.Container css={{ pl: "$6" }}>
                                    <Grid xs={12}>
                                        <Text h4 css={{ lineHeight: "$xs" }}>
                                            Minimal Security Risks
                                        </Text>
                                    </Grid>

                                </Grid.Container>
                            </Card.Header>
                            <Card.Body css={{ py: "$2" }}>
                                <Text>
                                    Since we run our processing over the Ethereum Network, it is extremely safe and secure. A single point of failure is impossible.

                                </Text>
                            </Card.Body>


                        </Card>

                        <Card css={{ p: "$6", mw: "400px" }}>
                            <Card.Header>
                                <img
                                    alt="nextui logo"
                                    src="https://telecomtalk.info/wp-content/uploads/2021/05/everything-you-need-to-know-internet-privacy.jpg"
                                    width="34px"
                                    height="34px"
                                />
                                <Grid.Container css={{ pl: "$6" }}>
                                    <Grid xs={12}>
                                        <Text h4 css={{ lineHeight: "$xs" }}>
                                            Complete Privacy
                                        </Text>
                                    </Grid>

                                </Grid.Container>
                            </Card.Header>
                            <Card.Body css={{ py: "$2" }}>
                                <Text>
                                    The application stored patient data using IPFS technology. Patients have control over who has access to their information.

                                </Text>
                            </Card.Body>


                        </Card>
                        <Card css={{ p: "$6", mw: "400px" }}>
                            <Card.Header>
                                <img
                                    alt="nextui logo"
                                    src="https://static.vecteezy.com/system/resources/previews/002/380/203/non_2x/isometric-people-working-with-technology-illustration-free-vector.jpg"

                                    width="34px"
                                    height="34px"
                                />
                                <Grid.Container css={{ pl: "$6" }}>
                                    <Grid xs={12}>
                                        <Text h4 css={{ lineHeight: "$xs" }}>
                                            Verifies Admins
                                        </Text>
                                    </Grid>

                                </Grid.Container>
                            </Card.Header>
                            <Card.Body css={{ py: "$2" }}>
                                <Text>
                                    A Medical Institute must be approved by one of the admins in order to use this shared system. Likewise with organisations. To successfully register, they need valid identification documents and medical clearance.


                                </Text>
                            </Card.Body>


                        </Card>


                        <Card css={{ p: "$6", mw: "400px" }}>
                            <Card.Header>
                                <img
                                    alt="nextui logo"
                                    src="https://img.freepik.com/premium-vector/healthy-human-heart-beats-3d-medicine-model-low-poly-triangle-connected-dots-glow-point-red-background-pulse-internal-body-modern-anatomical-shape-innovative-technology-render-vector-illustration_115739-1468.jpg?w=2000"


                                    width="34px"
                                    height="34px"
                                />
                                <Grid.Container css={{ pl: "$6" }}>
                                    <Grid xs={12}>
                                        <Text h4 css={{ lineHeight: "$xs" }}>
                                            Non Profit
                                        </Text>
                                    </Grid>

                                </Grid.Container>
                            </Card.Header>
                            <Card.Body css={{ py: "$2" }}>
                                <Text>

                                    Docmedsync is a system that is free to use and nonprofit. This software is not required to be purchased. It is accessible to all.


                                </Text>
                            </Card.Body>


                        </Card>
                    </Box>


                </div>
            </div>
        </div >

    );

}
