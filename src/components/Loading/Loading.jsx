import React from 'react'
import "./Loading.css";
import { Loading as Loader } from "@nextui-org/react";

const Loading = () => {
    return (
        <div className="loading-wrapper">
             <Loader  size="lg"  type="gradient">Loading</Loader>
        </div>
    )
}

export default Loading
