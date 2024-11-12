import { useState, useEffect, useRef } from "react";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import { useNotification } from "./components/NotificationContext";
import NotificationDisplay from "./components/NotificationDisplay";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from "./components/UserContext";
import UserDetail from "./components/UserDetail";
import userService from "./services/users";
import BlogDetails from "./components/BlogDetails";
import { Users } from "./components/Users";
import Blogs from "./components/Blogs";
import { Table, Navbar, Nav, Button } from 'react-bootstrap'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate,
  useMatch
} from "react-router-dom";

const User = () => {
  const { id } = useParams();
  const { data: user, isLoading } = useQuery(["user", id], () => userService.getUserById(id));

  if (isLoading) return <div>Loading...</div>;
}

const App = () => {
  const { user, dispatch } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogAuthor, setNewBlogAuthor] = useState("");
  const [newBlogUrl, setNewBlogUrl] = useState("");
  const queryClient = useQueryClient();
  const { setNotification } = useNotification();

  const { data: blogs = [], refetch } = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    enabled: !!user,
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      dispatch({ type: "SET_USER", payload: user });
    }
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch({ type: "SET_USER", payload: user });
      setUsername("");
      setPassword("");
      refetch();
      setNotification("Successfully logged in", "success");
    } catch (exception) {
      setNotification("Wrong credentials", "error");
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedBlogAppUser");
    blogService.setToken(null);
    dispatch({ type: "REMOVE_USER" });
  };

  const mutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      refetch();
      setNotification("Blog created successfully", "success");
    },
    onError: () => {
      setNotification("Failed to create blog", "error");
    },
  });

  const addBlog = (event) => {
    event.preventDefault();
    const newBlog = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    };
    mutation.mutate(newBlog);
    setNewBlogTitle("");
    setNewBlogAuthor("");
    setNewBlogUrl("");
  };

  const blogFormRef = useRef();

  const blogForm = () => (
    <div>
      <Togglable buttonLabel="create new" ref={blogFormRef}>
        <BlogForm
          title={newBlogTitle}
          author={newBlogAuthor}
          url={newBlogUrl}
          handleTitleChange={({ target }) => setNewBlogTitle(target.value)}
          handleAuthorChange={({ target }) => setNewBlogAuthor(target.value)}
          handleUrlChange={({ target }) => setNewBlogUrl(target.value)}
          handleSubmit={addBlog}
        />
      </Togglable>
    </div>
  );

  const likeMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
      setNotification("Liked successfully", "success");
    },
    onError: () => {
      setNotification("Failed to like blog", "error");
    },
  });

  const handleLike = (id) => {
    const blogToLike = blogs.find((blog) => blog.id === id);
    const updatedBlog = {
      ...blogToLike,
      likes: blogToLike.likes + 1,
    };
    likeMutation.mutate({ id, updatedBlog });
  };

  const deleteMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
      setNotification("Blog deleted successfully", "success");
    },
    onError: () => {
      setNotification("Failed to delete blog", "error");
    },
  });

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmed) {
      return;
    }
    deleteMutation.mutate(id);
  };

  const padding = { padding: '10px' };

  return (
    <div className="container">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/">home</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/blogs">blogs</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/users">users</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                {user
                  ? <em style={padding}>{user.name} logged in</em>
                  : <Link style={padding} to="/login">login</Link>
                }
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      <h1>Blog App</h1>
      <NotificationDisplay />
  
      {user === null ? (
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      ) : (
        <div>
          <p>
            {user.name} is logged in{" "}
            <button type="button" onClick={handleLogout}>
              logout
            </button>
          </p>
  
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h2>Blogs</h2>
                  {blogForm()}
                  <Table striped>
                    <tbody>
                      {blogs.map((blog) => (
                        <tr key={blog.id}>
                          <td>
                            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                          </td>
                          <td>{blog.author}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              }
            />
            <Route path="/blogs" element={<Blogs blogs={blogs} />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserDetail />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
