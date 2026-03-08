// Defines the shared interfaces and types for LocalMan

export type TypeHttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface IRequestItem {
  id: string;
  type: "request";
  method: TypeHttpMethod;
  name: string;
}

export interface ICollection {
  id: string;
  name: string;
  isOpen: boolean;
  items: IRequestItem[];
}

export interface IHistoryItem {
  id: string;
  method: TypeHttpMethod;
  name: string;
  time: string;
  status: number;
}
