import { useEffect, useReducer } from "react";
import axios from "axios";
import { Userscontext } from "./Userscontext";

const storageKey = "folio-contacts-v1";
const initialState = {
  data: [],
  selected: [],
  searchTerm: "",
  editUser: null,
  status: "loading",
  view: "all",
  sort: "default",
  deleted: null,
  storageError: false,
};
function reducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, status: "loading" };
    case "SUCCESS":
      return { ...state, data: action.payload, status: "ready" };
    case "ERROR":
      return { ...state, status: "error" };
    case "STORAGE_ERROR":
      return { ...state, storageError: true };
    case "SET_USER":
      return {
        ...state,
        status: "ready",
        data: [...state.data, action.payload],
      };
    case "REMOVE_ITEM":
    case "RemoveAllItem": {
      const ids =
        action.type === "REMOVE_ITEM" ? [action.payload] : state.selected;
      return {
        ...state,
        data: state.data.filter((u) => !ids.includes(u.id)),
        selected: state.selected.filter((id) => !ids.includes(id)),
        editUser: ids.includes(state.editUser?.id) ? null : state.editUser,
        deleted: state.data
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => ids.includes(item.id)),
      };
    }
    case "UNDO_DELETE": {
      const data = [...state.data];
      for (const { item, index } of state.deleted || [])
        if (!data.some((u) => u.id === item.id)) data.splice(index, 0, item);
      return { ...state, data, deleted: null };
    }
    case "DISMISS_UNDO":
      return { ...state, deleted: null };
    case "Selected":
      return state.selected.includes(action.payload)
        ? state
        : { ...state, selected: [...state.selected, action.payload] };
    case "unSelected":
      return {
        ...state,
        selected: state.selected.filter((id) => id !== action.payload),
      };
    case "SET_SEARCH":
      return { ...state, searchTerm: action.payload };
    case "SET_VIEW":
      return { ...state, view: action.payload, selected: [] };
    case "SET_SORT":
      return { ...state, sort: action.payload };
    case "TOGGLE_FAVORITE":
      return {
        ...state,
        data: state.data.map((u) =>
          u.id === action.payload ? { ...u, favorite: !u.favorite } : u,
        ),
      };
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
}
function validContacts(data) {
  return (
    Array.isArray(data) &&
    data.every(
      (u) =>
        u &&
        typeof u === "object" &&
        ["string", "number"].includes(typeof u.id) &&
        ["name", "lastName", "email", "phone"].every(
          (k) => typeof u[k] === "string",
        ),
    ) &&
    new Set(data.map((u) => u.id)).size === data.length
  );
}
export default function UserContext({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [attempt, retry] = useReducer((n) => n + 1, 0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      dispatch({ type: "LOADING" });
      try {
        const cached = JSON.parse(localStorage.getItem(storageKey));
        if (validContacts(cached)) {
          dispatch({ type: "SUCCESS", payload: cached });
          return;
        }
      } catch {
        /* A corrupt cache is replaced only after a successful load. */
      }
      try {
        const { data } = await axios.get("http://localhost:3000/User", {
          signal: controller.signal,
          timeout: 10000,
        });
        if (!validContacts(data)) throw new Error("Invalid contacts response");
        dispatch({ type: "SUCCESS", payload: data });
      } catch {
        if (!controller.signal.aborted) dispatch({ type: "ERROR" });
      }
    }
    load();
    return () => controller.abort();
  }, [attempt]);
  useEffect(() => {
    if (state.status !== "ready") return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state.data));
    } catch {
      dispatch({ type: "STORAGE_ERROR" });
    }
  }, [state.data, state.status]);
  return (
    <Userscontext.Provider value={{ state, dispatch, retry }}>
      {children}
    </Userscontext.Provider>
  );
}
