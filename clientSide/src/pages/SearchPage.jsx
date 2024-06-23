import {TextInput, Select, Button, Spinner} from "flowbite-react";
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import { TfiFaceSad } from "react-icons/tfi";
import PostCard from "../components/PostCard";

function SearchPage () {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized',
    });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        let searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl === null) {
            searchTermFromUrl = '';
        }

        let sortFromUrl = urlParams.get('sort');
        if (sortFromUrl === null) {
            sortFromUrl = 'desc';
        }

        let categoryFromUrl = urlParams.get('category');
        if (categoryFromUrl === null) {
            categoryFromUrl = 'uncategorized';
        }

        setSidebarData({
            ...sidebarData,
            searchTerm: searchTermFromUrl,
            sort: sortFromUrl,
            category: categoryFromUrl,
        });

        const fetchPost = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const response = await fetch(`/api/post/get-posts?${searchQuery}`);
            const responseData = await response.json();
            if (responseData.success == true) {
                setPosts(responseData.posts);
                setLoading(false);
                if (responseData.posts.length === 8) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            }
            if (responseData.success == false) {
                setLoading(false);
                return;
            }
        }
        fetchPost();

    }, [location.search]);
    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSidebarData({...sidebarData, searchTerm: e.target.value});
        }
        if (e.target.id === 'sort') {
            const order = e.target.value || 'desc';
            setSidebarData({...sidebarData, sort: order});
        }
        if (e.target.id === 'category') {
            const category = e.target.value || 'uncategorized';
            setSidebarData({...sidebarData, category: category});
        }
    }

    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const response = await fetch(`/api/post/get-posts?${searchQuery}`);
        const responseData = await response.json();
        if (responseData.success == true) {
            setPosts([...posts, ...responseData.posts]);
            if (responseData.posts === 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        }
        if (responseData.success == false) {
            console.log(responseData);
            return;
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        console.log(urlParams);
        const searchQuery = urlParams.toString()
    }

    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="flex items-center gap-2">
                        <label className="whitespace-nowrap font-semibold">Search Term</label>
                        <TextInput 
                            placeholder="Search..." 
                            id="searchTerm" 
                            type="text"
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className='font-semibold'>Sort:</label>
                        <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
                            <option value='desc'>Latest</option>
                            <option value='asc'>Oldest</option>
                        </Select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Category:</label>
                        <Select onChange={handleChange} value={sidebarData.category} id='category'>
                            <option value="uncategorized">Uncategorized</option>
                            <option value='javascript'>JavaScript</option>
                            <option value='reactjs'>React.js</option>
                            <option value='nodejs'>Node.js</option>
                            <option value="networking">Networking</option>
                            <option value="python">Python</option>
                            <option value="data_structures">Data structures & Algorithms</option>
                            <option value="life-skills">Life Skills</option>
                        </Select>
                    </div>
                    <Button type='submit' outline gradientDuoTone='purpleToPink'>Search</Button>
                </form>
            </div>
            <div className="w-full">
                <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
                    Posts results:
                </h1>
                <div className='p-7 flex flex-wrap gap-4'>
                    {!loading && posts.length === 0 && (
                        <p className='text-xl text-gray-500 dark:text-gray-200 flex items-center gap-2'>
                            No posts found.
                            <TfiFaceSad /> 
                        </p>
                    )}
                    {loading && (
                        <div className="flex justify-center items-start min-h-screen">
                            <Spinner size="xl" />
                        </div>
                    )}
                    {!loading && posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
                    {showMore && (
                        <button onClick={handleShowMore} className='text-teal-500 text-lg hover:underline p-7 w-full'>
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SearchPage;
