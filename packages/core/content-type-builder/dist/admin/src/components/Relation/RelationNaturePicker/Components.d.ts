/// <reference types="react" />
declare const Wrapper: import("styled-components").StyledComponent<"div", any, import("@strapi/design-system").BoxProps<"div">, never>;
declare const IconWrapper: import("styled-components").StyledComponent<"div", any, Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & Pick<import("styled-components").CSSProperties, "pointerEvents" | "display" | "position" | "zIndex" | "overflow" | "cursor" | "transition" | "transform" | "animation" | "textAlign" | "textTransform"> & {
    _hover?: ((theme: import("styled-components").DefaultTheme) => string) | undefined;
    background?: import("@strapi/design-system/types.js").DefaultThemeOrCSSProp<"colors", "background">;
    basis?: import("csstype").Property.FlexBasis<string | number> | undefined;
    borderColor?: string | number | symbol | undefined;
    color?: string | number | symbol | undefined;
    flex?: import("csstype").Property.Flex<string | number> | undefined;
    fontSize?: import("@strapi/design-system/types.js").DefaultThemeOrCSSProp<"fontSizes", "fontSize">;
    grow?: import("csstype").Property.FlexGrow | undefined;
    hasRadius?: boolean | undefined;
    hiddenS?: boolean | undefined;
    hiddenXS?: boolean | undefined;
    padding?: import("@strapi/design-system/helpers/handleResponsiveValues.js").ResponsiveValue<"padding">;
    paddingBottom?: import("@strapi/design-system/helpers/handleResponsiveValues.js").ResponsiveValue<"paddingBottom">;
    paddingLeft?: import("@strapi/design-system/helpers/handleResponsiveValues.js").ResponsiveValue<"paddingLeft">;
    paddingRight?: import("@strapi/design-system/helpers/handleResponsiveValues.js").ResponsiveValue<"paddingRight">;
    paddingTop?: import("@strapi/design-system/helpers/handleResponsiveValues.js").ResponsiveValue<"paddingTop">;
    marginLeft?: import("@strapi/design-system/helpers/handleResponsiveValues.js").ResponsiveValue<"marginLeft">;
    marginBottom?: import("@strapi/design-system/helpers/handleResponsiveValues.js").ResponsiveValue<"marginBottom">;
    marginRight?: import("@strapi/design-system/helpers/handleResponsiveValues.js").ResponsiveValue<"marginRight">;
    marginTop?: import("@strapi/design-system/helpers/handleResponsiveValues.js").ResponsiveValue<"marginTop">;
    shadow?: string | number | symbol | undefined;
    shrink?: import("csstype").Property.FlexShrink | undefined;
    lineHeight?: import("@strapi/design-system/types.js").DefaultThemeOrCSSProp<"lineHeights", "lineHeight">;
    width?: import("@strapi/design-system/types.js").DefaultThemeOrCSSProp<"spaces", "width">;
    minWidth?: import("@strapi/design-system/types.js").DefaultThemeOrCSSProp<"spaces", "minWidth">;
    maxWidth?: import("@strapi/design-system/types.js").DefaultThemeOrCSSProp<"spaces", "maxWidth">;
    height?: import("@strapi/design-system/types.js").DefaultThemeOrCSSProp<"spaces", "height">;
    minHeight?: import("@strapi/design-system/types.js").DefaultThemeOrCSSProp<"spaces", "minHeight">;
    maxHeight?: import("@strapi/design-system/types.js").DefaultThemeOrCSSProp<"spaces", "maxHeight">;
    top?: import("@strapi/design-system/types.js").DefaultThemeOrCSSProp<"spaces", "top">;
    left?: import("@strapi/design-system/types.js").DefaultThemeOrCSSProp<"spaces", "left">;
    bottom?: import("@strapi/design-system/types.js").DefaultThemeOrCSSProp<"spaces", "bottom">;
    right?: import("@strapi/design-system/types.js").DefaultThemeOrCSSProp<"spaces", "right">;
    borderRadius?: import("csstype").Property.BorderRadius<string | number> | undefined;
    borderStyle?: import("csstype").Property.BorderStyle | undefined;
    borderWidth?: import("csstype").Property.BorderWidth<string | number> | undefined;
    children?: import("react").ReactNode;
    as?: string | import("react").ComponentType<any> | undefined;
    forwardedAs?: string | import("react").ComponentType<any> | undefined;
} & {
    isSelected: boolean;
}, never>;
declare const InfosWrapper: import("styled-components").StyledComponent<"div", any, import("@strapi/design-system").FlexProps<"div">, never>;
export { IconWrapper, InfosWrapper, Wrapper };
