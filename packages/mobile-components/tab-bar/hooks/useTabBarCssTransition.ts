import { useMemo } from 'react';

type useTabBarCssTransitionProps = {
  name: string;
};

function useTabBarCssTransition(props: useTabBarCssTransitionProps) {
  const { name } = props;

  return useMemo(
    () => ({
      enter: `${name}-enter-from`,
      enterActive: `${name}-enter-active`,
      enterDone: `${name}-enter-active`,

      exit: `${name}-leave-active`,
      exitActive: `${name}-leave-to`,
      exitDone: `${name}-leave-to`,
    }),
    [name],
  );
}

export default useTabBarCssTransition;
