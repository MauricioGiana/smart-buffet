import { z } from "zod";

export const onboardingRequestSchema = z.object({
  businessName: z.string().min(1).max(255),
});

export type OnboardingRequest = z.infer<typeof onboardingRequestSchema>;
