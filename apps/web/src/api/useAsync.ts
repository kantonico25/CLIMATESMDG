import { useEffect, useState } from "react";

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

type UseAsyncOptions = {
  keepPreviousData?: boolean;
};

export function useAsync<T>(
  loader: () => Promise<T>,
  deps: React.DependencyList,
  options: UseAsyncOptions = {}
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null
  });
  const { keepPreviousData = false } = options;

  useEffect(() => {
    let active = true;
    setState((currentState) => ({
      data: keepPreviousData ? currentState.data : null,
      loading: true,
      error: null
    }));

    loader()
      .then((data) => {
        if (!active) return;
        setState({ data, loading: false, error: null });
      })
      .catch((error: Error) => {
        if (!active) return;
        setState({ data: null, loading: false, error });
      });

    return () => {
      active = false;
    };
  }, [keepPreviousData, ...deps]);

  return state;
}
