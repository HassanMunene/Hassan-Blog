import DashboardSidebar from "../components/DashboardSidebar";
import {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import DashboardProfile from "../components/DashboardProfile";

function Dashboard() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if(tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);
	return (
		<div className="min-h-screen flex flex-col md:flex-row">
            {/*SIDEBAR SECTION*/}
            <DashboardSidebar />
            {/*PROFILE*/}
            {tab === 'profile' && <DashboardProfile />}
        </div>

	)
}
export default Dashboard;
