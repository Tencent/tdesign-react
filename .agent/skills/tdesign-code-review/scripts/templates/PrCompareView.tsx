import type { ReactElement } from "react";

type DemoRender = (props: {
  components: Record<string, any>;
}) => ReactElement;

interface PrCompareViewProps {
  description: string;
  demo: DemoRender;
  prComponents: Record<string, any>;
  prNumber: string;
  publishedComponents?: Record<string, any>;
  publishedVersion?: string;
}

const PKG_NAME = "tdesign-react";

export function PrCompareView({
  description,
  demo: Demo,
  prComponents,
  prNumber,
  publishedComponents,
  publishedVersion,
}: PrCompareViewProps) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 48,
        alignItems: "flex-start",
        padding: 24,
      }}
    >
      <p style={{ flex: "1 0 100%", margin: 0 }}>{description}</p>
      {publishedComponents ? (
        <section>
          <h3>{`${PKG_NAME}@${publishedVersion}`}</h3>
          <Demo components={publishedComponents} />
        </section>
      ) : null}
      <section>
        <h3>{`${PKG_NAME}#PR-${prNumber}`}</h3>
        <Demo components={prComponents} />
      </section>
    </div>
  );
}
