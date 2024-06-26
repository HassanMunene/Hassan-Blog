import { Sidebar } from 'flowbite-react';
import {Link} from "react-router-dom";
import {HiUser, HiArrowSmRight, HiDocumentText} from 'react-icons/hi';
import {useState, useEffect} from 'react';
import {useDispatch} from "react-redux";
import {signOutSuccess} from "../redux/user/userSlice";
import {useSelector} from "react-redux";
import { FaUsers } from "react-icons/fa6";
import { HiAnnotation } from "react-icons/hi";
import { HiChartPie } from "react-icons/hi";

function DashboardSidebar () {
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();
    const {user: currentUser} = useSelector((state) => state.user);

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
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} 
                            label={currentUser.isAdmin ? "Admin" : "User"} labelColor='dark' as='div'
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {currentUser.isAdmin && (
                        <Link to="/dashboard?tab=dash">
                            <Sidebar.Item active={tab === 'dash'} icon={HiChartPie} as='div'>Dashboard</Sidebar.Item>
                        </Link>
                    )}
                    {currentUser.isAdmin && (
                        <Link to="/dashboard?tab=posts">
                            <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} as='div'>
                                Posts
                            </Sidebar.Item>
                        </Link>
                    )}
                    {currentUser.isAdmin && (
                        <Link to="/dashboard?tab=users">
                            <Sidebar.Item active={tab === 'users'} icon={FaUsers} as='div'>Users</Sidebar.Item>
                        </Link>
                    )}
                    {currentUser.isAdmin && (
                         <Link to="/dashboard?tab=comments">
                             <Sidebar.Item active={tab === 'comments'} icon={HiAnnotation} as='div'>Comments</Sidebar.Item>
                         </Link>
                     )}

                    <Sidebar.Item onClick={handleSignout} icon={HiArrowSmRight} className='cursor-pointer'>Sign out</Sidebar.Item> 
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashboardSidebar;
