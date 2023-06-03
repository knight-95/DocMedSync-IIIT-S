import React from 'react'
import "./Record.css";
import { gateway } from '../../config';
import { Button } from '@nextui-org/react';
import {ConfigProvider, theme, Descriptions } from 'antd';
import useDarkMode from 'use-dark-mode';

const Record = ({ record }) => {
    const darkMode = useDarkMode(false);
    return (
        <>

            <div className="container record">
                <ConfigProvider
                    theme={{
                        algorithm: darkMode.value == false ? theme.defaultAlgorithm : theme.darkAlgorithm,

                    }}
                >
                    <Descriptions
                        title="Record Details"
                        bordered
                        column={{
                            xxl: 4,
                            xl: 3,
                            lg: 3,
                            md: 3,
                            sm: 2,
                            xs: 1,
                        }}
                        extra={<a href={`${gateway}${record.docs}`}>
                            <Button size="sm">Download Record</Button>
                        </a>}
                    >
                        <Descriptions.Item label="Hospital Id">{record.hospitalId}</Descriptions.Item>
                        <Descriptions.Item label="Condition"> {record.condition}</Descriptions.Item>

                        <Descriptions.Item label="Allergies">{record.allergy}</Descriptions.Item>
                        <Descriptions.Item label="Description">{record.description}</Descriptions.Item>

                    </Descriptions>
                </ConfigProvider>


            </div>

        </>
    )
}

export default Record
