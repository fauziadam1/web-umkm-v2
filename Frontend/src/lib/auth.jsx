export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const setUser = (data) => {
  localStorage.setItem("user", JSON.stringify(data));
};

export const logout = () => {
  localStorage.removeItem("user");
};