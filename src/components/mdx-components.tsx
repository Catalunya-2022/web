import type { MDXComponents } from "mdx/types";
import NextLink from "next/link";
import { localizeHref } from "@/lib/path-utils";
import type { Locale } from "@/i18n/routing";

/** Factory that returns MDX components with locale-aware internal links.
 *  next-intl's Link CANNOT be used inside compileMDX (it's 'use client' with hooks).
 *  Instead we translate path segments and manually prepend the locale prefix. */
export function createMdxComponents(locale: Locale): MDXComponents {
  return {
    a: ({ href, children, ...props }) => {
      if (!href || href.startsWith("http") || href.startsWith("mailto:")) {
        return (
          <a
            {...props}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        );
      }
      // MDX files use canonical English paths; translate to locale-specific href
      const localizedHref = localizeHref(href, locale);
      return (
        <NextLink {...props} href={localizedHref}>
          {children}
        </NextLink>
      );
    },
  };
}
