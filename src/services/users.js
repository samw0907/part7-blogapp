import axios from "axios";
const baseUrl = "http://localhost:3003/api/users";


const getAll = async () => {
  const response = await axios.get(baseUrl);
  console.log("Users data:", response.data); 
  return response.data;
};

const getUserById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

export default { getAll, getUserById };