import { useEffect, useState } from "react";
import blogService from "../services/blogs";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../components/UserContext";
import { Table } from 'react-bootstrap'

const Blogs = () => {
  const { user } = useUser();
  const [blogs, setBlogs] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const fetchBlogs = async () => {
      if (userId) {
        const userBlogs = await blogService.getBlogsByUser(userId);
        setBlogs(userBlogs);
      } else {
        const allBlogs = await blogService.getAll();
        setBlogs(allBlogs);
      }
    };

    fetchBlogs();
  }, [userId]);

  if (!blogs) return <p>Loading blogs...</p>;

  return (
    <div>
      <h2>Blogs</h2>
      <Table striped>
  <tbody>
    {blogs.map((blog) => (
      <tr key={blog.id}>
        <td>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </td>
        <td>
          {blog.author}
        </td>
      </tr>
    ))}
  </tbody>
</Table>
    </div>
  );
};

export default Blogs;
