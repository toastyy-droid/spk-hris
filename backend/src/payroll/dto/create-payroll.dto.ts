import { IsNumber, Min } from 'class-validator';

export class ProcessPayrollDto {
  @IsNumber()
  @Min(1)
  month: number;

  @IsNumber()
  @Min(2020)
  year: number;
}

export class MarkPaidDto {
  @IsNumber({}, { each: true })
  ids: number[];
}
