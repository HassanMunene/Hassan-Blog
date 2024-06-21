import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Table, Button, Modal, Spinner} from "flowbite-react";
import {Link} from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi2";

function DashboardComments() {
    const {user: currentUser} = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`/api/comment/get-comments`);
                const responseData = await response.json();
                if (responseData.success == true) {
                    setLoading(false);
                    setComments(responseData.comments)
                    if (responseData.comments.length < 8) {
                        setShowMore(false);
                    }
                }
                if (responseData.success == false) {
                    setError("An error occurred fetching users");
                    setLoading(false)
                }
            } catch(error) {
                setLoading(false);
                setError(error.message);
                console.log(error);
            }
        }
        fetchComments();
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const response = await fetch(`/api/comment/get-comments?startIndex=${startIndex}`);
            const responseData = await response.json();
            if (responseData.success == true) {
                setComments((prev) => [...prev, ...responseData.comments]);
                if (responseData.comments.length < 8) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteUser = async() => {
        setShowModal(false);
        try {
            const response = await fetch(`/api/comment/delete-comment/${commentIdToDelete}`, {
                method: "DELETE",
            });
            const responseData = await response.json();
            if (responseData.success == true) {
                setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete))
            } else {
                console.log(responseData);
                return;
            }
        } catch(error) {
            console.log(error);
        }
    }
    if (loading) {
        return (
            <div className="flex mx-auto justify-center items-center min-h-screen">
                <Spinner size="xl"/>
            </div>
        )
    }

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && comments.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Content</Table.HeadCell>
                            <Table.HeadCell>Number of likes</Table.HeadCell>
                            <Table.HeadCell>Post ID</Table.HeadCell>
                            <Table.HeadCell>User ID</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {comments.map((comment) => (
                            <Table.Body className='divide-y' key={comment._id}>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>{comment.content}</Table.Cell>
                                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                                    <Table.Cell>{comment.postId}</Table.Cell>
                                    <Table.Cell>{comment.userId}</Table.Cell>
                                    <Table.Cell>
                                        <span onClick={() => {setShowModal(true); setCommentIdToDelete(comment._id)}}
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
            ) : (<p>You have no comments yet!</p>)}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this comment?
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
export default DashboardComments;
