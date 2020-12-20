declare module 'balajs' {
  interface Bala {
    (
      element?: string | HTMLElement | HTMLElement[] | Node | Node[] | null, context?: string | HTMLElement
    ): HTMLElement[];
    one: (
      element?: string | HTMLElement | HTMLElement[] | Node | Node[] | null, context?: string | HTMLElement
    ) => HTMLElement | undefined;
    // TODO how to define methods?
    fn: { [key: string]: (...args: any[]) => any }
  }

  const $: Bala;

  export default $;
}
