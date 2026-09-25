import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { v2 as cloudinary } from 'cloudinary';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const dynamic = "force-dynamic";

export async function GET() {
  cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });

    const updatedVideos = await Promise.all(videos.map(async (video) => {
      if (video.originalSize === video.compressedSize) {
        try {
          const result = await cloudinary.api.resource(video.publicId, { resource_type: "video" });
          if (result.derived && result.derived.length > 0) {
            // Find the derived asset that matches the eager transformation
            const eagerAsset = result.derived.find((a: Record<string, unknown>) => a.transformation === "f_mp4,q_auto" || a.transformation === "q_auto,f_mp4" || a.format === "mp4");
            if (eagerAsset && eagerAsset.bytes && eagerAsset.bytes !== Number(video.originalSize)) {
              const updated = await prisma.video.update({
                where: { id: video.id },
                data: { compressedSize: String(eagerAsset.bytes) }
              });
              return updated;
            }
          }
        } catch (error) {
          console.error("Failed to fetch cloudinary resource", error);
        }
      }
      return video;
    }));

    return NextResponse.json(updatedVideos, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
