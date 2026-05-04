"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ACCESS_VERIFIED_KEY = "taskflow-access-verified";

interface PinGuardProps {
  accessCode: string;
  children: React.ReactNode;
}

export function PinGuard({ accessCode, children }: PinGuardProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const verified = localStorage.getItem(ACCESS_VERIFIED_KEY);
    if (verified === "true") {
      setIsVerified(true);
    }
  }, []);

  const handleVerify = () => {
    if (code === accessCode) {
      localStorage.setItem(ACCESS_VERIFIED_KEY, "true");
      setIsVerified(true);
      setError("");
    } else {
      setError("Código incorrecto");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_VERIFIED_KEY);
    setIsVerified(false);
    setCode("");
  };

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {!isVerified && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-4"
          >
      <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-sm"
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4 shadow-xl shadow-violet-500/20">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                TaskFlow
              </h2>
              <p className="text-slate-400 text-sm">
                Ingresá el código de acceso para continuar
              </p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 shadow-2xl">
              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
                  <Input
                    type={showCode ? "text" : "password"}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Código de acceso"
                    className="pl-10 pr-10 rounded-xl bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 text-center tracking-widest text-lg focus:border-violet-500 focus:ring-violet-500/20"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleVerify();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCode(!showCode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-rose-400 text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <Button
                  onClick={handleVerify}
                  className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/35 transition-all border-0"
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Acceder
                </Button>
              </div>
            </div>

            <p className="text-center text-slate-600 text-xs mt-6">
              Demo protegida. Solicitá el código de acceso al autor.
            </p>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isVerified && (
        <>
          {children}
          <button
            onClick={handleLogout}
            className="fixed bottom-4 left-4 z-50 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors shadow-sm"
            title="Bloquear acceso"
          >
            <Lock className="w-4 h-4" />
          </button>
        </>
      )}
    </>
  );
}
