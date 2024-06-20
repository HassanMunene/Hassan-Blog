import {useParams, Link} from "react-router-dom";
import {useState, useEffect} from "react";
import {Spinner, Button} from "flowbite-react";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard.jsx";

function PostPage () {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [post, setPost] = useState({});
    const {postSlug} = useParams();
    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/post/get-posts?slug=${postSlug}`);
                const responseData = await response.json();
                if (responseData.success == true) {
                    setLoading(false);
                    setError(null);
                    setPost(responseData.posts[0]);
                }
                if (responseData.success == false) {
                    setLoading(false);
                    setError("Error fetching Data");
                }
            } catch(error) {
                setError(error.Message);
                setLoading(false);
                console.log(error);
            }
        }
        fetchPost();
    }, [postSlug])

    useEffect(() => {
        try {
            const fetchRecentPosts = async () => {
                const response = await fetch('/api/post/get-posts?limit=3');
                const responseData = await response.json();
                if (responseData.success == true) {
                    setRecentPosts(responseData.posts);
                }
            }
            fetchRecentPosts();
        } catch(error) {
            console.log(error);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="xl" />
            </div>
        )
    }

    return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
            <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
                {post && post.title}
            </h1>
            <Link to={`/search?category=${post && post.category}`} className="self-center mt-5">
                <Button color="gray" pill size="xs">{post && post.category}</Button>
            </Link>
            <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'/>
            <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
                <span>{post && new Date(post.updatedAt).toLocaleDateString()}</span>
                <span className='italic'>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
            </div>
            <div className='p-3 max-w-2xl mx-auto w-full post-content' 
                dangerouslySetInnerHTML={{ __html: post && post.content }}>
            </div>
            <div>
                <CommentSection postId={post._id}/>
            </div>
            <div className="flex flex-col justify-center items-center mb-5">
                <h1 className="text-xl mt-5">Recent articles</h1>
                <div className="flex flex-wrap gap-5 mt-5 justify-center">
                    {recentPosts && (recentPosts.map((post) => <PostCard key={post._id} post={post} />))}
                </div>
            </div>
        </main>
    )
}

export default PostPage;
