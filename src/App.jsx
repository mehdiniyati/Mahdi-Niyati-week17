import { useContext, useState } from "react";
import { MotionConfig, motion as Motion } from "framer-motion";
import { Users, ArrowUpRight, Sun, Moon, Plus, BookUser } from "lucide-react";
import UserContext from "./Context/UserContext";
import { Userscontext } from "./Context/Userscontext";
import ContactsList from "./components/ContactsList";
import ContactForm from "./components/ContactForm";

function Workspace() {
  const { state, dispatch } = useContext(Userscontext);
  const [adding, setAdding] = useState(false);
  const [dark, setDark] = useState(
    () => localStorage.getItem("contacts-theme") === "dark",
  );
  const openAdd = () => {
    dispatch({ type: "CANCEL_EDIT" });
    setAdding(true);
  };
  const close = () => {
    setAdding(false);
    dispatch({ type: "CANCEL_EDIT" });
  };
  return (
    <div className={dark ? "dark" : ""}>
      <div className="app-shell min-h-screen bg-stone-50 text-stone-900 dark:bg-[#151917] dark:text-stone-100">
        <aside className="sidebar fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-stone-200/80 bg-white/70 px-5 py-8 backdrop-blur-xl lg:flex dark:border-white/10 dark:bg-[#191e1b]/80">
          <a
            href="#"
            className="mb-12 flex items-center gap-3 px-3 text-2xl font-bold tracking-tight"
          >
            <span className="logo">
              <BookUser size={22} />
            </span>
            folio<span className="text-emerald-600">.</span>
          </a>
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[.18em] text-stone-400">
            WORKSPACE
          </p>
          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-3 text-sm font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
            <Users size={18} /> All contacts{" "}
            <span className="ml-auto rounded-md bg-white/80 px-2 py-0.5 text-xs dark:bg-white/10">
              {state.data.length}
            </span>
          </div>
          <div className="mt-auto rounded-2xl border border-stone-200/80 p-4 dark:border-white/10">
            <span className="mb-3 block h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-sm font-semibold">Good connections matter.</p>
            <p className="mt-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
              A little space for the people who make a difference.
            </p>
            <ArrowUpRight className="mt-4 text-emerald-600" size={20} />
          </div>
          <div className="mt-6 flex items-center gap-3 border-t border-stone-200 pt-6 dark:border-white/10">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-200 text-xs font-semibold text-stone-700">
              MY
            </div>
            <div>
              <p className="text-sm font-semibold">My workspace</p>
              <p className="text-xs text-stone-500">Personal account</p>
            </div>
          </div>
        </aside>
        <div className="lg:ml-60">
          <header className="flex h-20 items-center justify-between border-b border-stone-200/70 bg-white/50 px-6 backdrop-blur-xl sm:px-10 dark:border-white/10 dark:bg-white/[.02]">
            <div className="flex items-center gap-2 text-sm">
              <BookUser className="text-emerald-700 lg:hidden" size={22} />
              <span className="text-stone-400">Workspace</span>
              <span className="mx-2 text-stone-300">/</span>
              <span className="font-medium">Contacts</span>
            </div>
            <button
              className="icon-button"
              aria-label={
                dark ? "Switch to light theme" : "Switch to dark theme"
              }
              onClick={() =>
                setDark((value) => {
                  localStorage.setItem(
                    "contacts-theme",
                    value ? "light" : "dark",
                  );
                  return !value;
                })
              }
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </header>
          <main className="mx-auto max-w-[1440px] px-6 py-10 sm:px-10 sm:py-12 xl:px-14">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[.22em] text-emerald-700 dark:text-emerald-400">
                  YOUR PEOPLE, ALL TOGETHER
                </p>
                <h1 className="text-4xl font-semibold tracking-[-.045em] sm:text-5xl">
                  Connections<span className="text-emerald-600">.</span>
                </h1>
                <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">
                  Keep your circle close. Make every connection count.
                </p>
              </div>
              <AddButton onClick={openAdd} />
            </div>
            <ContactsList onAdd={openAdd} />
            <footer className="mt-12 flex items-center gap-2 text-xs text-stone-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> A
              little more organized. A lot more connected.
            </footer>
          </main>
        </div>
        <ContactForm open={adding || Boolean(state.editUser)} onClose={close} />
      </div>
    </div>
  );
}
function AddButton({ onClick }) {
  return (
    <Motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="primary-button"
    >
      <Plus size={18} /> Add contact
    </Motion.button>
  );
}
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <UserContext>
        <Workspace />
      </UserContext>
    </MotionConfig>
  );
}
