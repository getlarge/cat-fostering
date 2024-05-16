import type { ValidationError } from '@nestjs/common';

import type { OryWebhookErrorMessages } from './models/ory-webhook.error';

export function validationErrorsToOryErrorMessages(
  errors: ValidationError[]
): OryWebhookErrorMessages[] {
  const exception = errors.filter((e) => e.property === 'identity')[0];
  const messages = exception?.children
    ?.filter((grandChild) => grandChild.property === 'traits')
    ?.flatMap((child) => {
      return (
        child.children?.filter(Boolean)?.map((traitError) => ({
          instance_ptr: `#/traits/${traitError.property}`,
          messages: [
            {
              id: Math.floor(Math.random() * 10000),
              text:
                Object.values(traitError.constraints || {}).join(', ') ||
                'validation failed',
              type: 'validation',
              context: {
                value: traitError.value,
              },
            },
          ],
        })) || []
      );
    });
  if (messages) {
    return messages;
  }
  return [
    {
      messages: [
        {
          id: 1234,
          text: 'Failed to validate input',
          type: 'validation',
          context: {
            value: errors.toString(),
          },
        },
      ],
    },
  ];
}
