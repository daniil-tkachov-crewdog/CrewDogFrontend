import { Link, useNavigate } from "react-router-dom";
import {
  Plane,
  Sparkles,
  Twitter,
  Linkedin,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { gaEvent } from "@/analytics/gtm";

export const Footer = () => {
  const navigate = useNavigate();

  function track(event: string, params?: Record<string, any>) {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event, ...(params || {}) });
    try {
      gaEvent(event, params);
    } catch {}
  }

  function handleFooterNavClick(label: string, to: string) {
    track("footer_link_click", { label, to });
  }

  function handleSocialClick(label: string, href: string) {
    track("social_link_click", { label, href });
  }

  function reopenConsent() {
    try {
      localStorage.removeItem("gc-consent-v1");
    } catch {}
    track("manage_cookies_click");
    location.reload();
  }

  return (
    <footer className="relative border-t border-border/40 mt-20 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 animate-gradient" />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            className="md:col-span-4 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 group">
              <motion.div
                className="relative p-3 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Plane className="h-7 w-7 text-primary-foreground" />
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(var(--primary), 0.3)",
                      "0 0 40px rgba(var(--primary), 0.5)",
                      "0 0 20px rgba(var(--primary), 0.3)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <motion.div
                className="relative"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                  CrewDog
                </span>
                <Sparkles className="absolute -top-1 -right-6 h-4 w-4 text-primary animate-pulse" />
              </motion.div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Find jobs before they are publicly advertised.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                {
                  icon: Twitter,
                  label: "Twitter",
                  gradient: "from-blue-400 to-blue-600",
                  href: "#",
                },
                {
                  icon: Linkedin,
                  label: "LinkedIn",
                  gradient: "from-blue-500 to-blue-700",
                  href: "#",
                },
                {
                  icon: Mail,
                  label: "Email",
                  gradient: "from-purple-500 to-pink-600",
                  href: "mailto:hello@crewdog.ai",
                },
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  onClick={() => handleSocialClick(social.label, social.href)}
                  className="relative p-3 rounded-xl glass-card group overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${social.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  />
                  <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors relative z-10" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Sections */}
          {[
            {
              title: "Product",
              links: [
                { to: "/run", label: "Run Search" },
                { to: "/pricing", label: "Pricing" },
                // { to: "/faq", label: "FAQ" },
              ],
            },
            {
              title: "Support",
              links: [
                { to: "/support", label: "Contact" },
                { to: "/faq", label: "FAQ" },
                { to: "/account", label: "My Account" },
              ],
            },
            {
              title: "Legal",
              links: [
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms of Use" },
              ],
            },
          ].map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              className="md:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
            >
              <h4 className="font-semibold mb-6 text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.to}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: sectionIndex * 0.1 + linkIndex * 0.05,
                    }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => handleFooterNavClick(link.label, link.to)}
                      className="group text-sm text-muted-foreground hover:text-foreground transition-all duration-300 flex items-center gap-2"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300" />
                      </span>
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter Section */}
          <motion.div
            className="md:col-span-2 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-semibold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Stay Updated
            </h4>
            <p className="text-xs text-muted-foreground">
              Get the latest updates on new features and job insights.
            </p>
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative glass-card p-1 rounded-xl">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 bg-background/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-8 border-t border-border/40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025{" "}
              <span className="font-semibold text-foreground">CrewDog</span>.
              All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <motion.button
                type="button"
                onClick={reopenConsent}
                whileHover={{ scale: 1.05 }}
                className="underline underline-offset-2"
                title="Manage cookies"
              >
                Manage cookies
              </motion.button>
              <motion.span
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                All systems operational
              </motion.span>
              <motion.span whileHover={{ scale: 1.05 }}>
                Made with ❤️ for job seekers
              </motion.span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
