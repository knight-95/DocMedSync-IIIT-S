import React from 'react'
import { gateway } from '../../../config'

import { useLocation } from 'react-router-dom';
import { Table } from '@nextui-org/react';



const HospitalsTable = () => {


    const location = useLocation();
    const rows = location.state.data;

    const columns = [
        {
            key: "name",
            label: "NAME",
        },
        {
            key: "physicalAddress",
            label: "ADDRESS",
        },
        {
            key: "walletAddress",
            label: "ETHEREUM ADDRESS",
        },
        //{
        //    key: "License",
        //    label: "IPFS Hash",
        //},

    ];


    return (
        <>
            <div style={{
                display: "flex",
                flexDirection:"column",
          
               
                flexGrow: "$1",
                marginTop: "5rem",
                margin: "4rem",
                height:"60vh"
            }}>

                <Table
                    aria-label="All registered hospitals"
                    css={{
                        height: "auto",
                        width: "100%",
                        zIndex: "$1",
   
                    }}
                    lined
                    headerLined
                    bordered

                    selectionMode="single"

                >
                    <Table.Header columns={columns}>
                        {(column) => (
                            <Table.Column key={column.key}>{column.label}</Table.Column>
                        )}
                    </Table.Header>
                    <Table.Body items={rows}>
                        {(item) => (
                            <Table.Row key={item.key}>
                                {(columnKey) => <Table.Cell>{item[columnKey]}</Table.Cell>}
                            </Table.Row>
                        )}
                    </Table.Body>
                </Table>

            </div>




        </>
    )



}

export default HospitalsTable