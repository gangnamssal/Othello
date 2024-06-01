export type Route = {
  path: string;
  component: new (
    container: HTMLElement,
    params?: Record<string, string>,
    query?: Record<string, string>,
  ) => void;
  guard?: () => boolean;
};
