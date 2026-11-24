declare module "@review/pr" {
  const pkg: Record<string, any>;
  export = pkg;
}

declare module "@review/pr-style";

declare module "@review/published" {
  const pkg: Record<string, any>;
  export = pkg;
}

declare const __PUBLISHED_IMPORT__: unknown;
declare const __DEMO_IMPORT__: unknown;
declare function ReviewDemo(props: {
  components: Record<string, any>;
}): import("react").ReactElement;
declare const __DESCRIPTION_JSON__: string;
declare const __PR_JSON__: string;
declare const __ORIGINAL_DEMO_PAGES_PROP__: {
  originalDemoPages?: {
    pr: string;
    published?: string;
  };
};
declare const __PUBLISHED_PROPS__: {
  publishedComponents?: Record<string, any>;
  publishedVersion?: string;
};
