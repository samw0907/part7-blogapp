import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import blogService from "../services/blogs";
import userService from "../services/users";

const BlogDetails = () => {
  const { id } = useParams(); 
  const [blog, setBlog] = useState(null);
  const [user, setUser] = useState(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    blogService.getById(id).then(setBlog).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (blog && blog.user) {
      userService.getUserById(blog.user)
        .then(setUser)
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  }, [blog]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedBlog = await blogService.addComment(id, newComment);
      setBlog(updatedBlog);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!blog || !user) return <p>Loading...</p>;

  return (
    <div>
      <h2>{blog.title}</h2>
      <h3>by {blog.author}</h3>
      <p>URL: <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
      <p>Likes: {blog.likes}</p>
      <p>Added by {user.name}</p>

      <h3>Comments</h3>
      {blog.comments && blog.comments.length > 0 ? (
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
      
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
};

export default BlogDetails;
