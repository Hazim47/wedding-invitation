import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fail = (message, status = 400) => {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status },
  );
};

const clean = (value, max) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, max);
};

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return fail("بيانات غير صالحة");
  }

  console.log("📨 RSVP Request received:", body);

  // =====================================================
  // Honeypot
  // =====================================================

  if (clean(body?.website, 100)) {
    console.log("🤖 Honeypot triggered");

    return NextResponse.json({
      success: true,
    });
  }

  // =====================================================
  // قراءة البيانات
  // =====================================================

  const fullName = clean(body?.fullName, 80);
  const side = body?.side;
  const attendance = body?.attendance;
  const message = clean(body?.message, 600);

  const guests = Number.isInteger(body?.guests)
    ? body.guests
    : Number(body?.guests) || 0;

  console.log("✅ Form data:", {
    fullName,
    side,
    attendance,
    guests,
    message,
  });

  // =====================================================
  // Validation
  // =====================================================

  if (fullName.length < 2) {
    return fail("يرجى كتابة الاسم الكامل");
  }

  if (!["groom", "bride"].includes(side)) {
    return fail("يرجى اختيار الطرف");
  }

  if (!["yes", "no"].includes(attendance)) {
    return fail("يرجى تأكيد الحضور أو الاعتذار");
  }

  if (guests < 0 || guests > 20) {
    return fail("عدد الحضور غير صالح");
  }

  // =====================================================
  // تجهيز البيانات
  // =====================================================

  const entry = {
    fullName,
    side,
    attendance,
    guests: attendance === "yes" ? Math.max(1, guests) : 0,
    message,
    createdAt: new Date().toISOString(),
  };

  let saved = false;

  // =====================================================
  // 1. إرسال الإيميل
  // =====================================================

  try {
    if (
      process.env.RESEND_API_KEY &&
      process.env.RESEND_FROM_EMAIL &&
      process.env.RESEND_TO_EMAIL
    ) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const attendanceText = attendance === "yes" ? "✅ سيحضر" : "❌ لن يحضر";

      const sideText = side === "groom" ? "أهل العريس" : "أهل العروس";

      const emailResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL,
        to: process.env.RESEND_TO_EMAIL,
        subject: `💍 RSVP جديد من ${fullName}`,

        html: `
          <div dir="rtl" style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            background: #fffdf8;
            color: #333;
          ">

            <h2 style="
              color: #b8944c;
              text-align: center;
              margin-bottom: 30px;
            ">
              💍 تأكيد حضور جديد
            </h2>

            <div style="
              background: white;
              border: 1px solid #ead9ad;
              border-radius: 12px;
              padding: 24px;
            ">

              <p>
                <strong>الاسم:</strong>
                ${escapeHtml(fullName)}
              </p>

              <p>
                <strong>الطرف:</strong>
                ${sideText}
              </p>

              <p>
                <strong>الحضور:</strong>
                ${attendanceText}
              </p>

              <p>
                <strong>عدد الحضور:</strong>
                ${entry.guests}
              </p>

              ${
                message
                  ? `
                    <div style="
                      margin-top: 20px;
                      padding: 15px;
                      background: #fffaf0;
                      border-right: 4px solid #d6b066;
                      border-radius: 6px;
                    ">
                      <strong>رسالة المدعو:</strong>
                      <p style="margin-bottom: 0;">
                        ${escapeHtml(message)}
                      </p>
                    </div>
                  `
                  : ""
              }

              <p style="
                margin-top: 25px;
                color: #888;
                font-size: 13px;
              ">
                وقت الإرسال:
                ${new Date(entry.createdAt).toLocaleString("ar-JO")}
              </p>

            </div>

            <p style="
              text-align: center;
              color: #aaa;
              margin-top: 25px;
              font-size: 12px;
            ">
              Wedding RSVP
            </p>

          </div>
        `,
      });

      if (emailResult?.error) {
        console.error("❌ Resend error:", emailResult.error);
      } else {
        console.log("📧 RSVP email sent:", emailResult?.data?.id);
        saved = true;
      }
    } else {
      console.warn("⚠️ Resend environment variables are missing");
    }
  } catch (err) {
    console.error("❌ RSVP email error:", err);
  }

  // =====================================================
  // 2. Webhook
  // =====================================================

  const hook = process.env.RSVP_WEBHOOK_URL;

  if (hook) {
    try {
      const webhookResponse = await fetch(hook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });

      if (webhookResponse.ok) {
        saved = true;
      }

      console.log(
        "🪝 Webhook result:",
        webhookResponse.ok,
        webhookResponse.status,
      );
    } catch (err) {
      console.error("❌ RSVP webhook error:", err);
    }
  }

  // =====================================================
  // 3. حفظ محلي
  // =====================================================

  if (!saved) {
    try {
      const dir = path.join(process.cwd(), "data");

      await fs.mkdir(dir, {
        recursive: true,
      });

      await fs.appendFile(
        path.join(dir, "rsvps.jsonl"),
        JSON.stringify(entry) + "\n",
        "utf8",
      );

      saved = true;

      console.log("💾 RSVP saved to local file");
    } catch (err) {
      console.error("❌ RSVP file error:", err);
    }
  }

  // =====================================================
  // فشل الحفظ بالكامل
  // =====================================================

  if (!saved) {
    return fail("تعذّر إرسال الرد، يرجى المحاولة لاحقًا", 500);
  }

  // =====================================================
  // نجاح
  // =====================================================

  console.log("✅ RSVP saved successfully");

  return NextResponse.json({
    success: true,
    message: "تم تسجيل تأكيد الحضور بنجاح",
  });
}

// =====================================================
// حماية HTML من إدخال كود داخل الإيميل
// =====================================================

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
