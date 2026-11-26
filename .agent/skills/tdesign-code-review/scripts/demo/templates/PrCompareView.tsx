import type { ReactElement } from "react";

type DemoRender = (props: { components: Record<string, any> }) => ReactElement;

interface PrCompareViewProps {
  description: string;
  reviewDemo: DemoRender;
  originalDemoPages?: {
    pr: string;
    published?: string;
  };
  prComponents: Record<string, any>;
  prNumber: string;
  publishedComponents?: Record<string, any>;
  publishedVersion?: string;
}

const PKG_NAME = "tdesign-react";
const PR_URL = "https://github.com/Tencent/tdesign-react/pull";

export function PrCompareView({
  description,
  reviewDemo,
  originalDemoPages,
  prComponents,
  prNumber,
  publishedComponents,
  publishedVersion,
}: PrCompareViewProps) {
  const compareMode = Boolean(publishedComponents);
  const ReviewDemo = reviewDemo;
  return (
    <div
      style={{
        padding: 24,
        overflowX: "auto",
      }}
    >
      <p style={{ margin: "0 0 16px" }}>
        <a
          href={`${PR_URL}/${prNumber}`}
          target="_blank"
          rel="noreferrer"
        >
          {`${PKG_NAME}#PR-${prNumber}`}
        </a>
      </p>
      <p style={{ margin: "0 0 24px" }}>{description}</p>
      <div style={{ display: "grid", gap: 32 }}>
        {originalDemoPages ? (
          <section style={{ display: "grid", gap: 12 }}>
            <h2 style={{ margin: 0 }}>原始复现</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: originalDemoPages.published
                  ? "minmax(560px, 1fr) minmax(560px, 1fr)"
                  : "minmax(560px, 1fr)",
                gap: 24,
                minWidth: originalDemoPages.published ? 1144 : 560,
              }}
            >
              {originalDemoPages.published ? (
                <section style={{ minWidth: 0 }}>
                  <h3>{`${PKG_NAME}@${publishedVersion}`}</h3>
                  <iframe
                    src={originalDemoPages.published}
                    title="原始复现（发布版）"
                    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                    style={{
                      width: "100%",
                      height: 560,
                      border: "1px solid #dcdcdc",
                      borderRadius: 6,
                    }}
                  />
                </section>
              ) : null}
              <section style={{ minWidth: 0 }}>
                <h3>{`${PKG_NAME}#PR-${prNumber}`}</h3>
                <iframe
                  src={originalDemoPages.pr}
                  title="原始复现（PR）"
                  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                  style={{
                    width: "100%",
                    height: 560,
                    border: "1px solid #dcdcdc",
                    borderRadius: 6,
                  }}
                />
              </section>
            </div>
          </section>
        ) : null}
        <section style={{ display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0 }}>审查复现</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: compareMode
                ? "minmax(560px, 1fr) minmax(560px, 1fr)"
                : "minmax(560px, 1fr)",
              gap: 24,
              minWidth: compareMode ? 1144 : 560,
            }}
          >
            {publishedComponents ? (
              <section style={{ minWidth: 0 }}>
                <h3>{`${PKG_NAME}@${publishedVersion}`}</h3>
                <ReviewDemo components={publishedComponents} />
              </section>
            ) : null}
            <section style={{ minWidth: 0 }}>
              <h3>{`${PKG_NAME}#PR-${prNumber}`}</h3>
              <ReviewDemo components={prComponents} />
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
