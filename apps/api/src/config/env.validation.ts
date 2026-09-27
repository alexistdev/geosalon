import { plainToInstance, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  Matches,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT = 3000;

  @Matches(/^postgres(ql)?:\/\//, {
    message: 'DATABASE_URL harus berupa connection string PostgreSQL',
  })
  DATABASE_URL!: string;
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated);
  if (errors.length > 0) {
    const messages = errors.map((error) => error.toString()).join('\n');
    throw new Error(`Konfigurasi environment tidak valid:\n${messages}`);
  }

  return validated;
}
