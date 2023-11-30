"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

import { useProModal } from "@/lib/modal-store";

import { useState } from "react";
import { useEffect } from "react";

const ProModal = () => {
  const proModal = useProModal();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getLoader() {
      const { grid } = await import("ldrs");
      grid.register();
    }
    getLoader();
  }, []);

  const onSubscribe = async () => {
    try {
      setLoading(true);

      const response: any = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      let session = await response.json();

      console.log(session);

      window.location.href = session.url;
    } catch (error) {
      alert(error);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
        <DialogContent>
          {loading ? (
            <motion.div
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ease: "easeIn", duration: 0.3 }}
            >
              <DialogHeader>
                <div className="flex flex-col justify-center items-center m-2">
                  <h1 className="text-color-cyan-500 text-xl font-bold m-2 mb-6">
                    Loading Stripe Session
                  </h1>
                  <l-grid size="80" speed="1.5" color="black"></l-grid>
                </div>
              </DialogHeader>
            </motion.div>
          ) : (
            <div>
              <DialogHeader>
                <DialogTitle>Upgrade account to Pro</DialogTitle>
                <DialogDescription>
                  Free accounts are limited to 25 generations per month. Upgrade
                  to a Pro account for unlimited generations.
                  <hr className="m-3" />
                  Use card <strong>4242 4242 4242 4242</strong> with any other
                  info to subscribe in the test environment
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <div className="flex flex-col w-full mt-5">
                  <Button
                    disabled={loading}
                    onClick={onSubscribe}
                    size="lg"
                    className="w-full transition duration-400  ease-in-out bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800 hover:scale-105"
                  >
                    Upgrade
                    <Zap className="w-4 h-4 ml-2 fill-white" />
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProModal;
