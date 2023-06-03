import {
    Routes,
    Route,
} from "react-router-dom";

import MainDasboard from "./Main/MainDasboard";
import Owner from "./Owner/Owner";
import PublicDashBoard from "./Public/Public";
import React from 'react'
import Admin from "./Admin/admin";
import Hospital from "./Hospital/Hospital";
import PatientDashboard from "./Patient/Patient"
import Auth from "./Auth/Auth";
import HospitalsTable from "./Public/HospitalsTable";
export default function Dashboard() {
    return (
        <Routes>


            <Route path="/" element={<MainDasboard />} />
            <Route exact path="/owner" element={<Owner />} />
            <Route exact path="/public" element={< PublicDashBoard/>} />
            <Route exact path="public/hospitals" element={<HospitalsTable/>} />
            <Route exact path="/admin" element={< Admin/>} />
            <Route exact path="/hospital" element={<Hospital/>} />
            <Route exact path="/patient" element={<PatientDashboard/>} />
            <Route exact path="/auth" element={<Auth/>} />



        </Routes>

    )
}
