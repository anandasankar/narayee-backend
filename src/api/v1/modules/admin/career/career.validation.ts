import { CourseLevel } from '@prisma/client';
import { z } from 'zod';
import { limitValidation, pageNoValidation, parseJson } from '../../../../../utils/common.validation';
const durationValues = [
  '2 Months',
  '3 Months',
  '4 Months',
  '6 Months',
  '9 Months',
  '12 Months',
] as const;

const courseLevelEnum = z.nativeEnum(CourseLevel);

export const createCareerSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title must be less than 100 characters'),

      shortDescription: z
        .string()
        .min(20, 'Short description must be at least 20 characters')
        .max(200, 'Short description must be less than 200 characters'),

      description: z
        .string()
        .min(100, 'Description must be at least 100 characters')
        .max(5000, 'Description must be less than 5000 characters'),

      duration: z.enum(durationValues, {
        message: 'Invalid course duration',
      }),

      level: z
        .array(courseLevelEnum, { message: 'Invalid course level' })
        .min(1, 'At least one level is required'),
    })
    .strict(),
});

export const updateCareerSchema = z.object({
  params: z.object({
    id: z.string().cuid({ message: 'Invalid career id format' }),
  }),

  body: z
    .object({
      title: z.string().min(5).max(100).optional(),
      shortDescription: z.string().min(20).max(200).optional(),
      description: z.string().min(100).max(5000).optional(),
      duration: z.enum(durationValues).optional(),
      level: z.array(courseLevelEnum).min(1).optional(),
    })
    .strict(),
});

export const getCareerByIdSchema = z.object({
  params: z.object({
    id: z.string().cuid({ message: 'Invalid career id format' }),
  }),
});

export const careerFilterSchema = z
  .object({
    title: z.string().optional(),
    duration: z.string().optional(),
    level: courseLevelEnum.optional(),
  })
  .strict();

export const getAllCareerSchema = z.object({
  query: z
    .object({
      filter: z
        .string()
        .optional()
        .transform((value) => parseJson(value))
        .pipe(careerFilterSchema)
        .optional(),

      pageNo: pageNoValidation,
      limit: limitValidation,
    })
    .strict(),
});

export const deleteCareerSchema = z.object({
  params: z.object({
    id: z.string().cuid({ message: 'Invalid career id format' }),
  }),
});
