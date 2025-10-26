// import { PrismaClient } from '@prisma/client';
// import { ProfileResponse, UserResponse } from './user.types';
// import { normEmail } from '../../utils/validators';
// import bcrypt from 'bcryptjs';
// import { Readable } from 'stream';
// import { env } from '../../config/env';

// const prisma = new PrismaClient();

// export async function getProfile(userId: string): Promise<ProfileResponse | null> {
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     select: {
//       id: true,
//       username: true,
//       email: true,
//       firstname: true,
//       lastname: true,
//       role:true,
//     },
//   });

//   if (!user) return null;

//   return { ...user, isFollowedByMe: false };
// }



// function extractObjectNameFromUrl(url: string): string {
//   const parts = url.split('/');
//   return parts.slice(-2).join('/'); // e.g., "avatars/userId-timestamp.jpg"
// }