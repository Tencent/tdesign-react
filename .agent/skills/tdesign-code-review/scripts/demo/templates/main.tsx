/// <reference path="./types.d.ts" />
import { createRoot } from "react-dom/client";
import * as prPkg from "@review/pr";
__PUBLISHED_IMPORT__
import "@review/pr-style";
__DEMO_IMPORT__
import { PrCompareView } from "./PrCompareView";

function ReviewPr__PR__() {
  return (
    <PrCompareView
      description={__DESCRIPTION_JSON__}
      reviewDemo={ReviewDemo}
      {...__ORIGINAL_DEMO_PAGES_PROP__}
      prComponents={prPkg}
      prNumber={__PR_JSON__}
      {...__PUBLISHED_PROPS__}
    />
  );
}

createRoot(document.getElementById("root")!).render(<ReviewPr__PR__ />);
