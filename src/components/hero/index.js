import { Button, Divider, Input, Text } from '@nextui-org/react';
import React from 'react';
import { useState, useEffect, useRef } from 'react'
import { CheckIcon } from '../icons/CheckIcon.tsx';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';
import NET from 'vanta/dist/vanta.net.min'
import useDarkMode from 'use-dark-mode';
import randomColor from "randomcolor";
import FPSStats from "react-fps-stats";
import { useNavigate } from 'react-router-dom';


export const Hero = () => {
    const darkMode = useDarkMode(false);
    const history = useNavigate();
    const [vantaEffect, setVantaEffect] = useState(null)
    const myRef = useRef(null)
    useEffect(() => {

        if (!vantaEffect) {
            setVantaEffect(NET({
                el: myRef.current,
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                backgroundColor: darkMode.value == false ? 0xffffff : 0x000000,
                maxDistance: 25,
                color: 0x0072F5,

            }))
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy()
        }
    }, [vantaEffect])

    useEffect(() => {

        console.log("Theme changed")
        if (vantaEffect) {
            vantaEffect.setOptions({ backgroundColor: darkMode.value == false ? 0xffffff : 0x000000 })
            vantaEffect.resize()
            
        }


    }, [darkMode.value])

    useEffect(() => {
        // only destroying the vantaEffect on unmount
        return () => vantaEffect?.destroy();
    }, []);
    return (
        <>
            <Box ref={myRef}
                
                css={{
                    visibility:"hidden",
                    '@xs': {
                    visibility:"visible"
                    }
                }}
               
            >
               
                <Flex


                    css={{
                        'visibility':"visible",
                        'gap': '$3',
                        'px': '$6',
                        'flexDirection': 'column',
                        'alignContent': 'center',
                        'justifyContent': 'center',
                        'alignItems': 'center',
                        'width': '100%',
                        '@sm': {
                            flexDirection: 'row',
                            mt: '$16',
                        },

                    }}
                    justify={'center'}

                >
                    <Box 
                        css={{
                            pt: '$13',

                            display: 'flex',
                            flexDirection: 'column',
                            gap: '$5',

                        }}
                    >
                        <Box 
                            css={{
                                maxWidth: '600px',
                            }}
                        >
                            <Text
                                h1
                                css={{
                                    display: 'inline',

                                }}
                            >
                                Keep your medical records safe and secure {' '}
                            </Text>
                            <Text
                                h1
                                css={{
                                    display: 'inline',


                                }}
                            >
                                with{' '}
                            </Text>
                            <Text
                                h1
                                css={{
                                    display: 'inline',
                                }}
                                color="primary"
                            >
                                Docmedsync
                            </Text>
                        </Box>

                        <Text
                            css={{
                                color: '$accents8',
                                maxWidth: '400px',
                            }}
                            size={'$lg'}
                            span
                        >
                            Docmedsync is a blockchain based electronic medical record system that offers doctors, nurses and medical professionals access to medical records and data.
                        </Text>

                        <Flex
                            css={{
                                gap: '$8',
                                pt: '$4',
                            }}
                            wrap={'wrap'}
                        >
                            <Button
                                shadow color="primary" auto
                                css={{ zIndex: '$1' }}
                                onPress={() => {
                                    
                                    if (vantaEffect) {
                                        vantaEffect.setOptions({ color: randomColor() })
                                        vantaEffect.resize()
                                    }

                                    history("/dashboard")


                                }} >Get Started</Button>
                            <Button onPress={()=>history("/about")} bordered color="primary" auto css={{ zIndex: '$1' }}>Learn More</Button>
                        </Flex>
                        <Flex
                            wrap={'wrap'}
                            css={{
                                'gap': '$8',
                                'py': '$7',
                                '@sm': {
                                    py: '$4',
                                },
                            }}
                        >
                            <Flex
                                css={{
                                    color: '$accents7',
                                    alignItems: 'center',
                                }}
                            >
                                <CheckIcon /> Easy to use.
                            </Flex>
                            <Flex
                                css={{
                                    color: '$accents7',
                                    alignItems: 'center',
                                }}
                            >
                                <CheckIcon /> Patients own their data!
                            </Flex>
                            <Flex
                                css={{
                                    color: '$accents7',
                                    alignItems: 'center',

                                }}
                            >
                                <CheckIcon />Medical records for everyone!
                            </Flex>
                        </Flex>
                    </Box>
                    <Box

                        css={{
                            '& img': {
                                width: '775px',
                                maxHeight: '500px',
                                objectFit: 'contain',

                            },
                            display: 'none',
                            '@sm': {
                                display: 'revert'

                            }



                        }}

                    >
                        <img src="https://cdn.pixabay.com/photo/2016/06/24/02/35/ehr-1476525_960_720.png" />
                    </Box>
                </Flex>
                <Divider
                    css={{ position: 'absolute', inset: '0p', left: '0', mt: '$10' }}
                />
            </Box>
        </>
    );
};