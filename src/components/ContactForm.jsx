import { useLanguage } from "../i18n/LanguageContext";
import { useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Plus, X, UserRound, ArrowRight } from "lucide-react";
import { Userscontext } from "../Context/Userscontext";

export default function ContactForm({ open, onClose }) {
  const { state } = useContext(Userscontext);
  return (
    <AnimatePresence>
      {open && (
        <Modal
          key={state.editUser?.id ?? "new"}
          contact={state.editUser}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}
function Modal({ contact, onClose }) {
  const { t } = useLanguage();
  const { dispatch } = useContext(Userscontext);
  const [form, setForm] = useState(
    () => contact || { name: "", lastName: "", email: "", phone: "" },
  );
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector("input")?.focus();
    const keydown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const elements = [
          ...ref.current.querySelectorAll("button, input, a[href]"),
        ];
        const first = elements[0],
          last = elements.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keydown);
      previous?.focus();
    };
  }, [onClose]);
  const submit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      name: form.name.trim(),
      lastName: form.lastName.trim(),
    };
    if (!payload.name) return;
    dispatch({
      type: contact ? "UPDATE_USER" : "SET_USER",
      payload: contact ? payload : { ...payload, id: crypto.randomUUID() },
    });
    onClose();
  };
  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/35 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Motion.section
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="relative my-auto w-full max-w-lg rounded-3xl border border-white/80 bg-white p-6 shadow-2xl sm:p-8 dark:border-white/10 dark:bg-[#1d2320]"
      >
        <button
          onClick={onClose}
          className="icon-button absolute end-5 top-5"
          aria-label={t("Close modal")}
        >
          <X size={19} />
        </button>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
          <UserRound size={23} />
        </div>
        <h2
          id="contact-modal-title"
          className="text-2xl font-semibold tracking-tight"
        >
          {contact ? t("A little update") : t("Make a new connection")}
        </h2>
        <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
          {contact
            ? t("Keep their details up to date.")
            : t("Good things start with staying in touch.")}
        </p>
        <form onSubmit={submit} className="mt-7">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {[
              {
                key: "name",
                label: "First name",
                placeholder: "e.g. Alex",
                type: "text",
                autoComplete: "given-name",
              },
              {
                key: "lastName",
                label: "Last name",
                placeholder: "e.g. Morgan",
                type: "text",
                autoComplete: "family-name",
              },
              {
                key: "email",
                label: "Email address",
                placeholder: "alex@example.com",
                type: "email",
                autoComplete: "email",
              },
              {
                key: "phone",
                label: "Phone number",
                placeholder: "+1 (555) 000-0000",
                type: "tel",
                autoComplete: "tel",
              },
            ].map((field) => (
              <label
                key={field.key}
                className={`block text-xs font-medium ${["email", "phone"].includes(field.key) ? "sm:col-span-2" : ""}`}
              >
                {t(field.label)}
                {field.key === "name" && (
                  <span className="ms-1 text-emerald-600">*</span>
                )}
                <input
                  className="form-input"
                  dir={["email", "phone"].includes(field.key) ? "ltr" : "auto"}
                  name={field.key}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  placeholder={t(field.placeholder)}
                  required={field.key === "name"}
                  pattern={field.key === "name" ? ".*\\S.*" : undefined}
                  value={form[field.key]}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                />
              </label>
            ))}
          </div>
          <div className="mt-8 flex justify-end gap-3 border-t border-stone-100 pt-6 dark:border-white/10">
            <Motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              className="secondary-button"
              onClick={onClose}
            >
              {t("Cancel")}
            </Motion.button>
            <Motion.button
              type="submit"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="primary-button"
            >
              {contact ? <ArrowRight size={16} /> : <Plus size={16} />}{" "}
              {contact ? t("Save changes") : t("Add contact")}
            </Motion.button>
          </div>
        </form>
      </Motion.section>
    </Motion.div>
  );
}
