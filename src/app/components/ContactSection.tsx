import { motion } from "motion/react";
import { Phone, Mail, MapPin, Printer } from "lucide-react";
import { useState, useRef } from "react";

function MagneticButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
    setPos({ x, y });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
}

function AnimatedInput({
  label,
  type = "text",
  placeholder,
  isTextarea = false,
}: {
  label: string;
  type?: string;
  placeholder: string;
  isTextarea?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-[#f5f7fa] border text-[#0a1f3c] placeholder-[#0a1f3c]/25 focus:outline-none transition-all duration-300";

  return (
    <motion.div
      animate={{
        borderColor: focused ? "rgba(107,159,255,0.3)" : "rgba(10,31,60,0.08)",
      }}
      className="relative"
    >
      <label
        className="block mb-2 transition-colors duration-300"
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: focused ? "rgba(107,159,255,0.9)" : "rgba(10,31,60,0.45)",
        }}
      >
        {label}
      </label>
      {isTextarea ? (
        <textarea
          rows={4}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setHasValue(e.target.value.length > 0)}
          className={`${inputClasses} resize-none ${
            focused
              ? "border-[#6b9fff]/30 bg-white shadow-[0_0_20px_rgba(107,159,255,0.06)]"
              : "border-[#0a1f3c]/[0.08]"
          }`}
          style={{ fontSize: "14px" }}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setHasValue(e.target.value.length > 0)}
          className={`${inputClasses} ${
            focused
              ? "border-[#6b9fff]/30 bg-white shadow-[0_0_20px_rgba(107,159,255,0.06)]"
              : "border-[#0a1f3c]/[0.08]"
          }`}
          style={{ fontSize: "14px" }}
        />
      )}
      {/* Focus indicator line */}
      <motion.div
        className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-[#6b9fff]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

const contactItems = [
  { icon: Phone, label: "법인 전화", value: "070-4107-9524", href: "tel:070-4107-9524" },
  { icon: Printer, label: "FAX", value: "0504-296-9524", href: null },
  { icon: Mail, label: "이메일", value: "samton-nature@samton.co.kr", href: "mailto:samton-nature@samton.co.kr" },
  {
    icon: MapPin,
    label: "주소",
    value: "인천광역시 연수구 갯벌로 12, 미추홀캠퍼스 별관 A동 401호",
    href: null,
  },
];

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="relative bg-[#f5f7fa] py-24 lg:py-32 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0a1f3c]/10 to-transparent" />
      {/* Gradient orb */}
      <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-[#6b9fff]/5 to-transparent rounded-full blur-[200px]" />

      {/* Animated corner decoration */}
      <motion.div
        className="absolute top-20 right-20 w-px h-40 bg-gradient-to-b from-[#6b9fff]/15 to-transparent hidden lg:block"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ transformOrigin: "top" }}
      />
      <motion.div
        className="absolute top-20 right-20 h-px w-40 bg-gradient-to-r from-[#6b9fff]/15 to-transparent hidden lg:block"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ transformOrigin: "left" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="text-[#6b9fff] mb-4 tracking-widest"
              style={{ fontSize: "12px", fontWeight: 600 }}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              CONTACT US
            </motion.div>
            <h2
              className="text-[#0a1f3c] mb-6"
              style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em" }}
            >
              프로젝트를
              <br />
              시작해 보세요
            </h2>
            <p className="text-[#0a1f3c]/45 max-w-md mb-12" style={{ fontSize: "16px", lineHeight: 1.8 }}>
              복잡한 요구사항도 괜찮습니다. Samton이 구조화하고 해결하겠습니다.
              편하게 연락주세요.
            </p>

            {/* Contact Info with stagger */}
            <div className="space-y-5">
              {contactItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <motion.div
                    className="flex-shrink-0 w-10 h-10 rounded-xl bg-white border border-[#0a1f3c]/[0.06] flex items-center justify-center shadow-sm"
                    whileHover={{
                      backgroundColor: "rgba(107,159,255,0.1)",
                      borderColor: "rgba(107,159,255,0.3)",
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <item.icon size={18} className="text-[#6b9fff]" strokeWidth={1.5} />
                  </motion.div>
                  <div>
                    <div className="text-[#0a1f3c]/35 mb-0.5" style={{ fontSize: "12px", fontWeight: 600 }}>
                      {item.label}
                    </div>
                    {item.href ? (
                      <motion.a
                        href={item.href}
                        className="text-[#0a1f3c]/70 hover:text-[#0a1f3c] transition-colors inline-block"
                        style={{ fontSize: "15px", fontWeight: 500 }}
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.value}
                      </motion.a>
                    ) : (
                      <span className="text-[#0a1f3c]/70" style={{ fontSize: "15px", fontWeight: 500 }}>
                        {item.value}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="p-8 lg:p-10 rounded-2xl bg-white border border-[#0a1f3c]/[0.06] relative overflow-hidden shadow-sm"
              whileHover={{ borderColor: "rgba(107,159,255,0.15)", boxShadow: "0 8px 30px rgba(10,31,60,0.06)" }}
              transition={{ duration: 0.3 }}
            >
              {/* Corner glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#6b9fff] rounded-full blur-[100px] opacity-[0.04]" />

              <h3 className="text-[#0a1f3c] mb-8" style={{ fontSize: "20px", fontWeight: 700 }}>
                문의하기
              </h3>

              {!submitted ? (
                <form
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <AnimatedInput label="회사명" placeholder="회사명을 입력해주세요" />
                    <AnimatedInput label="담당자명" placeholder="성함을 입력해주세요" />
                  </div>
                  <AnimatedInput label="이메일" type="email" placeholder="이메일 주소를 입력해주세요" />
                  <AnimatedInput label="연락처" type="tel" placeholder="연락처를 입력해주세요" />
                  <AnimatedInput label="프로젝트 내용" placeholder="프로젝트에 대해 간략히 설명해주세요" isTextarea />

                  <MagneticButton
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#0a1f3c] text-white hover:bg-[#133254] transition-colors relative overflow-hidden group"
                    style={{ fontSize: "15px", fontWeight: 700 }}
                  >
                    <span className="relative z-10">문의 보내기</span>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </MagneticButton>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6"
                  >
                    <svg width="28" height="28" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h4 className="text-[#0a1f3c] mb-2" style={{ fontSize: "20px", fontWeight: 700 }}>
                    문의가 접수되었습니다
                  </h4>
                  <p className="text-[#0a1f3c]/45" style={{ fontSize: "14px", lineHeight: 1.7 }}>
                    빠른 시일 내에 담당자가 연락드리겠습니다.
                    <br />
                    감사합니다.
                  </p>
                  <motion.button
                    className="mt-6 px-6 py-2 rounded-lg border border-[#0a1f3c]/10 text-[#0a1f3c]/50 hover:text-[#0a1f3c] hover:border-[#0a1f3c]/20 transition-all"
                    style={{ fontSize: "13px", fontWeight: 600 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSubmitted(false)}
                  >
                    다시 작성하기
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
