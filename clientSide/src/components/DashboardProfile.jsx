import {useSelector, useDispatch} from "react-redux";
import {TextInput, Button, Alert, Spinner, Modal} from "flowbite-react";
import {useRef, useState, useEffect} from 'react';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {app} from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
    updateUserStart, 
    updateUserSuccess, 
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import {Link} from "react-router-dom";

function DashboardProfile () {
    const {user: currentUser, loading, error} = useSelector((state) => state.user);
    const imageSelectorRef = useRef();
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();
    const [userUpdateError, setUserUpdateError] = useState(null);
    const [userUpdateSuccess, setUserUpdateSuccess] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleImageChange = (e) => {
        const image = e.target.files[0];
        if (image) {
            setImage(image);
            setImageUrl(URL.createObjectURL(image));
        }
    };
    useEffect(() => {
        if (image) {
            uploadImageToFirebase();
        }
    }, [image]);
    
    const uploadImageToFirebase = async() => {
        setImageUploading(true);
        setImageUploadError(null);
        const storage = getStorage(app);
        const imageName = new Date().getTime() + image.name;
        const storageRef = ref(storage, imageName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageUploadProgress(progress.toFixed(0));
            },
            (error) => {
                setImageUploadError('OOOps could not upload the image');
                setImageUploadProgress(null);
                setImageUploading(false);
                setImage(null);
                setImageUrl(null);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUrl(downloadURL);
                    setFormData({...formData, profilePicture: downloadURL});
                    setImageUploading(false);
                    setImageUploadError(null);
                });
            }
        )
    }
    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value});
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        setUserUpdateError(null);
        setUserUpdateSuccess(null);
        if (Object.keys(formData).length == 0) {
            setUserUpdateError("No changes made");
            return;
        }
        if (imageUploading) {
            setUserUpdateError("Please wait for image to upload");
            return;
        }
        try {
            dispatch(updateUserStart());
            const response = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            })
            const responseData = await response.json();
            if (responseData.success == false) {
                dispatch(updateUserFailure(responseData.message));
                setUserUpdateError(responseData.message);
            } else {
                dispatch(updateUserSuccess(responseData));
                setUserUpdateSuccess("User profile updated successfully");
            }
        } catch(error) {
            dispatch(updateUserFailure(error.message));
            setUserUpdateError(error.message);
        }
    }

    const handleDeleteUser = async() => {
        setShowModal(false);
        try {
            dispatch(deleteUserStart());
            const response = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });
            const responseData = await response.json();
            if (responseData.success == false) {
                dispatch(deleteUserFailure(responseData.message));
            } else {
                dispatch(deleteUserSuccess());
            }
        } catch(error) {
            dispatch(deleteUserFailure(error.message));
        }
    }

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
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="file" accept="image/*" ref={imageSelectorRef} onChange={handleImageChange} className="hidden"/>
                <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" 
                    onClick={() => imageSelectorRef.current.click()}>
                    {imageUploadProgress && (
                        <CircularProgressbar 
                            value={imageUploadProgress || 0}
                            text={`${imageUploadProgress}%`} 
                            strokeWidth={5} 
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgba(62, 152, 199, ${imageUploadProgress / 10})`,
                                },
                            }}
                        />
                    )}
                    <img src={imageUrl || currentUser.profilePicture} alt="userProfile" 
                        className={`rounded-full object-cover w-full h-full border-8 border-[lightgray] {
                            imageUploadProgress && imageUploadProgress < 100 && 'opacity-60'
                        }`}
                    />
                </div>
                {imageUploadError && (<Alert color='failure'>{imageUploadError}</Alert>)}
                <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} />
                <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
                <TextInput type='password' id='password' placeholder='password' onChange={handleChange}/>
                <Button type="submit" disabled={loading || imageUploading} gradientDuoTone='purpleToBlue' outline>
                    {loading ? (
                        <>
                            <Spinner size='sm' />
                            <span className="pl-3">Loading...</span>
                        </>
                        ): (
                        'Update'
                        )
                    }
                </Button>
                {currentUser.isAdmin && (
                    <Link to="/create-post">
                        <Button type="button" className="w-full" gradientDuoTone='purpleToPink'>
                            Create post
                        </Button>
                    </Link>
                )}
            </form>
            <div className='text-red-500 flex justify-between mt-5'>
                <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
                <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
            </div>
            {userUpdateSuccess && (
                <Alert color='success' className='mt-5'>
                    {userUpdateSuccess}
                </Alert>
            )}
            {userUpdateError && (
                <Alert color='failure' className='mt-5'>
                    {userUpdateError}
                </Alert>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete your account?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
export default DashboardProfile;
