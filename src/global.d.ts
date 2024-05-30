export type Route = {
	path: string;
	component: new (container: HTMLElement) => void;
};
