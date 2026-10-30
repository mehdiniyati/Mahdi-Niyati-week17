import { useContext } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { Undo2, X, CheckCircle2 } from "lucide-react";
import { Userscontext } from "../Context/Userscontext";
import { useLanguage } from "../i18n/LanguageContext";
export default function UndoToast() {
  const { state, dispatch } = useContext(Userscontext);
  const { t, number } = useLanguage();
  return (
    <AnimatePresence>
      {state.deleted?.length > 0 && (
        <Motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="fixed bottom-5 start-4 end-4 z-40 mx-auto flex max-w-lg flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-petrol-950 px-4 py-3 text-sm text-white shadow-2xl sm:start-auto sm:end-6 sm:mx-0"
          role="status"
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-petrol-300" />
            {t("{count} contacts deleted", {
              count: number(state.deleted.length),
            })}
          </span>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 rounded-lg px-3 py-2 font-semibold text-petrol-200 hover:bg-white/10"
              onClick={() => dispatch({ type: "UNDO_DELETE" })}
            >
              <Undo2 size={16} />
              {t("Undo")}
            </button>
            <button
              className="icon-button !text-white/70"
              aria-label={t("Dismiss notification")}
              onClick={() => dispatch({ type: "DISMISS_UNDO" })}
            >
              <X size={16} />
            </button>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
