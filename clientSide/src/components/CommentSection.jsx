import {useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import {Button, Textarea, Alert, Modal} from "flowbite-react";
import Comment from "./Comment.jsx";
import { HiOutlineExclamationCircle } from "react-icons/hi2";

function CommentSection ({postId}) {
    const [comment, setComment] = useState('');
    const {user: currentUser} = useSelector((state) => state.user);
    const [commentError, setCommentError] = useState(null);
    const [postComments, setPostComments] = useState([]);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 300) {
            return;
        }
        try {
            const response = await fetch("/api/comment/create-comment", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({content: comment, postId: postId, userId: currentUser._id})
            });
            const responseData = await response.json();
            if (responseData.success == true) {
                setComment('');
                setCommentError(null);
                setPostComments([responseData.newComment, ...postComments])
            }
        } catch(error) {
            setCommentError(error.message);
        }
    }
    useEffect(() => {
        const fetchPostComments = async () => {
            try {
                const response = await fetch(`/api/comment/get-post-comments/${postId}`);
                const responseData = await response.json();
                if (responseData.success == true) {
                    setPostComments(responseData.postComments);
                }
            } catch(error) {
                console.log(error);
            }
        }
        fetchPostComments();
    }, [postId])

    const handleLikeComment = async (commentId) => {
        try {
            if (!currentUser) {
                navigate("/sigin")
                return;
            }
            const response = await fetch(`/api/comment/like-comment/${commentId}`, {
                method: "PUT",
            });
            const responseData = await response.json();
            setPostComments(postComments.map((comment) => 
                comment._id == commentId ? {
                    ...comment, 
                    likes: responseData.comment.likes, 
                    numberOfLikes:responseData.comment.likes.length
                } : comment
            ))
        } catch(error) {
            console.log(error);
        }
    }
    const handleEditedComment = async (comment, editedComment) => {
        setPostComments(postComments.map((c) => c._id == comment._id ? {...c, content: editedComment} : c))
    }
    const handleDeleteComment = async (commentId) => {
        setShowModal(false);
        try {
            if (!currentUser) {
                navigate("/sigin");
                return;
            }
            const response = await fetch(`/api/comment/delete-comment/${commentId}`, {
                method: 'DELETE',
            });
            const responseData = await response.json();
            if (responseData.success == true) {
                setPostComments(postComments.filter((comment) => comment._id !== commentId));
            }
        } catch(error) {
            console.log(error);
        }
    }
    return (
        <div className="max-w-2xl mx-auto w-full p-3">
            {currentUser ? (
                <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                    <p>Signed in as:</p>
                    <img src={currentUser.profilePicture} className="h-5 w-5 object-cover rounded-full" alt="profile-pic"/>
                    <Link to="/dashboard?tab=profile"  className='text-xs text-cyan-600 hover:underline'>@{currentUser.username}</Link>
                </div>
            ) : (
                <div className='text-sm text-teal-500 my-5 flex gap-1'>
                    You must be signed in to comment.
                    <Link to="/signin" className="text-blue-500 hover:underline">Sign In</Link>
                </div>
            )}
            {currentUser && (
                <form onSubmit={handleSubmit} className="border border-teal-500 rounded-md p-3">
                    <Textarea
                        placeholder="Add a comment..." 
                        rows="3" 
                        maxLength='300'
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-xs'>{300 - comment.length} characters remaining</p>
                        <Button outline gradientDuoTone='purpleToBlue' type='submit'>Submit</Button>
                    </div>
                    {commentError && (
                        <Alert color="failure" className="mt-5">{commentError}</Alert>
                    )}
                </form>
            )}
            {postComments.length === 0 ? (
                <p className='text-sm my-5'>No comments yet!</p>
            ) : (
                <>
                    <div className="text-sm my-5 flex items-center gap-1">
                        <p>Comments</p>
                        <div className="border border-gray-400 py-1 px-2 rounded-sm">
                            <p>{postComments.length}</p>
                        </div>
                    </div>
                    {postComments.map((comment) => (
                        <Comment 
                            key={comment._id} 
                            comment={comment}
                            onLike={handleLikeComment}
                            onEditComment={handleEditedComment}
                            onDeleteComment={(commentId) => {
                                setShowModal(true);
                                setCommentToDelete(commentId);
                            }}
                        />
                    ))}
                </>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this comment?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={() => handleDeleteComment(commentToDelete)}>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
            </Modal.Body>
        </Modal>
        </div>
    )
}

export default CommentSection;
