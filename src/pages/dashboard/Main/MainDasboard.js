import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Nav } from '../../../components/navbar/navbar'
import { Card, Grid, Row, Text, Avatar } from "@nextui-org/react";
import "./MainDashboard.css"
import HALO from 'vanta/dist/vanta.halo.min'
import useDarkMode from 'use-dark-mode';
import { useNavigate } from "react-router-dom";



import { Icon } from '@iconify/react';
import personPublic from '@iconify/icons-si-glyph/person-public';
import shieldKey from '@iconify/icons-mdi/shield-key';
import hospitalOutline from '@iconify/icons-healthicons/hospital-outline';
import patient24Filled from '@iconify/icons-fluent/patient-24-filled';
import adminOutlined from '@iconify/icons-eos-icons/admin-outlined';
import administratorIcon from '@iconify/icons-mdi/administrator';

export default function MainDasboard() {

    const darkMode = useDarkMode(false);
    const navigate = useNavigate();

   


    const list = [
        {
            title: "Public",
            desc: "These function are open to all and do not need any special privileges to access.",
            link: "/dashboard/public",
            icon: personPublic
        },
        {
            title: "Authorized",
            desc: "These funtions are for the authorized organization only. Make sure that you have the correct access rights before you enter.",
            link: "/dashboard/auth",
            icon: shieldKey
        },
        {
            title: "Hospital",
            desc: "These funtions are for the verified hospitals only. Make sure that you have the correct access rights before you enter.",
            link: "/dashboard/hospital",
            icon: hospitalOutline
        },
        {
            title: "Patient",
            desc: "These funtions are for registerd patients only. Make sure that you have the correct access rights before you enter.",
            link: "/dashboard/patient",
            icon: patient24Filled
        },
        {
            title: "Admins",
            desc: "These funtions are for the admins only. Make sure that you have the correct access rights before you enter.",
            link: "/dashboard/admin",
            icon: adminOutlined
        },
        {
            title: "Owner",
            desc: "These funtions are for the Owner only. Make sure that you are the owner before you access.",
            link: "/dashboard/owner",
            icon: administratorIcon
        },


    ];

    return (
        <div  style={{ marginBottom: "2rem" }} >


            <Grid.Container gap={5} justify="space-evenly" css={{ marginTop: "1rem" }}  >
                {list.map((item, index) => (
                    <Grid xs={12} sm={4} key={index} justify="center">
                        <Card
                            className='card'
                            isHoverable
                            isPressable
                            onPress={() => { navigate(item.link) }}
                            css={{
                                mw: "24rem",
                                h: "14rem",
                                p: "$6"

                            }}
                        >
                            <Card.Header css={{ justifyContent: "center" }}>

                                <Avatar size="lg" icon={<Icon icon={item.icon}  width="36" height="36" />}  />

                                <Grid.Container css={{ pl: "$6" }}>
                                    <Grid xs={12}>
                                        <Text h3  css={{ lineHeight: "$xs" }}>
                                            {item.title}
                                        </Text>
                                    </Grid>

                                </Grid.Container>
                            </Card.Header>

                            <Card.Body css={{ py: "$4" }}>
                                <Text css={{}}>
                                    {item.desc}
                                </Text>
                            </Card.Body>

                            <Card.Footer>

                            </Card.Footer>
                        </Card>
                    </Grid>
                ))}
            </Grid.Container>


        </div >
    )
}
