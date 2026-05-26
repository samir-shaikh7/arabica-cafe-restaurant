import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const faqs = [
  {
    question: "Do you offer delivery in Kuwait?",
    answer: "Yes, we deliver our premium coffee and meals across Salmiya and surrounding areas in Kuwait. Enjoy your favorite Arabica drinks and dishes fresh at your doorstep."
  },
  {
    question: "What are your opening hours?",
    answer: "We are open daily from 7:00 AM to 11:30 PM. Join us for your morning brew, a hearty lunch, or a late-night coffee run."
  },
  {
    question: "Do you have vegetarian or vegan options?",
    answer: "Absolutely! We offer a variety of plant-based milks for our coffee and have dedicated vegetarian and vegan dishes on our food menu."
  },
  {
    question: "Do I need to make a reservation?",
    answer: "Walk-ins are always welcome! However, for larger groups or weekend evenings, we recommend making a reservation to ensure prompt seating."
  },
  {
    question: "Where are you located?",
    answer: "We are located at Northern Tower, Old Souk, Block 9, Salmiya, Kuwait. We offer both indoor and outdoor seating with a beautiful ambiance."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const revealRef = useScrollReveal();

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" ref={revealRef} className="py-20 md:py-32 bg-atmosphere relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-saffron/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16 reveal animate-fade-in-up">
          <div className="inline-block rounded-full bg-secondary border border-border px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-4">
            GOT QUESTIONS?
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-foreground mb-4">
            Frequently Asked <span className="text-gradient-warm">Questions</span>
          </h2>
          <p className="text-foreground/60 text-lg">
            Everything you need to know about dining and delivery with Arabica Coffee House.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`reveal animate-fade-in-up rounded-3xl border transition-all duration-300 ${
                  isOpen ? 'bg-card border-primary/30 shadow-elegant' : 'bg-card/50 border-border/50 hover:border-border hover:bg-card shadow-sm'
                }`}
                style={{ animationDelay: `${100 + index * 100}ms` }}
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between p-6 sm:p-8 text-left focus:outline-none"
                >
                  <span className="text-lg sm:text-xl font-bold text-foreground pr-8">
                    {faq.question}
                  </span>
                  <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-300 ${
                    isOpen ? 'gradient-primary text-primary-foreground shadow-md' : 'bg-secondary text-foreground/50'
                  }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 sm:p-8 pt-0 text-foreground/60 leading-relaxed font-medium">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
