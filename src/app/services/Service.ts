import { env } from '@/app/config/env';
import axios, { create, InternalAxiosRequestConfig, isAxiosError } from 'axios';
import base64 from 'react-native-base64';

export abstract class Service {
  private static interceptorId: number | undefined;

  private static refreshing: Promise<string> | undefined;

  private static readonly MAX_AUTH_RETRIES = 2;

  protected static client = create({
    baseURL: env.EXPO_PUBLIC_API_URL,
  });

  static setAuthorizationToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  static removeAuthorizationToken() {
    this.client.defaults.headers.common['Authorization'] = undefined;
  }

  static removeInterceptorId() {
    if (this.interceptorId === undefined) {
      return;
    }

    this.client.interceptors.response.eject(this.interceptorId);
    this.interceptorId = undefined;
  }

  static setupRefreshInterceptor(onRefresh: (failedAccessToken: string | undefined) => Promise<string>) {
    this.removeInterceptorId();

    this.interceptorId = this.client.interceptors.response.use(
      response => response,
      async (error) => {
        if (!isAxiosError(error)) {
          return Promise.reject(error);
        }

        const originalRequest = error.config as Service.RetriableRequestConfig | undefined;
        const is401 = error.response?.status === 401;
        const isRefreshTokenEndpoint = originalRequest?.url?.includes('auth/refresh-token');
        const authRetries = originalRequest?._authRetries ?? 0;

        if (!is401 || isRefreshTokenEndpoint || !originalRequest || authRetries >= this.MAX_AUTH_RETRIES) {
          return Promise.reject(error);
        }

        originalRequest._authRetries = authRetries + 1;

        const authorization = originalRequest.headers.Authorization;
        const failedAccessToken = typeof authorization === 'string'
          ? authorization.replace(/^Bearer /, '')
          : undefined;

        this.refreshing ??= onRefresh(failedAccessToken).finally(() => {
          this.refreshing = undefined;
        });

        const accessToken = await this.refreshing;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return this.client(originalRequest);
      },
    );
  }

  static async uploadPresignedPOST({
    uploadSignature,
    file,
  }: Service.UploadPresignedPOSTParams) {
    const decodedSignature = base64.decode(uploadSignature);

    const { url, fields } = JSON.parse(decodedSignature) as Service.DecodedSignature;

    const formData = new FormData();

    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('file', file as File);

    await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

namespace Service {

  export type RetriableRequestConfig = InternalAxiosRequestConfig & {
    _authRetries?: number;
  }

  export type UploadPresignedPOSTParams = {
    uploadSignature: string;
    file: {
      name: string;
      uri: string;
      type: string;
    } | File;
  }

  export type DecodedSignature = {
    url: string;
    fields: Record<string, string>;
  }
}

