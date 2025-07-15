import theme from "@/app/theme";

export const getBrandColor = (shade: number) => {
  return theme.colors!.brand?.[shade] ?? theme.colors!.brand![5];
};
