import React, { useContext } from "react";
import styles from "./ContactsList.module.css";
import { Userscontext } from "../Context/UserContext";

export default function ContactsList() {
  const { state, dispatch } = useContext(Userscontext);
  const { data, selected, searchTerm } = state;

  const filteredData = data.filter((u) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.lastName || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.phone || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Contacts List</h2>

      <div className={styles.card}>
        <input
          className={styles.search}
          placeholder="Search by name / last name / email ..."
          value={searchTerm}
          onChange={(e) =>
            dispatch({ type: "SET_SEARCH", payload: e.target.value })
          }
        />

        <div className={styles.toolbar}>
          <div className={styles.selected}>
            Selected: <span className={styles.badge}>{selected.length}</span>
          </div>

          <button
            className={styles.deleteSelected}
            disabled={selected.length === 0}
            onClick={() => dispatch({ type: "RemoveAllItem" })}
          >
            Delete Selected
          </button>
        </div>

        <div className={styles.list}>
          {filteredData.map((data) => (
            <div key={data.id} className={styles.row}>
              <label className={styles.checkWrap}>
                <input
                  type="checkbox"
                  checked={selected.includes(data.id)}
                  onChange={(e) => {
                    dispatch({
                      type: e.target.checked ? "Selected" : "unSelected",
                      payload: data.id,
                    });
                  }}
                />
              </label>

              <div
                className={styles.name}
              >{`${data.name}  ${data.lastName}`}</div>

              <div className={styles.email}>
                <span className={styles.icon}>✉️</span>
                <span>{data.email}</span>
              </div>

              <div className={styles.phone}>
                <span className={styles.icon}>📞</span>
                <span>{data.phone}</span>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.actionBtn}
                  title="Edit"
                  onClick={() =>
                    dispatch({ type: "START_EDIT", payload: data })
                  }
                >
                  ✏️
                </button>

                <button
                  onClick={() =>
                    dispatch({
                      type: "REMOVE_ITEM",
                      payload: data.id,
                    })
                  }
                  className={`${styles.actionBtn} ${styles.danger}`}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
