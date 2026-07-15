import { motion } from "motion/react";
import logoIcon from "@/assets/Samton_logo_only.png";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-[#0a1f3c] py-12 border-t border-[#0a1f3c]/10 relative overflow-hidden"
    >
      {/* Subtle moving gradient */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(107,159,255,0.15), rgba(34,211,238,0.1), transparent)" }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={logoIcon}
              alt="Samton"
              className="h-7 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <span className="text-white/60" style={{ fontSize: "14px", fontWeight: 600 }}>
              Samton
            </span>
            <span className="text-white/25 ml-2" style={{ fontSize: "13px" }}>
              &copy; 2026 Samton. All rights reserved.
            </span>
          </motion.div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <motion.a
              href="mailto:samton-nature@samton.co.kr"
              className="text-white/35 hover:text-white/70 transition-colors"
              style={{ fontSize: "13px" }}
              whileHover={{ y: -1 }}
            >
              samton-nature@samton.co.kr
            </motion.a>
            <span className="text-white/15">|</span>
            <motion.a
              href="tel:070-4107-9524"
              className="text-white/35 hover:text-white/70 transition-colors"
              style={{ fontSize: "13px" }}
              whileHover={{ y: -1 }}
            >
              070-4107-9524
            </motion.a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
