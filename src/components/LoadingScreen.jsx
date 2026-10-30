import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { BookUser, Check } from "lucide-react";
import { Userscontext } from "../Context/Userscontext";
import { useLanguage } from "../i18n/LanguageContext";

export default function LoadingScreen({ onComplete }) {
  const { state } = useContext(Userscontext);
  const { t, number } = useLanguage();
  const [fontsReady, setFontsReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const settled = state.status !== "loading";
  useEffect(() => {
    let active = true;
    let fallback;
    Promise.race([
      document.fonts.ready,
      new Promise((resolve) => {
        fallback = setTimeout(resolve, 2000);
      }),
    ]).then(() => {
      if (active) setFontsReady(true);
    });
    return () => {
      active = false;
      clearTimeout(fallback);
    };
  }, []);
  useEffect(() => {
    if (!settled || !fontsReady) return;
    const timer = setTimeout(() => {
      setFinished(true);
      onComplete(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [settled, fontsReady, onComplete]);
  const progress = settled && fontsReady ? 100 : fontsReady ? 45 : 12;
  return (
    <AnimatePresence>
      {!finished && (
        <Motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.35 }}
          className="loading-screen fixed inset-0 z-[100] flex items-center justify-center bg-[#082735] px-8 text-white"
        >
          <div className="w-full max-w-sm text-center">
            <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
              <Motion.div
                aria-hidden="true"
                className="absolute inset-0 rounded-[32px] border border-sky-200/20"
                animate={{ rotate: 90 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-sky-100/20 bg-white/10 shadow-xl shadow-black/10">
                <BookUser size={30} strokeWidth={1.5} />
              </div>
            </div>
            <p className="text-4xl font-semibold tracking-tight" dir="ltr">
              folio<span className="text-sky-300">.</span>
            </p>
            <h2 className="mt-4 text-sm text-sky-100/80">
              {t(
                state.status === "error"
                  ? "Opening workspace"
                  : settled
                    ? "Your workspace is ready"
                    : "Preparing your connections",
              )}
            </h2>
            <div
              role="progressbar"
              aria-label={t("Loading workspace")}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="mt-9 h-1.5 overflow-hidden rounded-full bg-white/10"
            >
              <Motion.div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-200"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-sky-100/60">
              <span className="flex items-center gap-1.5">
                {progress === 100 && <Check size={12} />}{" "}
                {t(
                  progress === 100
                    ? "Ready"
                    : fontsReady
                      ? "Loading contacts"
                      : "Setting the scene",
                )}
              </span>
              <span>{number(progress)}%</span>
            </div>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
