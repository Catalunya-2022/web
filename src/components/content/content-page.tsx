import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSanitize from "rehype-sanitize";
import { createMdxComponents } from "@/components/mdx-components";
import { NavCards } from "@/components/content/nav-cards";
import { CopyPageSetter } from "@/components/content/copy-page-setter";
import { PageActionBar } from "@/components/content/page-action-bar";
import { PageHeader } from "@/components/content/page-header";
import { PrintHeader } from "@/components/content/print-header";
import type { ParsedContent } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

export async function ContentPage({
  slug,
  locale,
  content,
  children,
}: {
  slug: string;
  locale: Locale;
  content: ParsedContent;
  children?: React.ReactNode;
}) {
  const { content: mdxContent } = await compileMDX({
    source: content.body,
    components: createMdxComponents(locale),
    options: {
      mdxOptions: {
        rehypePlugins: [rehypeSanitize],
      },
    },
  });

  const pageTitle = content.subtitle;

  return (
    <>
      <CopyPageSetter title={pageTitle} slug={slug} rawContent={content.raw} locale={locale} citable />
      <PrintHeader locale={locale} />
      <PageActionBar
        slug={slug}
        locale={locale}
        title={pageTitle}
        rawContent={content.raw}
        citable
      />

      <PageHeader subtitle={content.identifier} title={pageTitle} />

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        {mdxContent}
      </article>

      {children}

      <NavCards slug={slug} locale={locale} />
    </>
  );
}
