import {TextInput, Select, Button, FileInput, Alert, Spinner} from "flowbite-react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useState} from "react";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {app} from "../firebase";
import {useNavigate} from "react-router-dom";

function CreatePost() {
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [formData, setFormData] = useState({});
    const [imageUploading, setImageUploading] = useState(false);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
    const [publishError, setPublishError] = useState(null);
    const [publishing, setPublishing] = useState(false);

    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const image = e.target.files[0];
        if (image) {
             setImage(image);
         }
     };
    const handleUploadImage = async() => {
        if (!image) {
            setImageUploadError("Please select and image");
            return;
        }
        setImageUploading(true);
        setImageUploadError(false);
        setImageUploadSuccess(false);
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
                 setImageUploadError('Image upload failer. Try again');
                 setImageUploadProgress(null);
                 setImageUploading(false);
                 setImage(null);
                 setImageUrl(null);
                 setImageUploadSuccess(false);
             },
             () => {
                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                     setImageUrl(downloadURL);
                     setFormData({...formData, image: downloadURL});
                     setImageUploading(false);
                     setImageUploadError(null);
                     setImageUploadSuccess(true);
                 });
             }
         )
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        setPublishing(true);
        setPublishError(null);
        try {
            const response = await fetch("/api/post/create-post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })
            const responseData = await response.json();
            if (responseData.success == false) {
                setPublishError(responseData.message);
                setPublishing(false);
                return;
            }
            if (responseData.success == true) {
                setPublishError(null);
                setPublishing(false);
                navigate(`/post/${responseData.slug}`);
            }
        } catch(error) {
            setPublishError(error.message);
            setPublishing(false);
            console.log(error);
        }
    }

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                 <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput type='text' placeholder='Title' required id='title' 
                        className='flex-1' onChange={(e) => setFormData({...formData, title: e.target.value})}/>
                    <Select onChange={(e) => setFormData({...formData, category: e.target.value})}>
                        <option value='uncategorized'>Select a category</option>
                        <option value='javascript'>JavaScript</option>
                        <option value='reactjs'>React.js</option>
                        <option value='nodejs'>Node.js</option>
                        <option value="networking">Networking</option>
                        <option value="python">Python</option>
                        <option value="data_structures">Data structures & Algorithms</option>
                        <option value="life-skills">Life Skills</option>
                    </Select>
                </div>
                <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                    <FileInput type='file' accept='image/*' onChange={handleImageChange}/>
                    <Button type='button' disabled={imageUploading} gradientDuoTone='purpleToBlue' 
                        size='sm' outline onClick={handleUploadImage}
                    >
                        {imageUploading ? "Uploading...": "Upload"}
                    </Button>
                </div>
                {imageUploadError && (
                 <Alert color='failure'>
                    {imageUploadError}
                 </Alert>
                )}
                {formData.image && (
                    <img src={formData.image} alt="postImage" className="w-full h-72 object-cover" />
                )}
                <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12' 
                    required onChange={(value) => setFormData({...formData, content: value})}/>
                <Button type='submit' gradientDuoTone='purpleToPink'>
                    {publishing ? (
                        <>
                            <Spinner size='sm' />
                            <span className="pl-3">Publishing...</span>
                        </>
                        ): (
                         'Publish'
                        )
                    }
                </Button>
                {publishError && (
                    <Alert color="failure" className="mt-4">{publishError}</Alert>
                )}
            </form>
        </div>
    )
}

export default CreatePost;
