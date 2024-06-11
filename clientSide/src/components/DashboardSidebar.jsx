import { Sidebar } from 'flowbite-react';
import {Link} from "react-router-dom";
import {HiUser, HiArrowSmRight} from 'react-icons/hi';
import {useState, useEffect} from 'react';
import {useDispatch} from "react-redux";
import {signOutSuccess} from "../redux/user/userSlice";

function DashboardSidebar () {
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search])

    const handleSignout = async() => {
        try {
            const response = await fetch("/api/user/signout", {
                method: "POST",
            })
            const responseData = await response.json();

            if (responseData.success == false) {
                console.log(responseData.message);
            } else {
                dispatch(signOutSuccess());
            }
        } catch(error) {
            console.log(error.message);
        }
    }

    return (
        <Sidebar className="w-full md:w-56">
            <Sidebar.Items>
                <Sidebar.ItemGroup className="flex flex-col gap-1">
                    <Link to="/dashboard?tab=profile">
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label='User' labelColor='dark' as='div'>
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Item onClick={handleSignout} icon={HiArrowSmRight} className='cursor-pointer'>Sign out</Sidebar.Item> 
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashboardSidebar;
