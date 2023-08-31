import { PartialType } from '@nestjs/swagger';
import { CreateRestrictionDto } from './create-restriction.dto';

export class UpdateRestrictionDto extends PartialType(CreateRestrictionDto) {}
