import styles from "./Header.module.css";
import { Userscontext } from "../Context/Userscontext";
import { useContext } from "react";

const Header = () => {
  useContext(Userscontext);

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
