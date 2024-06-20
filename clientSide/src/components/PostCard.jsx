import {Link} from "react-router-dom";

function PostCard ({post}) {
    return (
        <div 
            className="relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px]">
            <Link to={`/post/${post.slug}`}>
                <img 
                    src={post.image} 
                    alt="post-cover"
                    className="h-[260px] w-full object-cover "/>
            </Link>
            <div className='p-3 flex flex-col gap-2'>
                <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
                <span className='italic text-sm'>{post.category}</span>
                <Link to={`/post/${post.slug}`} className='z-10'>Read article</Link>
            </div>
        </div>
    )
}

export default PostCard;
