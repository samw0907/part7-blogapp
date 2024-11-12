import React from "react";
import NotificationDisplay from "./NotificationDisplay";
import PropTypes from "prop-types";
import { Table, Form, Button } from 'react-bootstrap'

const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit,

}) => {
  return (
    <div>
      <h2>log in to application</h2>
      <NotificationDisplay />
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>username:</Form.Label>
          <Form.Control
            type="text"
            data-testid="username"
            value={username}
            name="Username"
            onChange={handleUsernameChange}
          />
        </Form.Group>
        
        <Form.Group controlId="password">
          <Form.Label>password:</Form.Label>
          <Form.Control
            type="password"
            data-testid="password"
            value={password}
            name="Password"
            onChange={handlePasswordChange}
          />
        </Form.Group>
        
        <Button variant="primary" type="submit">
          login
        </Button>
      </Form>
    </div>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default LoginForm;
