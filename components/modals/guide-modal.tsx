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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { motion } from "framer-motion";

import { useGuideModal } from "@/lib/modal-store";

import { useState } from "react";
import { useEffect } from "react";

import { accordionItems } from "@/app/(dashboard)/(routes)/guide/page";

const GuideModal = () => {
  const guideModal = useGuideModal();

  const [loading, setLoading] = useState(false);

  return (
    <div>
      <Dialog open={guideModal.isOpen} onOpenChange={guideModal.onClose}>
        <DialogContent>
          <div>
            <DialogHeader>
              <DialogTitle>User Guide</DialogTitle>
              <DialogDescription>
                Here are some tips for using the models!
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Accordion type="single" collapsible className="w-full">
                {accordionItems.map((item, i) => (
                  <AccordionItem value={`item-${i}`} key={item.name}>
                    <AccordionTrigger className="text-xl">
                      {item.name}
                    </AccordionTrigger>
                    <AccordionContent className="text-md">
                      <div
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuideModal;
