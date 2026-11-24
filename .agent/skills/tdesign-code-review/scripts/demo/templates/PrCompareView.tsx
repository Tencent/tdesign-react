import type { ReactElement } from "react";

type DemoRender = (props: { components: Record<string, any> }) => ReactElement;

interface PrCompareViewProps {
  description: string;
  demo: DemoRender;
  prComponents: Record<string, any>;
  prNumber: string;
  publishedComponents?: Record<string, any>;
  publishedVersion?: string;
}

const PKG_NAME = "tdesign-react";
const PR_URL = "https://github.com/Tencent/tdesign-react/pull";

export function PrCompareView({
  description,
  demo: Demo,
  prComponents,
  prNumber,
  publishedComponents,
  publishedVersion,
}: PrCompareViewProps) {
  const compareMode = Boolean(publishedComponents);

  return (
    <div
      style={{
        padding: 24,
        overflowX: "auto",
      }}
    >
      <p style={{ margin: "0 0 24px" }}>{description}</p>
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
            <Demo components={publishedComponents} />
          </section>
        ) : null}
        <section style={{ minWidth: 0 }}>
          <h3>
            <a href={`${PR_URL}/${prNumber}`} target="_blank" rel="noreferrer">
              {`${PKG_NAME}#PR-${prNumber}`}
            </a>
          </h3>
          <Demo components={prComponents} />
        </section>
      </div>
    </div>
  );
}
