import axiosClient from './axiosClient';
import { LoginRequestDto, LoginResponseDto, RegisterRequestDto, ChangePasswordDto, ForgotPasswordRequestDto, VerifyOtpRequestDto, ResetPasswordRequestDto } from '../types/api';

export const authApi = {
  login: async (data: LoginRequestDto) => {
    const response = await axiosClient.post<LoginResponseDto>('/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequestDto) => {
    const response = await axiosClient.post<LoginResponseDto>('/api/auth/register', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordDto) => {
    const response = await axiosClient.post('/api/auth/change-password', data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequestDto) => {
    const response = await axiosClient.post('/api/auth/forgot-password', data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpRequestDto) => {
    const response = await axiosClient.post('/api/auth/verify-otp', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequestDto) => {
    const response = await axiosClient.post('/api/auth/reset-password', data);
    return response.data;
  },

  externalLogin: async (data: { provider: string; idToken: string }) => {
    const response = await axiosClient.post<LoginResponseDto>('/api/auth/external-login', data);
    return response.data;
  }
};
