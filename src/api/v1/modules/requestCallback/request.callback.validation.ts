import { CallbackStatus, EnquiryType } from '@prisma/client';
import { z } from 'zod';
import { limitValidation, pageNoValidation, parseJson } from '../../../../utils/common.validation';

const enquiryTypeEnum = z.nativeEnum(EnquiryType);
const callbackStatusEnum = z.nativeEnum(CallbackStatus);

export const createCallbackRequestSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters'),

      mobileNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid mobile number format'),

      preferredAt: z
        .string({ message: 'Preferred date and time is required' })
        .datetime({ message: 'Invalid date-time format. Use ISO 8601 format.' })
        .transform((val) => new Date(val))
        .refine((date) => date > new Date(), {
          message: 'Preferred time must be in the future',
        }),

      enquiryType: enquiryTypeEnum,

      notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
    })
    .strict(),
});

// Admin-only: only status can be changed
export const updateCallbackRequestSchema = z.object({
  params: z.object({
    id: z.string().cuid({ message: 'Invalid callback request id format' }),
  }),

  body: z
    .object({
      status: callbackStatusEnum,
    })
    .strict(),
});

export const getCallbackRequestByIdSchema = z.object({
  params: z.object({
    id: z.string().cuid({ message: 'Invalid callback request id format' }),
  }),
});

export const callbackRequestFilterSchema = z
  .object({
    name: z.string().optional(),
    mobileNumber: z.string().optional(),
    enquiryType: enquiryTypeEnum.optional(),
    status: callbackStatusEnum.optional(),
    preferredAt: z
      .string()
      .datetime()
      .transform((val) => new Date(val))
      .optional(),
  })
  .strict();

export const getAllCallbackRequestsSchema = z.object({
  query: z
    .object({
      filter: z
        .string()
        .optional()
        .transform((value) => parseJson(value))
        .pipe(callbackRequestFilterSchema)
        .optional(),

      pageNo: pageNoValidation,
      limit: limitValidation,
    })
    .strict(),
});

export const deleteCallbackRequestSchema = z.object({
  params: z.object({
    id: z.string().cuid({ message: 'Invalid callback request id format' }),
  }),
});
