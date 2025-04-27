import { ComponentType } from "react";

export type RequestViewType = {
  title: string;
  icon: React.ReactNode;
  component: ComponentType<any>;
  background: string;
  description: string;
};
