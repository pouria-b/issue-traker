// import { z } from "zod";
// import { RegisterSchema } from "../../utils/validators";

// export const validateUsername = (username: string): string | null => {
//   try {
//     RegisterSchema.pick({ username: true }).parse({ username });
//     return null;
//   } catch (error) {
//     return error instanceof z.ZodError ? error.issues[0].message : "خطای اعتبارسنجی";
//   }
// };
