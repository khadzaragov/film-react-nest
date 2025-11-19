export interface CreateOrderTicketDto {
  film: string;
  session: string;
  row: number;
  seat: number;
}

export interface CreateOrderDto {
  email: string;
  phone: string;
  tickets: CreateOrderTicketDto[];
}

export interface OrderConfirmationDto extends CreateOrderTicketDto {
  id: string;
  price: number;
  daytime: string;
}
