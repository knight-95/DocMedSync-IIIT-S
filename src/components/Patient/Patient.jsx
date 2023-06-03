import React from 'react'
import "./Patient.css";
import { gateway } from '../../config';
import { ConfigProvider, theme, Descriptions,Image } from 'antd';
import useDarkMode from 'use-dark-mode';

const Patient = ({ patient }) => {
    const darkMode = useDarkMode(false);
    return (
        <>
            <div className="Container patient">
                <ConfigProvider
                    theme={{
                        algorithm: darkMode.value == false ? theme.defaultAlgorithm : theme.darkAlgorithm,

                    }}
                >
                    <Descriptions
                        title="Patient Details"
                        bordered
                        column={{
                            xxl: 4,
                            xl: 3,
                            lg: 3,
                            md: 3,
                            sm: 2,
                            xs: 1,
                        }}
                        extra={
                            <Image
                                width={200}
                                height={112}
                                src={`${gateway}${patient[7]}`}
                                alt="Patient Image"
                            />
                        }
                    >
                        <Descriptions.Item label="Name">{patient[1]}</Descriptions.Item>
                        <Descriptions.Item label="ID">{patient[0]}</Descriptions.Item>
       
                        <Descriptions.Item label="Gender">{patient[2]}</Descriptions.Item>
                        <Descriptions.Item label="Blood Grp">{patient[3]}</Descriptions.Item>
                        <Descriptions.Item label="Date of Birth">{patient[4]}</Descriptions.Item>
                        <Descriptions.Item label="Phone Number">{patient[5]}</Descriptions.Item>
                        <Descriptions.Item label="Address">{patient[6]}</Descriptions.Item>
                        <Descriptions.Item label="Ethereum Address">{patient[8]}</Descriptions.Item>
                       

                    </Descriptions>
                </ConfigProvider>





                
            </div>
        </>
    )
}

export default Patient
