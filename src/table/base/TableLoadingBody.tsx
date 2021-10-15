import isFunction from 'lodash/isFunction';

export default function TableLoadingBody(props) {
  const { loading } = props;
  if (!loading) return null;

  let result = null;

  if (loading) result = loading;
  if (isFunction(loading)) result = loading();

  return result;
}
