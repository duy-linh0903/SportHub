// Auth
export interface LoginRequestDto {
  email?: string;
  password?: string;
}

export interface RegisterRequestDto {
  name?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  verifyPassword?: string;
}

export interface LoginResponseDto {
  accessToken: string;
}

export interface ChangePasswordDto {
  oldPassword?: string;
  newPassword?: string;
  verifyPassword?: string;
}

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface VerifyOtpRequestDto {
  email: string;
  otp: string;
}

export interface ResetPasswordRequestDto {
  email: string;
  otp: string;
  newPassword: string;
  verifyPassword: string;
}

// Users
export interface UserResponseDto {
  name: string;
  phoneNumber: string;
  email: string;
  avatarUrl: string | null;
}

export interface UpdateProfileDto {
  name?: string;
  phoneNumber?: string;
  email?: string;
  avatarUrl?: string;
}

// SportCenters
export interface SportCenterImages {
  id?: string;
  url?: string;
  // TODO: Verify properties from backend
}

export interface SportCenterResponseDto {
  sportCenterId: string;
  name: string;
  address: string;
  description?: string | null;
  createdAt: string;
  images: SportCenterImages[];
  minPrice: number;
}

export interface CreateSportCenterDto {
  name: string;
  address: string;
  description?: string | null;
  images: SportCenterImages[];
}

export interface UpdateSportCenterDto {
  name?: string;
  address?: string;
  description?: string | null;
  images?: SportCenterImages[];
}

// Fields
export interface FieldResponseDto {
  fieldId: string;
  name: string;
  type: string;
  pricePerSlot: number;
}

export interface CreateFieldDto {
  sportCenterId: string;
  name: string;
  type: string;
  pricePerSlot: number;
}

export interface UpdateFieldDto {
  sportCenterId: string;
  name?: string;
  type?: string;
  pricePerSlot?: number;
}

// Services
export interface ServiceResponseDto {
  serviceId: string;
  name: string;
  price: number;
  type: string;
  description?: string | null;
  sportCenterId?: string | null;
}

export interface CreateServiceDto {
  name: string;
  price: number;
  type: string;
  description?: string | null;
  sportCenterId?: string | null;
}

export interface UpdateServiceDto {
  name?: string;
  price?: number;
  type?: string;
  description?: string | null;
  sportCenterId?: string | null;
}

// Reviews
export interface ReviewResponseDto {
  rating: number;
  comment: string;
  userId: string;
  userName?: string;
  sportCenterId: string;
  sportCenterName?: string;
  createdAt: string;
}

export interface CreateReviewDto {
  userId: string;
  sportCenterId: string;
  bookingId: string;
  rating: number;
  comment?: string | null;
}

// Bookings
export enum BookingStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface BookingResponseDto {
  bookingId: string;
  userId: string;
  fieldId: string;
  bookingDate: string;
  status: BookingStatus | string;
  totalPrice: number;
  checkInCode?: string | null;
  createdAt: string;
  fieldName?: string;
  fieldType?: string;
  sportCenterId?: string;
  sportCenterName?: string;
  sportCenterAddress?: string;
  timeSlots?: string;
}

export interface BookingServiceRequestDto {
  serviceId: string;
  quantity: number;
}

export interface CreateBookingDto {
  fieldId: string;
  userId: string;
  bookingDate: string; // ISO date format for date only
  slotIds: string[];
  serviceList?: BookingServiceRequestDto[];
}

export interface UpdateBookingStatusDto {
  status: BookingStatus | string;
}

// Upload
export interface UploadResponse {
  url: string;
}
