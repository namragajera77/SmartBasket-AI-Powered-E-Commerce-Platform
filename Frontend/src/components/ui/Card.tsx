import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={cn("card-surface", className)}
    >
      {children}
    </motion.section>
  );
}

