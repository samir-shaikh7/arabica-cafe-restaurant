import React, { useEffect, useRef } from "react";

/**
 * Production-grade scroll reveal hook.
 * 
 * Adds `.in` class to children with `.reveal` when they intersect viewport.
 * Elements are revealed ONCE and stay visible forever — no re-animation,
 * no flickering, no disappearing on scroll.
 * 
 * Key design decisions:
 * - No dependency array — observer initializes once on mount
 * - MutationObserver watches for dynamically added .reveal elements
 * - Elements that have already been revealed (.in) are never touched again
 * - IntersectionObserver unobserves after reveal (one-shot)
 * - Fallback timer ensures nothing stays invisible
 */
export function useScrollReveal() {
  const ref = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const mutationRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // Create IntersectionObserver once
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0, rootMargin: "100px 0px 100px 0px" }
    );
    observerRef.current = io;

    // Function to observe new .reveal elements that don't have .in yet
    const observeNewTargets = () => {
      const targets = root.querySelectorAll<Element>(".reveal:not(.in)");
      targets.forEach((target) => {
        const rect = target.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight + 100 && rect.bottom > -100;
        if (inViewport) {
          target.classList.add("in");
        } else {
          io.observe(target);
        }
      });
    };

    // Initial scan
    observeNewTargets();

    // MutationObserver to catch dynamically rendered .reveal elements
    // (e.g. when Supabase data arrives and new menu cards render)
    const mo = new MutationObserver(() => {
      observeNewTargets();
    });
    mutationRef.current = mo;
    mo.observe(root, { childList: true, subtree: true });

    // Hard fallback: force-show everything after 2s
    const fallback = setTimeout(() => {
      root.querySelectorAll<Element>(".reveal:not(.in)").forEach((el) =>
        el.classList.add("in")
      );
    }, 2000);

    return () => {
      io.disconnect();
      mo.disconnect();
      clearTimeout(fallback);
    };
  }, []); // Empty deps — initialize once, MutationObserver handles dynamic content

  return ref as React.RefObject<any>;
}
