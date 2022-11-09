import { Navigate } from "react-router";

const LogOut = () => {
    sessionStorage.clear();
    localStorage.clear();
    return ( 
        <Navigate to={"/"} />
     );
}
 
export default LogOut;