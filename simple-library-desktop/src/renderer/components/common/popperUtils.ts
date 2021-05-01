export const sameWidthModifier: any = {
    name: "sameWidth",
    enabled: true,
    phase: "beforeWrite",
    requires: ["computeStyles"],
    fn: ({ state }: any) => {
        state.styles.popper.width = `${state.rects.reference.width}px`;
    },
    effect: ({ state }: any) => {
        state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`;
    },
};