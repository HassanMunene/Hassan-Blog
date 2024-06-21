import {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {HiAnnotation, HiDocumentText, HiOutlineUserGroup,} from 'react-icons/hi';
import {Button, Table} from "flowbite-react";
import {Link} from "react-router-dom";

function DashboardComponent () {
    const [totalUsers, setTotalUsers] = useState(0);
    const {user: currentUser} = useSelector((state) => state.user);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`/api/user/get-users?limit=5`);
                const responseData = await response.json();
                if (responseData.success == true) {
                    setTotalUsers(responseData.totalUsers);
                    setLastMonthUsers(responseData.lastMonthUsers);
                    setUsers(responseData.users);
                }
                if (responseData.success == false) {
                    console.log(responseData);
                }
            } catch(error) {
                console.log(error);
            }
        }
        const fetchComments = async () => {
            try {
                const response = await fetch(`/api/comment/get-comments?limit=5`);
                const responseData = await response.json();
                if (responseData.success == true) {
                    setTotalComments(responseData.totalComments);
                    setLastMonthComments(responseData.lastMonthComments);
                    setComments(responseData.comments);
                }
                if (responseData.success == false) {
                    console.log(responseData);
                }
            } catch(error) {
                console.log(error);
            }
        }
        const fetchPosts = async () => {
            try {
                const response = await fetch(`/api/post/get-posts?limit=5`);
                const responseData = await response.json();
                if (responseData.success == true) {
                    setTotalPosts(responseData.totalPosts);
                    setLastMonthPosts(responseData.lastMonthPosts);
                    setPosts(responseData.posts);
                }
                if (responseData.success == false) {
                    console.log(responseData);
                }
            } catch(error) {
                console.log(error);
            }
        }
        if (currentUser.isAdmin) {
            fetchUsers();
            fetchComments();
            fetchPosts();
        }
    }, [currentUser])

    return (
        <div className="p-3 md:mx-auto">
            <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-gray-500 text-md uppercase">Total users</h3>
                            <p className="text-2xl">{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className='text-green-500 flex items-center'>{lastMonthUsers}</span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-gray-500 text-md uppercase">Total comments</h3>
                            <p className="text-2xl">{totalComments}</p>
                        </div>
                        <HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className="flex gap-2 text-sm">
                        <span className='text-green-500 flex items-center'>{lastMonthComments}</span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                    <div className='flex justify-between'>
                        <div>
                            <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
                            <p className='text-2xl'>{totalPosts}</p>
                        </div>
                        <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                    </div>
                    <div className='flex  gap-2 text-sm'>
                        <span className='text-green-500 flex items-center'>
                            {lastMonthPosts}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className='flex justify-between  p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2'>Recent users</h1>
                        <Button outline gradientDuoTone='purpleToPink'>
                            <Link to={'/dashboard?tab=users'}>See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                        </Table.Head>
                        {users && users.map((user) => (
                            <Table.Body key={user._id} className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        <img
                                            src={user.profilePicture}
                                            alt='user'
                                            className='w-10 h-10 rounded-full bg-gray-500'
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{user.username}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className='flex justify-between  p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2'>Recent Comments</h1>
                        <Button outline gradientDuoTone='purpleToPink'>
                            <Link to={'/dashboard?tab=comments'}>See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Comment content</Table.HeadCell>
                            <Table.HeadCell>Likes</Table.HeadCell>
                        </Table.Head>
                        {comments && comments.map((comment) => (
                            <Table.Body key={comment._id} className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell className="w-96">
                                        <p className="line-clamp-2">{comment.content}</p>
                                    </Table.Cell>
                                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className='flex justify-between  p-3 text-sm font-semibold'>
                        <h1 className='text-center p-2'>Recent posts</h1>
                        <Button outline gradientDuoTone='purpleToPink'>
                            <Link to={'/dashboard?tab=posts'}>See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell>Post title</Table.HeadCell>
                            <Table.HeadCell>Post content</Table.HeadCell>
                        </Table.Head>
                        {posts && posts.map((post) => (
                            <Table.Body key={post._id} className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        <img
                                            src={post.image}
                                            alt='post cover'
                                            className='w-14 h-10 rounded-md bg-gray-500'
                                        />
                                    </Table.Cell>
                                    <Table.Cell className="w-96">{post.title}</Table.Cell>
                                    <Table.Cell className="w-5">{post.category}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default DashboardComponent;
