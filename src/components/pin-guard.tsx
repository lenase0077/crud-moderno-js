"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PIN_STORAGE_KEY = "taskflow-access-pin";
const PIN_VERIFIED_KEY = "taskflow-pin-verified";

export function PinGuard({ children }: { children: React.ReactNode }) {
  const [isVerified, setIsVerified] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedPin = localStorage.getItem(PIN_STORAGE_KEY);
    const verified = localStorage.getItem(PIN_VERIFIED_KEY);
    if (storedPin) {
      setHasPin(true);
      if (verified === "true") {
        setIsVerified(true);
      }
    }
  }, []);

  const handleSetPin = () => {
    if (pin.length < 4) {
      setError("El PIN debe tener al menos 4 dígitos");
      return;
    }
    localStorage.setItem(PIN_STORAGE_KEY, pin);
    localStorage.setItem(PIN_VERIFIED_KEY, "true");
    setHasPin(true);
    setIsVerified(true);
    setError("");
  };

  const handleVerifyPin = () => {
    const storedPin = localStorage.getItem(PIN_STORAGE_KEY);
    if (pin === storedPin) {
      localStorage.setItem(PIN_VERIFIED_KEY, "true");
      setIsVerified(true);
      setError("");
    } else {
      setError("PIN incorrecto");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(PIN_VERIFIED_KEY);
    setIsVerified(false);
    setPin("");
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
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  TaskFlow
                </h2>
                <p className="text-slate-400 text-sm">
                  {hasPin
                    ? "Ingresá tu PIN para continuar"
                    : "Creá un PIN para proteger tu gestor de tareas"}
                </p>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <div className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder={hasPin ? "Ingresá tu PIN" : "Creá un PIN (mín. 4 dígitos)"}
                      className="pl-10 rounded-xl bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          hasPin ? handleVerifyPin() : handleSetPin();
                        }
                      }}
                    />
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
                    onClick={hasPin ? handleVerifyPin : handleSetPin}
                    className="w-full rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-medium"
                  >
                    {hasPin ? (
                      <>
                        <Unlock className="w-4 h-4 mr-2" />
                        Desbloquear
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Guardar PIN
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-center text-slate-500 text-xs mt-6">
                Este PIN se guarda localmente en tu dispositivo.
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
            className="fixed bottom-4 left-4 z-50 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            title="Bloquear (cerrar sesión)"
          >
            <Lock className="w-4 h-4" />
          </button>
        </>
      )}
    </>
  );
}
