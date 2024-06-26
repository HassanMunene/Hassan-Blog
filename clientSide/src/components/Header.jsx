import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation, useNavigate} from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import {useSelector, useDispatch} from "react-redux";
import {toogleTheme} from "../redux/theme/themeSlice";
import {signOutSuccess} from "../redux/user/userSlice";
import {useState, useEffect} from 'react';

function Header() {
	const path = useLocation().pathname;
	const {user: currentUser} = useSelector((state) => state.user);
    const {theme} = useSelector((state) => state.theme);
    const dispatch = useDispatch();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('SearchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchTerm}`);
    }

	return (
		<Navbar className="border-b-2">
			<Link to="/" className="self-centered whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
				<span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded text-white">
                    Hassan's</span>
                    Blog
			</Link>
			<form onSubmit={handleSubmit}>
				<TextInput
					type="text"
					placeholder="Search"
					rightIcon={AiOutlineSearch}
					className="hidden md:inline"
                	value={searchTerm}
                	onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</form>
			<Button className='w-12 h-10 md:hidden' color="gray" pill>
				<AiOutlineSearch/>
			</Button>
			<div className="flex gap-2 md:order-2">
				<Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={() => dispatch(toogleTheme())}>
                    {theme === 'light' ? (<FaMoon />) : (<FaSun />)}
				</Button>
				{currentUser ? (
					<Dropdown arrowIcon={false} inline label={<Avatar alt="userProfile" img={currentUser.profilePicture} rounded/>}>
						<Dropdown.Header>
							<span className='block text-sm'>@{currentUser.username}</span>
              				<span className='block text-sm font-medium truncate'>{currentUser.email}</span>
						</Dropdown.Header>
						{currentUser.isAdmin && (
							<>
								<Link to={"/dashboard?tab=dash"}><Dropdown.Item>Dashboard</Dropdown.Item></Link>
								<Dropdown.Divider />
							</>
						)}
						<Link to={"/dashboard?tab=profile"}><Dropdown.Item>Profile</Dropdown.Item></Link>
						<Dropdown.Divider />
						<Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
					</Dropdown>
					) : (
					<Link to="/signin">
						<Button gradientDuoTone="purpleToBlue" outline>
							Signin
						</Button>
					</Link>
					)
				}
				<Navbar.Toggle/>
			</div>
			<Navbar.Collapse>
				<Navbar.Link active={path === "/"} as={'div'}>
					<Link to="/">Home</Link>
				</Navbar.Link>
				<Navbar.Link active={path === "/about"} as={'div'}>
					<Link to="/about">About</Link>
				</Navbar.Link>
				<Navbar.Link active={path === "/projects"} as={'div'}>
					<Link to="/projects">Projects</Link>
				</Navbar.Link>
			</Navbar.Collapse>
		</Navbar>
	)
}

export default Header;
