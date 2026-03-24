diff --git a/src/pages/Home.tsx b/src/pages/Home.tsx
index 79b444898cee5a025e45e8c8942ec003e85aa899..41c676c260a45882b5c0874645e88a10a0e1660d 100644
--- a/src/pages/Home.tsx
+++ b/src/pages/Home.tsx
@@ -61,51 +61,51 @@ export default function Home() {
               animate="animate"
               variants={staggerContainer}
               className="max-w-4xl mx-auto text-center space-y-8"
             >
               <motion.div variants={fadeInUp} className="inline-block">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium mb-6">
                   <Zap className="h-4 w-4 text-primary" />
                   <span>Skip the middleman. Apply smarter.</span>
                 </div>
               </motion.div>
 
               <motion.h1
                 variants={fadeInUp}
                 className="text-5xl md:text-7xl font-bold tracking-tight"
               >
                 Apply Direct Before 
                 <span className="block text-primary">
                   The Job Is Advertised
                 </span>
               </motion.h1>
 
               <motion.p
                 variants={fadeInUp}
                 className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
               >
-                Paste any real or aspirational job description in your targetCrewDog helps expats contact decision makers on LinkedIn for jobs abroad
+                Paste any real or aspirational job description for your target role. CrewDog enables expats to connect directly with decision-makers on LinkedIn for international opportunities.
               </motion.p>
 
               <motion.div
                 variants={fadeInUp}
                 className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
               >
                 <Link to="/run">
                   <Button
                     size="lg"
                     className="text-lg px-8 py-6 magnetic-button glow-effect"
                   >
                     Start Free Search
                   </Button>
                 </Link>
                 <Link to="/faq">
                   <Button
                     size="lg"
                     variant="outline"
                     className="text-lg px-8 py-6"
                   >
                     Learn More
                   </Button>
                 </Link>
               </motion.div>
             </motion.div>
@@ -149,87 +149,87 @@ export default function Home() {
                 <div className="text-4xl md:text-5xl font-bold text-primary">
                   {counts.success}%
                 </div>
                 <div className="text-muted-foreground">Success Rate</div>
               </motion.div>
             </div>
             <p className="text-center text-sm text-muted-foreground mt-8">
               * Demo statistics for illustration purposes
             </p>
           </div>
         </section>
 
         {/* What is CrewDog */}
         <section className="py-20">
           <div className="container mx-auto px-4">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="max-w-3xl mx-auto text-center space-y-6 mb-16"
             >
               <h2 className="text-4xl md:text-5xl font-bold">
                 What is CrewDog?
               </h2>
               <p className="text-xl text-muted-foreground">
-                Paste any real or aspirational job description in your target country. CrewDog shows relevant HR and hiring-side profiles so you can reach out directly
+                Paste any real or aspirational job description for your target country. CrewDog identifies relevant HR and hiring professionals, enabling you to contact them directly.
               </p>
             </motion.div>
 
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.1 }}
               >
                 <Card className="p-6 h-full glass-card hover:shadow-xl transition-shadow">
                   <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                     <Search className="h-6 w-6 text-primary" />
                   </div>
                   <h3 className="text-xl font-semibold mb-3">
                     Intelligent Analysis
                   </h3>
                   <p className="text-muted-foreground">
-                    Our AI analyzes any job description to surface relevant LinkedIn contacts who may help you secure roles like this.
+                    Our AI analyses any job description to identify relevant LinkedIn contacts who may assist you in securing similar roles.
                   </p>
                 </Card>
               </motion.div>
 
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.2 }}
               >
                 <Card className="p-6 h-full glass-card hover:shadow-xl transition-shadow">
                   <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                     <Target className="h-6 w-6 text-primary" />
                   </div>
                   <h3 className="text-xl font-semibold mb-3">Direct Routes</h3>
                   <p className="text-muted-foreground">
-                    Discover company websites, career pages, and hiring manager contacts. Apply direct before the job is advertised.
+                    Discover company websites, careers pages, and hiring manager contacts. Apply directly before roles are advertised.
                   </p>
                 </Card>
               </motion.div>
 
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.3 }}
               >
                 <Card className="p-6 h-full glass-card hover:shadow-xl transition-shadow">
                   <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                     <TrendingUp className="h-6 w-6 text-primary" />
                   </div>
                   <h3 className="text-xl font-semibold mb-3">Reach out on LinkedIn</h3>
                   <p className="text-muted-foreground">
                    Going direct results in higher response rates than going through third-party recruiters.
                   </p>
                 </Card>
               </motion.div>
             </div>
           </div>
         </section>
 
         {/* Why Use CrewDog */}
@@ -319,26 +319,26 @@ export default function Home() {
         <section className="py-20">
           <div className="container mx-auto px-4">
             <Card className="max-w-3xl mx-auto p-12 text-center glass-card glow-effect">
               <h2 className="text-3xl md:text-4xl font-bold mb-4">
                 Find roles before they are publicly advertised.
               </h2>
               <p className="text-xl text-muted-foreground mb-8">
                 Start your first search free. No credit card required.
               </p>
               <Link to="/run">
                 <Button
                   size="lg"
                   className="text-lg px-12 py-6 magnetic-button"
                 >
                   Start Your Search Now
                 </Button>
               </Link>
             </Card>
           </div>
         </section>
       </main>
 
       <Footer />
     </div>
   );
-}
\ No newline at end of file
+}
