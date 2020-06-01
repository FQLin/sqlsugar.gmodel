export type DynamicType = {
    [Key in string | number]: string | number | DynamicType | null | undefined;
};