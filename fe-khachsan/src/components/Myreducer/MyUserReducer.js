import cookie from "react-cookies";

const MyUserReducer = (current, action) => {
  switch (action.type) {
    case "login":
      return action.payload;
    case "logout":
      cookie.remove("token");
      cookie.remove("user");
      return null;
  }
  return current;
};

export default MyUserReducer;
