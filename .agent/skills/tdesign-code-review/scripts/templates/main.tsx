/// <reference path="./types.d.ts" />
import { createRoot } from 'react-dom/client';
import * as prPkg from '@review/pr';
__PUBLISHED_IMPORT__
import '@review/pr-style';

import { PrCompareView } from './PrCompareView';

__DEMO_FN__

function ReviewPr__PR__() {
  return (
    <PrCompareView
      description={__DESCRIPTION_JSON__}
      demo={Demo}
      prComponents={prPkg}
      prNumber={__PR_JSON__}
      {...__PUBLISHED_PROPS__}
    />
  );
}

createRoot(document.getElementById('root')!).render(<ReviewPr__PR__ />);
