declare module "react-dir-router" {
  import { FC } from "react";

  interface RouterProps {
    routes: Record<string, JSX.Element>;
  }

  export const Router: FC<RouterProps>;

  export function generateRoutes(): Promise<void>;
}
