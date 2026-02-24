import styles from "./Header.module.css";
import { Userscontext } from "../Context/UserContext";
import { useContext } from "react";

const Header = () => {
  const result = useContext(Userscontext);
  console.log(result);

  return (
    <div className={styles.container}>
      <h1>Contact App</h1>
      <p>
        <a href="#">Botostart</a> | React.js Full Course
      </p>
    </div>
  );
};

export default Header;
