import React from "react";
import '../../App.css';
import Navbar from './OfficerNavbar';


function OfficeHome() {
    return(
    <>
        <Navbar/>
        <div className="hi">
        {/*<img src="/images/dashboard.jpg" no-repeat center fixed alt="Dashboard"
          style={{ maxWidth: "100%", height: "auto" }} />*/}
        </div>
    </>
    )
}

export default OfficeHome;