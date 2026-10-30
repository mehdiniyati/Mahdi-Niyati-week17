import { useContext, useState } from "react";
import {
  AnimatePresence,
  motion as Motion,
  useReducedMotion,
} from "framer-motion";
import {
  Search,
  Mail,
  Phone,
  Pencil,
  Trash2,
  Users,
  ArrowUpRight,
  Plus,
  X,
  Check,
} from "lucide-react";
import { Userscontext } from "../Context/Userscontext";

const colors = [
  "bg-[#e9ede2] text-[#63744b] dark:bg-lime-900/40 dark:text-lime-200",
  "bg-[#f4e8df] text-[#9c6d4c] dark:bg-orange-900/40 dark:text-orange-200",
  "bg-[#e6eaf5] text-[#6979a6] dark:bg-indigo-900/40 dark:text-indigo-200",
  "bg-[#eee4ee] text-[#9c719c] dark:bg-fuchsia-900/40 dark:text-fuchsia-200",
];

export default function ContactsList({ onAdd }) {
  const { state, dispatch } = useContext(Userscontext);
  const { data, selected, searchTerm } = state;
  const reduced = useReducedMotion();
  const q = searchTerm.toLowerCase().trim();
  const filtered = data.filter((user) =>
    ["name", "lastName", "email", "phone"].some((key) =>
      String(user[key] || "")
        .toLowerCase()
        .includes(q),
    ),
  );
  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduced ? 0 : 0.075 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: reduced ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.32 } },
  };
  return (
    <section aria-label="Contact directory">
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Total contacts",
            value: data.length.toString().padStart(2, "0"),
            icon: Users,
          },
          {
            label: "With email",
            value: data
              .filter((u) => u.email)
              .length.toString()
              .padStart(2, "0"),
            icon: Mail,
          },
          {
            label: "With phone",
            value: data
              .filter((u) => u.phone)
              .length.toString()
              .padStart(2, "0"),
            icon: Phone,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-white/60 px-5 py-4 dark:border-white/10 dark:bg-white/[.025]"
          >
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {label}
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {value}
              </p>
            </div>
            <StatIcon icon={Icon} />
          </div>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">All contacts</h2>
          <span className="rounded-md bg-stone-200/60 px-2 py-0.5 text-[11px] font-medium text-stone-500 dark:bg-white/10 dark:text-stone-300">
            {data.length}
          </span>
        </div>
        <div className="relative w-full sm:w-80">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-3 text-stone-400"
          />
          <input
            aria-label="Search contacts"
            placeholder="Search your contacts…"
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-white/5"
            value={searchTerm}
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH", payload: e.target.value })
            }
          />
          {searchTerm && (
            <button
              className="icon-button absolute right-1 top-0.5"
              aria-label="Clear search"
              onClick={() => dispatch({ type: "SET_SEARCH", payload: "" })}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
      <AnimatePresence>
        {selected.length > 0 && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950">
              <span className="text-sm">{selected.length} selected</span>
              <Motion.button
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400"
                onClick={() => dispatch({ type: "RemoveAllItem" })}
              >
                <Trash2 size={15} /> Delete selected
              </Motion.button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
      <Motion.div layout className="relative">
        <Motion.div
          key={q}
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((user) => {
              const name =
                `${user.name} ${user.lastName}`.trim() || "Unnamed contact";
              const initials =
                `${user.name?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
                "?";
              const color =
                colors[
                  data.findIndex((item) => item.id === user.id) % colors.length
                ];
              return (
                <Motion.article
                  key={user.id}
                  layout
                  variants={cardVariants}
                  exit={{
                    opacity: 0,
                    scale: reduced ? 1 : 0.94,
                    transition: { duration: 0.18 },
                  }}
                  whileHover={
                    reduced
                      ? {}
                      : {
                          y: -4,
                          boxShadow: "0 14px 32px -16px rgb(20 60 40 / .2)",
                        }
                  }
                  whileTap={reduced ? {} : { scale: 0.995 }}
                  className={`contact-card group relative rounded-2xl border bg-white p-6 transition-colors dark:bg-[#1d2320] ${selected.includes(user.id) ? "border-emerald-500 ring-1 ring-emerald-500" : "border-stone-200/80 dark:border-white/10"}`}
                >
                  <div className="mb-5 flex items-start justify-between">
                    <Avatar user={user} initials={initials} color={color} />
                    <label className="relative flex h-7 w-7 cursor-pointer items-center justify-center">
                      <input
                        type="checkbox"
                        aria-label={`Select ${name}`}
                        checked={selected.includes(user.id)}
                        onChange={(e) =>
                          dispatch({
                            type: e.target.checked ? "Selected" : "unSelected",
                            payload: user.id,
                          })
                        }
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-stone-300 checked:border-emerald-700 checked:bg-emerald-700 dark:border-stone-600"
                      />
                      <Check
                        className="pointer-events-none absolute hidden text-white peer-checked:block"
                        size={12}
                      />
                    </label>
                  </div>
                  <h3
                    className="truncate text-lg font-semibold tracking-tight"
                    title={name}
                  >
                    {name}
                  </h3>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-stone-400">
                    Personal contact
                  </p>
                  <div className="mt-6 space-y-3 text-sm text-stone-500 dark:text-stone-400">
                    <a
                      href={user.email ? `mailto:${user.email}` : undefined}
                      className="flex min-w-0 items-center gap-3 hover:text-emerald-700"
                    >
                      <Mail size={15} className="shrink-0" />
                      <span className="truncate">
                        {user.email || "No email added"}
                      </span>
                    </a>
                    <a
                      href={user.phone ? `tel:${user.phone}` : undefined}
                      className="flex items-center gap-3 hover:text-emerald-700"
                    >
                      <Phone size={15} className="shrink-0" />
                      <span className="truncate">
                        {user.phone || "No phone added"}
                      </span>
                    </a>
                  </div>
                  <div className="mt-6 flex min-h-11 items-center justify-between border-t border-stone-100 pt-4 dark:border-white/5">
                    <span className="flex items-center gap-1.5 text-[11px] text-stone-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />{" "}
                      In your circle
                    </span>
                    <div className="contact-actions">
                      {user.phone && (
                        <Motion.a
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.9 }}
                          className="icon-button"
                          href={`tel:${user.phone}`}
                          aria-label={`Call ${name}`}
                        >
                          <Phone size={15} />
                        </Motion.a>
                      )}
                      <Motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.9 }}
                        className="icon-button"
                        aria-label={`Edit ${name}`}
                        onClick={() =>
                          dispatch({ type: "START_EDIT", payload: user })
                        }
                      >
                        <Pencil size={15} />
                      </Motion.button>
                      <Motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.9 }}
                        className="icon-button hover:!bg-red-50 hover:!text-red-600 dark:hover:!bg-red-950"
                        aria-label={`Delete ${name}`}
                        onClick={() =>
                          dispatch({ type: "REMOVE_ITEM", payload: user.id })
                        }
                      >
                        <Trash2 size={15} />
                      </Motion.button>
                    </div>
                  </div>
                </Motion.article>
              );
            })}
          </AnimatePresence>
        </Motion.div>
        {filtered.length === 0 && (
          <Motion.div
            key={q ? "search-empty" : "empty"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center rounded-2xl border border-dashed border-stone-300 bg-white/40 px-6 py-20 text-center dark:border-white/15 dark:bg-white/[.02]"
          >
            <div className="relative mb-6 flex h-20 w-20 rotate-[-6deg] items-center justify-center rounded-3xl border border-white bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-900/5 dark:border-emerald-800 dark:bg-emerald-950">
              <BookIcon search={Boolean(q)} />
              <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm dark:bg-stone-800">
                <Plus size={14} />
              </span>
            </div>
            <h3 className="text-xl font-semibold tracking-tight">
              {q ? "No connections found" : "Your circle starts here"}
            </h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone-500 dark:text-stone-400">
              {q
                ? "Try a different name, email, or phone number. Your people are just a search away."
                : "Add your first contact and bring the people who matter into one thoughtful space."}
            </p>
            <Motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="primary-button mt-6"
              onClick={
                q ? () => dispatch({ type: "SET_SEARCH", payload: "" }) : onAdd
              }
            >
              {q ? "Clear search" : "Add your first contact"}
              <ArrowUpRight size={16} />
            </Motion.button>
          </Motion.div>
        )}
      </Motion.div>
      <p className="mt-5 text-xs text-stone-400" aria-live="polite">
        Showing {filtered.length} of {data.length} contacts
      </p>
    </section>
  );
}
function BookIcon({ search }) {
  return search ? (
    <Search size={30} strokeWidth={1.3} />
  ) : (
    <Users size={30} strokeWidth={1.3} />
  );
}

function Avatar({ user, initials, color }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl text-lg font-medium ${color}`}
    >
      {user.avatar && !failed ? (
        <img
          src={user.avatar}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        initials
      )}
    </div>
  );
}

function StatIcon({ icon }) {
  const Icon = icon;
  return <Icon size={20} strokeWidth={1.5} className="text-stone-400" />;
}
