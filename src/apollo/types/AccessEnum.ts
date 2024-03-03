import { registerEnumType } from '@nestjs/graphql';

export enum EventAccess {
  Creator = 'Creator',
  Approver = 'Approver',
  Attendee = 'Attendee',
}

registerEnumType(EventAccess, {
  name: 'EventAccess',
});
