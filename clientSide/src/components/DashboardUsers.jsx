import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Table, Button, Modal} from "flowbite-react";
import {Link} from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi2";

function DashboardUsers() {
    const {user: currentUser} = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`/api/user/get-users`);
                const responseData = await response.json();
                if (responseData.success == true) {
                    setUsers(responseData.users)
                    if (responseData.users.length < 8) {
                        setShowMore(false);
                    }
                }
            } catch(error) {
                console.log(error);
            }
        }
        if (currentUser.isAdmin) {
            fetchPosts();
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const response = await fetch(`/api/user/get-users?startIndex=${startIndex}`);
            const responseData = await response.json();
            if (responseData.success == true) {
                setUsers((prev) => [...prev, ...responseData.users]);
                if (responseData.posts.length < 8) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteUser = async() => {
        setShowModal(false);
        try {
            const response = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: "DELETE",
            });
            const responseData = await response.json();
            if (responseData.success == true) {
                setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete))
            } else {
                console.log(responseData.message);
                return;
            }
        } catch(error) {
            console.log(error);
        }
    }
    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {users.map((user) => (
                            <Table.Body className='divide-y' key={user._id}>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/user/${user.username}`}>
                                            <img src={user.profilePicture} alt={user.username} 
                                                className='w-20 h-10 object-cover bg-gray-500' />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link className='font-medium text-gray-900 dark:text-white' to={`/user/${user.username}`}>
                                            {user.username}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>{user.isAdmin ? "yes": "No"}</Table.Cell>
                                    <Table.Cell>
                                        <span onClick={() => {setShowModal(true); setUserIdToDelete(user._id)}}
                                            className='font-medium text-red-500 hover:underline cursor-pointer'>
                                            Delete
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
                            Show more
                        </button>
                    )}
                </>
            ) : (<p>You have no users yet!</p>)}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this user?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteUser}>Yes, Im sure</Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default DashboardUsers;