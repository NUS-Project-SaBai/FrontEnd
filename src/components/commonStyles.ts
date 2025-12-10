
export const gridStyle = (minWidth: number, more?: string) =>
    `m-2 grid flex-1 gap-2 border-t-2 pt-4 items-end [grid-template-columns:repeat(auto-fit,minmax(${minWidth}px,1fr))] ${more}`;