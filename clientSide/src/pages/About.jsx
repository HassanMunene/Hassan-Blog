import { RiEmotionHappyLine } from "react-icons/ri";

function About() {
	return (
		<div className='min-h-screen flex flex-col gap-6 items-center justify-center'>
      		<div className='max-w-2xl mx-auto p-3 text-center'>
        		<div>
          			<h1 className='text-3xl font font-semibold text-center my-7'>About Hassan's Blog</h1>
          			<div className='text-md text-gray-600 dark:text-gray-200 flex flex-col gap-6'>
            			<p>
            			Welcome to Hassan's Blog! This blog was created by 
            			<a href="https://github.com/HassanMunene" className="underline "> Hassan Munene </a>
              			as a personal project to share his thoughts and ideas with the
              			world. Hassan is a passionate developer who loves to write about
              			technology, coding, and everything in between.
            			</p>

            			<p>
              			On this blog, you'll find articles and tutorials on topics
              			such as web development, software engineering, and programming
              			languages. Hassan is always learning and exploring new
              			technologies, so be sure to check back often for new content!
            			</p>

            			<p>
              			We encourage you to leave comments on our posts and engage with
              			other readers. You can like other people's comments and reply to
              			them as well. We believe that a community of learners can help
              			each other grow and improve.
            			</p>
          			</div>
        		</div>
      		</div>
      		<RiEmotionHappyLine size={30} color="purple"/>
    	</div>
	)
}
export default About;