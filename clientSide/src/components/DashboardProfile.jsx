import {useSelector} from "react-redux";
import {TextInput, Button, Alert} from "flowbite-react";
import {useRef, useState, useEffect} from 'react';
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {app} from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function DashboardProfile () {
    const {user: currentUser} = useSelector((state) => state.user);
    const imageSelectorRef = useRef();
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);

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
                    setImageUploading(false);
                    setImageUploadError(null);
                });
            }
        )
    }

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className="flex flex-col gap-4">
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
                <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} />
                <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} />
                <TextInput type='password' id='password' placeholder='password' />
                <Button type="submit" gradientDuoTone='purpleToBlue' outline>Update</Button> 
            </form>
            <div className='text-red-500 flex justify-between mt-5'>
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
        </div>
    );
}
export default DashboardProfile;
