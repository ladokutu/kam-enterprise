import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Seed Admin User
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@kamenterprise.com" },
    update: {},
    create: {
      name: "Admin KAM Enterprise",
      email: "admin@kamenterprise.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  // Seed Hero
  const existingHero = await prisma.hero.findFirst();
  if (!existingHero) {
    await prisma.hero.create({
      data: {
        headline: "Solusi Digital Terpercaya untuk Bisnis Anda",
        subheadline:
          "KAM Enterprise hadir sebagai partner terpercaya dalam pengembangan aplikasi, konsultasi IT, serta setup server dan network untuk mendukung transformasi digital perusahaan Anda.",
        ctaText: "Konsultasi Gratis",
        ctaLink: "/contact",
        imageUrl: "",
      },
    });
  }

  // Seed Services
  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: [
        {
          title: "Pengembangan Aplikasi",
          description:
            "Kami mengembangkan aplikasi web dan mobile yang disesuaikan dengan kebutuhan bisnis Anda.",
          icon: "Code2",
          imageUrl: "",
          features: JSON.stringify([
            "Custom Web Application",
            "Mobile App (iOS & Android)",
            "API Development & Integration",
            "UI/UX Design",
            "Maintenance & Support",
          ]),
          order: 1,
        },
        {
          title: "Konsultasi IT",
          description:
            "Tim ahli kami siap membantu merancang strategi IT yang tepat untuk bisnis Anda.",
          icon: "Brain",
          imageUrl: "",
          features: JSON.stringify([
            "IT Strategy & Planning",
            "Digital Transformation",
            "System Audit & Assessment",
            "Technology Roadmap",
            "IT Governance",
          ]),
          order: 2,
        },
        {
          title: "Setup Server & Network",
          description:
            "Kami menyediakan layanan setup dan konfigurasi server serta jaringan yang handal.",
          icon: "Server",
          imageUrl: "",
          features: JSON.stringify([
            "Server Setup & Configuration",
            "Network Infrastructure",
            "Cloud Migration",
            "Security Setup",
            "Monitoring & Maintenance",
          ]),
          order: 3,
        },
      ],
    });
  }

  // Seed About
  const aboutCount = await prisma.about.count();
  if (aboutCount === 0) {
    await prisma.about.create({
      data: {
        companyName: "KAM Enterprise",
        vision:
          "Menjadi perusahaan teknologi terdepan yang memberikan solusi digital inovatif dan terpercaya untuk kemajuan bisnis di Indonesia.",
        mission:
          "1. Menghadirkan solusi teknologi yang tepat sasaran\n2. Memberikan layanan konsultasi IT yang berkualitas tinggi\n3. Membangun infrastruktur IT yang handal dan aman\n4. Mendukung transformasi digital UMKM dan korporasi",
        description:
          "KAM Enterprise adalah perusahaan IT yang berfokus pada penyediaan solusi digital komprehensif.",
        address: "Jl. Teknologi No. 123, Jakarta Selatan, Indonesia",
        phone: "+62 812-3456-7890",
        email: "info@kamenterprise.com",
      },
    });
  }

  // Seed Testimonials
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          clientName: "Budi Santoso",
          company: "PT Maju Bersama",
          message:
            "KAM Enterprise berhasil mengembangkan sistem ERP yang sangat membantu operasional perusahaan kami.",
          rating: 5,
        },
        {
          clientName: "Siti Rahayu",
          company: "CV Berkah Jaya",
          message:
            "Layanan konsultasi IT dari KAM Enterprise sangat membantu kami dalam merancang strategi digital.",
          rating: 5,
        },
        {
          clientName: "Ahmad Fauzi",
          company: "StartupTech ID",
          message:
            "Setup server dan infrastruktur cloud yang dilakukan KAM Enterprise sangat rapi dan reliable.",
          rating: 5,
        },
      ],
    });
  }

  // Seed Team Members
  const teamCount = await prisma.teamMember.count();
  if (teamCount === 0) {
    await prisma.teamMember.createMany({
      data: [
        {
          name: "Krisna A. Mahendra",
          role: "Founder & CEO",
          bio: "Berpengalaman lebih dari 10 tahun di bidang teknologi informasi.",
          imageUrl: "",
          order: 1,
        },
        {
          name: "Andi Prasetyo",
          role: "CTO",
          bio: "Expert dalam arsitektur sistem dan cloud infrastructure.",
          imageUrl: "",
          order: 2,
        },
        {
          name: "Maya Putri",
          role: "Head of Development",
          bio: "Full-stack developer dengan pengalaman di berbagai teknologi modern.",
          imageUrl: "",
          order: 3,
        },
        {
          name: "Dimas Kurniawan",
          role: "IT Consultant",
          bio: "Konsultan IT dengan keahlian dalam digital transformation.",
          imageUrl: "",
          order: 4,
        },
      ],
    });
  }

  // Seed Settings
  const settingsData = [
    { key: "company_name", value: "KAM Enterprise" },
    { key: "company_email", value: "info@kamenterprise.com" },
    { key: "company_phone", value: "+62 812-3456-7890" },
    { key: "company_address", value: "Jl. Teknologi No. 123, Jakarta Selatan" },
    { key: "logo_url", value: "" },
    { key: "footer_text", value: "© 2026 KAM Enterprise. All rights reserved." },
    { key: "whatsapp", value: "+6281234567890" },
    { key: "instagram", value: "https://instagram.com/kamenterprise" },
    { key: "linkedin", value: "https://linkedin.com/company/kamenterprise" },
  ];

  for (const setting of settingsData) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });