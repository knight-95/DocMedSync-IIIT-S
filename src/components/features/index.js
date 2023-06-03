import { Card, Divider, Text } from '@nextui-org/react';
import React from 'react';
import { BoxIcon } from '../icons/BoxIcon.tsx';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';

export const Features = () => {
    return (
        <>
            <Box
                css={{
                    px: '$6',
                    pb: '$14',
                }}
            >
                <Flex
                    direction={'column'}
                    justify={'center'}
                    align={'center'}
                    css={{
                        pt: '$20',
                    }}
                >
               
                    <Text h3 css={{ color: '$blue600' }}>A Secure Medical Record System</Text>
                    <Text
                        span
                        css={{
                            maxWidth: '800px',
                            color: '$accents8',
                            textAlign: 'center',
                        }}
                    >
                       Docmedsync is a blockchain-based electronic medical record system that allows providers to securely exchange information with patients and other providers.
                    </Text>
                </Flex>
                <Flex
                    align={'center'}
                    justify={'center'}
                    wrap={'wrap'}
                    css={{
                        gap: '1rem',
                        pt: '$14',
                    }}
                >
                    <Card css={{ mw: '500px' }}>
                        <Card.Body>
                            <Flex css={{ gap: '0.5rem' }}>
                                <BoxIcon />
                                <Flex direction={'column'}>
                                    <Text h5>Medical records for everyone!</Text>
                                    <Text span>
                                        Docmedsync provides a secure, private, and reliable way to store your medical records.
                                        Our system also aims to provide an easy way for providers to send and share data with patients.
                                    </Text>
                                </Flex>
                            </Flex>
                        </Card.Body>
                    </Card>
                    <Card css={{ mw: '500px' }}>
                        <Card.Body>
                            <Flex css={{ gap: '0.5rem' }}>
                                <BoxIcon />
                                <Flex direction={'column'}>
                                    <Text h5>Patients own their data!</Text>
                                    <Text span>
                                    We put the patient in control of their data and allow them to decide who they want to share it with. Blockchain technology ensures that all access permissions are tracked and audit-able.
                                    </Text>
                                </Flex>
                            </Flex>
                        </Card.Body>
                    </Card>
                </Flex>
                <Flex
                    align={'center'}
                    wrap={'wrap'}
                    justify={'center'}
                    css={{
                        gap: '1rem',
                        pt: '$8',
                    }}
                >
                    <Card css={{ mw: '500px' }}>
                        <Card.Body>
                            <Flex css={{ gap: '0.5rem' }}>
                                <BoxIcon />
                                <Flex direction={'column'}>
                                    <Text h5>A secure medical record system with a difference</Text>
                                    <Text span>
                                    We're using Blockchain technology to ensure that your medical records are safe and secure. And you, not your doctor, get to decide who can see them.
                                    </Text>
                                </Flex>
                            </Flex>
                        </Card.Body>
                    </Card>
                    <Card css={{ mw: '500px' }}>
                        <Card.Body>
                            <Flex css={{ gap: '0.5rem' }}>
                                <BoxIcon />
                                <Flex direction={'column'}>
                                    <Text h5>Connects our medical community!</Text>
                                    <Text span>
                                    This is a decentralized platform that connects doctors, hospitals, clinics, labs, pharmacies, and other healthcare stakeholders.
                                    </Text>
                                </Flex>
                            </Flex>
                        </Card.Body>
                    </Card>
                </Flex>
            </Box>

            
        </>
    );
};