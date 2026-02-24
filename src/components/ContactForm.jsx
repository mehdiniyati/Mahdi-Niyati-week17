import { useContext, useEffect, useState } from "react";
import { Userscontext } from "../Context/UserContext";
import styles from "./ContactForm.module.css";

const ContactForm = () => {
  const { state, dispatch } = useContext(Userscontext);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (state.editUser) {
      setFormData(state.editUser);
    }
  }, [state.editUser]);

  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const Handlesubmit = (e) => {
    e.preventDefault();

    if (state.editUser) {
      dispatch({ type: "UPDATE_USER", payload: formData });
      setFormData({ id: "", name: "", lastName: "", email: "", phone: "" });
      return;
    }

    const newUser = {
      ...formData,
      id: state.data.length + 1,
    };

    dispatch({ type: "SET_USER", payload: newUser });
    setFormData({ id: "", name: "", lastName: "", email: "", phone: "" });
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <form className={styles.form} onSubmit={Handlesubmit}>
            <div className={styles.field}>
              <span className={styles.label}>Name</span>
              <input
                className={styles.input}
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={changeHandler}
              />
            </div>

            <div className={styles.field}>
              <span className={styles.label}>Last Name</span>
              <input
                className={styles.input}
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={changeHandler}
              />
            </div>

            <div className={`${styles.field} ${styles.inputWide}`}>
              <span className={styles.label}>Email</span>
              <input
                className={styles.input}
                type="text"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={changeHandler}
              />
            </div>

            <div className={`${styles.field} ${styles.inputWide}`}>
              <span className={styles.label}>Phone</span>
              <input
                className={styles.input}
                type="text"
                placeholder="Phone"
                name="phone"
                value={formData.phone}
                onChange={changeHandler}
              />
            </div>

            <div className={styles.actions}>
              <button className={styles.btnPrimary} type="submit">
                {state.editUser ? "Update Contact" : "Add Contact"}
              </button>

              {state.editUser && (
                <button
                  className={styles.btnSecondary}
                  type="button"
                  onClick={() => {
                    dispatch({ type: "CANCEL_EDIT" });
                    setFormData({
                      id: "",
                      name: "",
                      lastName: "",
                      email: "",
                      phone: "",
                    });
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
