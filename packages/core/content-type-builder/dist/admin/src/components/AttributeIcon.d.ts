/// <reference types="react" />
import { CustomFieldUID } from '@strapi/helper-plugin';
declare const iconByTypes: {
    biginteger: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    blocks: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    boolean: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    collectionType: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    component: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    contentType: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    date: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    datetime: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    decimal: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    dynamiczone: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    email: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    enum: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    enumeration: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    file: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    files: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    float: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    integer: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    json: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    JSON: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    media: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    number: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    password: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    relation: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    richtext: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    singleType: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    string: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    text: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    time: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    timestamp: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
    uid: (props: import("react").SVGProps<SVGSVGElement>) => import("react/jsx-runtime").JSX.Element;
};
export type IconByType = keyof typeof iconByTypes;
type AttributeIconProps = {
    type: IconByType;
    customField?: CustomFieldUID | null;
};
export declare const AttributeIcon: ({ type, customField, ...rest }: AttributeIconProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
