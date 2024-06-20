import {useEffect, useState} from 'react';
import moment from 'moment';
import {Button, Textarea} from "flowbite-react";
import { FaThumbsUp } from "react-icons/fa";
import {useSelector} from "react-redux";

function Comment ({comment, onLike, onEditComment}) {
    const [user, setUser] = useState({});
    const {user: currentUser} = useSelector((state) => state.user);
    const [editingComment, setEditingComment] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.content);

    useEffect (() => {
        const getUser = async () => {
            try {
                const response = await fetch(`/api/user/${comment.userId}`);
                const responseData = await response.json();
                if (responseData.success == true) {
                    setUser(responseData.user);
                }
            } catch(error) {
                console.log(error);
            }
        }
        getUser()
    }, [comment]);

    const handleEditComment = () => {
        setEditingComment(true);
        setEditedComment(comment.content);
    }
    const handleSaveComment = async () => {
        try {
            const response = await fetch(`/api/comment/edit-comment/${comment._id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({content: editedComment})
            });
            const responseData = await response.json();
            if (responseData.success == true) {
                setEditingComment(false);
                onEditComment(comment, editedComment);
            }
        } catch(error) {
            console.log(error)
        }
    }
    return (
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
            <div className='flex-shrink-0 mr-3'>
                <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt={user.username}/>
            </div>
            <div className='flex-1'>
                <div className='flex items-center mb-1'>
                    <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : 'anonymous user'}</span>
                    <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
                </div>
                { editingComment ? (
                    <>
                        <Textarea className="mb-2" value={editedComment} onChange={(e) => setEditedComment(e.target.value)}/>
                        <div className="flex justify-end gap-2 text-xs">
                            <Button type='button' onClick={handleSaveComment} size='sm' gradientDuoTone='purpleToBlue'>
                                Save
                            </Button>
                            <Button type='button' onClick={() => setEditingComment(false)} size='sm' gradientDuoTone='purpleToBlue'>
                                Cancel
                            </Button>
                        </div>
                    </> 
                ) : (
                    <>
                        <p className='text-gray-500 pb-2'>{comment.content}</p>
                        <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                            <FaThumbsUp 
                                onClick={() => onLike(comment._id)}
                                className={`text-sm text-gray-400 hover:text-blue-500 cursor-pointer 
                                    ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}
                            />
                            <p className="text-gray-400">
                                {comment.numberOfLikes > 0 && 
                                    comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? 'like' : 'likes')}
                            </p>
                            {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                <>
                                    <button onClick={handleEditComment} type="button" className="text-gray-400 hover:text-blue-500">
                                        Edit
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Comment;
