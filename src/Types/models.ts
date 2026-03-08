export type TypeHttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS';
export type TypeBodyType =
  | 'none'
  | 'JSON'
  | 'Form Data'
  | 'x-www-form-urlencoded'
  | 'XML'
  | 'Raw'
  | 'Binary';
export type TypeAuthType =
  | 'No Auth'
  | 'Bearer'
  | 'Basic Auth'
  | 'API Key'
  | 'OAuth 2.0';

export interface IKeyValuePair {
  id: string; // for React keys
  key: string;
  value: string;
  description: string;
  enabled: boolean;
}

export interface IRequestBody {
  type: TypeBodyType;
  content: string; // Used for JSON, Raw, XML, etc.
  formData?: IKeyValuePair[];
  urlencoded?: IKeyValuePair[];
  // binary deferred for now
}

export interface IAuthConfig {
  type: TypeAuthType;
  token?: string;
  username?: string;
  password?: string;
  apiKey?: string;
  apiValue?: string;
  apiKeyLocation?: 'header' | 'query';
}

export interface IApiRequest {
  id: string;
  collection_id: string;
  folder_id: string | null;
  name: string;
  method: TypeHttpMethod;
  url: string;
  params: IKeyValuePair[];
  headers: IKeyValuePair[];
  body: IRequestBody;
  auth: IAuthConfig;
  pre_script?: string;
  post_script?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ICollection {
  id: string;
  name: string;
  description?: string;
  sort_order: number;
  isOpen: boolean; // UI state extension, though DB plan doesn't mention it explicitly, we need it for sidebar
  created_at: string;
  updated_at: string;
}

export interface IFolder {
  id: string;
  collection_id: string;
  parent_id: string | null;
  name: string;
  sort_order: number;
  isOpen: boolean; // UI state extension
  created_at: string;
  updated_at: string;
}

export interface IEnvironment {
  id: string;
  name: string;
  variables: IKeyValuePair[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IHistoryEntry {
  id?: number;
  request_id: string;
  method: TypeHttpMethod;
  url: string;
  status_code: number;
  response_time: number;
  response_size: number;
  request_snapshot: Partial<IApiRequest>;
  response_body?: string;
  response_headers?: Record<string, string>;
  timestamp: string;
}

export interface ISetting {
  key: string;
  value: unknown;
}

export interface IApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number; // in ms
  size: number; // in bytes
}
