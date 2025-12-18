import { CallbackClient, Client, createCallbackClient, createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { useMemo } from "preact/hooks";
import { type DescService } from '@bufbuild/protobuf'

const transport = () => {
  const API_URL = import.meta.env.VITE_QRY_API_URL || 'http://localhost:8080';
  return createConnectTransport({
    // TODO(FELIX): Move this to env.
    baseUrl: API_URL
  })
}


export function useClient<T extends DescService>(service: T): Client<T> {
  return useMemo(() => createClient(service, transport()), [service]);
}

export function useClientWithCallback<T extends DescService>(service: T): CallbackClient<T> {
  return useMemo(() => createCallbackClient(service, transport()), [service]);
}