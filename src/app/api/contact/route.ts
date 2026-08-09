import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/auth";

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (Indonesian phone numbers)
const PHONE_REGEX = /^(\+62|62|0)[0-9]{8,12}$/;

// Send Telegram notification
async function sendTelegramNotification(contact: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.log("Telegram credentials not configured, skipping notification");
      return;
    }

    const text = `📬 *Pesan Baru dari Website KAM Enterprise*

👤 *Nama:* ${contact.name}
📧 *Email:* ${contact.email}
📱 *Telepon:* ${contact.phone || "Tidak diisi"}
💼 *Layanan:* ${contact.service || "Tidak dipilih"}

💬 *Pesan:*
${contact.message}

⏰ ${new Date().toLocaleString("id-ID")}`;

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!response.ok) {
      console.error("Failed to send Telegram notification:", await response.text());
    }
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, service, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nama, email, dan pesan wajib diisi." },
        { status: 400 }
      );
    }

    // Email validation
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid. Contoh: nama@domain.com" },
        { status: 400 }
      );
    }

    // Phone validation (only if provided)
    if (phone && !PHONE_REGEX.test(phone.replace(/\s+/g, ""))) {
      return NextResponse.json(
        { error: "Format nomor telepon tidak valid. Contoh: 081234567890 atau +6281234567890" },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || "",
        service: service || "",
        message,
      },
    });

    // Send Telegram notification (don't wait for it)
    sendTelegramNotification({
      name,
      email,
      phone: phone || "",
      service: service || "",
      message,
    }).catch((err) => console.error("Telegram notification error:", err));

    return NextResponse.json(
      { success: true, id: contact.id, message: "Pesan berhasil dikirim. Kami akan menghubungi Anda segera." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Silakan coba lagi." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return unauthorizedResponse();
    }

    const searchParams = req.nextUrl.searchParams;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Get contacts error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kontak." },
      { status: 500 }
    );
  }
}
