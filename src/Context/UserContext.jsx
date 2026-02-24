import { createContext, useEffect } from "react";
import { useReducer } from "react";
import axios from "axios";

const initialState = {
  data: [],
  user: {
    name: "",
    lastName: "",
    email: "",
    phone: "",
  },
  selected: [],
  searchTerm: "",
  editUser: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SUCCESS":
      return { ...state, data: action.payload };

    case "SET_USER":
      return { ...state, data: [...state.data, action.payload] };

    case "REMOVE_ITEM":
      return {
        ...state,
        data: state.data.filter((e) => e.id !== action.payload),
        selected: state.selected.filter((id) => id !== action.payload),
        editUser: state.editUser?.id === action.payload ? null : state.editUser,
      };

    case "Selected":
      if (state.selected.includes(action.payload)) return state;
      return { ...state, selected: [...state.selected, action.payload] };

    case "unSelected":
      return {
        ...state,
        selected: state.selected.filter((id) => id !== action.payload),
      };

    case "RemoveAllItem":
      return {
        ...state,
        data: state.data.filter((e) => !state.selected.includes(e.id)),
        selected: [],
        editUser:
          state.editUser && state.selected.includes(state.editUser.id)
            ? null
            : state.editUser,
      };

    case "SET_SEARCH":
      return { ...state, searchTerm: action.payload };

    case "START_EDIT":
      return { ...state, editUser: action.payload };

    case "CANCEL_EDIT":
      return { ...state, editUser: null };

    case "UPDATE_USER":
      return {
        ...state,
        data: state.data.map((u) =>
          u.id === action.payload.id ? action.payload : u,
        ),
        editUser: null,
      };

    default:
      return state;
  }
};

export const Userscontext = createContext();

const UserContext = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    axios
      .get("http://localhost:3000/User")
      .then((result) => dispatch({ type: "SUCCESS", payload: result.data }));
  }, []);

  return (
    <Userscontext.Provider value={{ state, dispatch }}>
      {children}
    </Userscontext.Provider>
  );
};

export default UserContext;
