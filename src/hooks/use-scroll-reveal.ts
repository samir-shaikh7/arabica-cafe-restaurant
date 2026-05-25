import React, { useEffect, useRef, type DependencyList } from "react";

/** 
 * Adds `.in` class to children with `.reveal` when they intersect viewport.
 * 
 * IMPORTANT: Pass any data-dependent values in deps[] so the observer
 * re-initializes after async data loads and new .reveal elements render.
 * 
 * Safety: A 1.5s fallback ensures elements are always shown even if
 * IntersectionObserver doesn't fire (e.g. if section is already in viewport).
 */
export function useScrollReveal(deps: DependencyList = []) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // Small delay to let React finish rendering new children
    const initTimer = setTimeout(() => {
      const targets = root.querySelectorAll<Element>(".reveal:not(.in)");
      
      if (targets.length === 0) return;

      // Check which elements are already in viewport (no scroll needed)
      const immediatelyVisible: Element[] = [];
      const needObserving: Element[] = [];

      targets.forEach((target) => {
        const rect = target.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (inViewport) {
          immediatelyVisible.push(target);
        } else {
          needObserving.push(target);
        }
      });

      // Immediately reveal elements already in viewport
      immediatelyVisible.forEach((el) => el.classList.add("in"));

      if (needObserving.length === 0) return;

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.05,
          rootMargin: "0px 0px -20px 0px",
        }
      );

      needObserving.forEach((target) => io.observe(target));

      // Hard fallback: force-show all after 1.5s regardless
      const fallbackTimer = setTimeout(() => {
        root.querySelectorAll<Element>(".reveal:not(.in)").forEach((t) =>
          t.classList.add("in")
        );
      }, 1500);

      // Cleanup
      return () => {
        io.disconnect();
        clearTimeout(fallbackTimer);
      };
    }, 80); // tiny delay for React to finish rendering children

    return () => clearTimeout(initTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref as React.RefObject<any>;
}
