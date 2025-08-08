import type { NextApiRequest, NextApiResponse } from "next";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

type ComplaintRequestBody = {
  subject: string;
  description: string;
  category?: string;
  extra?: Record<string, unknown>;
};

type ComplaintResponse = {
  ok: boolean;
  key?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ComplaintResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  const bucketName = process.env.S3_BUG_REPORTS_BUCKET;
  const region = process.env.S3_BUG_REPORTS_REGION || process.env.AWS_REGION;
  const keyPrefix = process.env.S3_BUG_REPORTS_PREFIX || "complaints";
  const envLabel = process.env.NEXT_PUBLIC_CLIENT_ENV || "unknown";

  if (!bucketName) {
    return res
      .status(500)
      .json({ ok: false, error: "S3_BUG_REPORTS_BUCKET is not configured" });
  }
  if (!region) {
    return res
      .status(500)
      .json({ ok: false, error: "S3_BUG_REPORTS_REGION/AWS_REGION is not configured" });
  }

  const { subject, description, category, extra } = req.body as ComplaintRequestBody;

  if (!subject || !description) {
    return res
      .status(400)
      .json({ ok: false, error: "'subject' and 'description' are required" });
  }

  try {
    const s3Client = new S3Client({ region });

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-");
    const randomSuffix = Math.random().toString(36).slice(2);
    const objectKey = `${envLabel}/${keyPrefix}/${timestamp}-${randomSuffix}.json`;

    const reportPayload = {
      subject,
      description,
      category: category ?? null,
      extra: extra ?? null,
      environment: envLabel,
      createdAt: now.toISOString(),
      userAgent: req.headers["user-agent"] || null,
      referer: req.headers["referer"] || null,
      ip: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || null,
    };

    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: JSON.stringify(reportPayload, null, 2),
      ContentType: "application/json",
    });

    await s3Client.send(putCommand);

    return res.status(200).json({ ok: true, key: objectKey });
  } catch (error: any) {
    return res.status(500).json({ ok: false, error: String(error?.message || error) });
  }
}


