import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import userService from "../services/users";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService.getUserById(id)
      .then(setUser)
      .catch((error) => {
        console.error("Error fetching user:", error);
        setUser(null);
      });
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserDetail;