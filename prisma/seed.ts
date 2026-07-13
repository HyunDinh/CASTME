import {
  Role,
  SubscriptionPlan,
  TransactionStatus,
  JobStatus,
} from "@prisma/client";
import { fakerVI as faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
// @ts-ignore
import { prisma } from "../src/lib/prisma.js";

const HASHED_PASSWORD_123 = bcrypt.hashSync("123", 10);

// Link ảnh thực tế từ Unsplash để làm dữ liệu mẫu phong phú
const CREATOR_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1488161628813-04466f872442?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop"
];

const COVER_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1200&auto=format&fit=crop"
];

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1485230895905-ef05f6393b8e?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=500&auto=format&fit=crop"
];

const STYLES_POOL = ["Streetwear", "Minimalism", "Vintage", "Tech", "Lifestyle", "Beauty", "Skincare", "Food", "Travel", "Photography", "Fitness", "Gaming", "Fashion", "Vlog"];
const LOCATIONS_POOL = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Nha Trang"];

const REVIEWS_POOL = [
  "Làm việc rất chuyên nghiệp, trả video đúng hạn. Đáng tiền!",
  "Hình ảnh siêu nét, edit màu vintage rất hợp với vibe shop mình. Sẽ book lại đợt sau.",
  "Bạn này quay video kịch bản hơi khô nhưng bù lại tương tác tốt.",
  "Tương tác thực sự rất tốt, sau khi video lên shop mình tăng 30% doanh thu.",
  "Rất hài lòng về thái độ làm việc, nhiệt tình hỗ trợ đổi lại thoại 2 lần.",
  "Video đẹp, lên xu hướng nhanh. Bạn KOL rất biết cách làm nổi bật sản phẩm.",
  "Giá cả hợp lý, làm việc nhanh gọn.",
  "Kịch bản siêu sáng tạo, không bị lố. Người xem feedback rất tốt về KOL.",
  "Quay bằng điện thoại nhưng góc máy rất nghệ, rất thích!",
  "Bạn này làm review đồ ăn rất có tâm, nhìn đã thấy thèm rồi."
];

async function main() {
  console.log("🔄 1. Đang dọn dẹp dữ liệu cũ trên database...");
  await prisma.review.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.shopProfile.deleteMany();
  await prisma.creatorProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log("👥 2. Đang tạo tài khoản admin mặc định...");
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@castme.vn",
      password: bcrypt.hashSync("Admin@123", 10),
      role: Role.ADMIN,
      balance: 0,
      hearts: 0,
      connects: 0,
    },
  });

  console.log("👥 3. Đang tạo các Shop ngẫu nhiên...");
  const createdShops = [];
  
  // Tạo Yame Studio (Shop chính cố định)
  const shopMain = await prisma.user.create({
    data: {
      name: "Yame Studio Official",
      email: "shop_01@gmail.com",
      password: HASHED_PASSWORD_123,
      role: Role.SHOP,
      plan: SubscriptionPlan.ULTRA,
      hearts: 500,
      connects: 150,
      shopProfile: {
        create: {
          shopName: "Yame Studio",
          description: "Thương hiệu thời trang tối giản dành cho giới trẻ, luôn dẫn đầu xu hướng thị trường.",
          categories: ["Thời trang", "Phụ kiện"],
          vibeText: "Minimalism, trẻ trung, năng động, thanh lịch.",
          website: "https://yame.vn",
          instagram: "@yame_studio",
          phone: "0905123456",
          address: "123 Lê Duẩn, Đà Nẵng",
          averageRating: 4.8,
          totalJobs: 15,
        },
      },
    },
  });
  createdShops.push(shopMain);

  // Tạo thêm 10 Shop ngẫu nhiên
  for (let i = 0; i < 10; i++) {
    const shop = await prisma.user.create({
      data: {
        name: faker.company.name(),
        email: faker.internet.email(),
        password: HASHED_PASSWORD_123,
        role: Role.SHOP,
        plan: faker.helpers.arrayElement([SubscriptionPlan.FREE, SubscriptionPlan.PRO]),
        shopProfile: {
          create: {
            shopName: faker.company.name(),
            description: faker.lorem.paragraph(3),
            categories: faker.helpers.arrayElements(["Mỹ phẩm", "Nước hoa", "Trang sức", "Thời trang", "Đồ công nghệ", "Ăn uống"], 2),
            phone: faker.phone.number(),
            address: faker.location.streetAddress() + ", " + faker.helpers.arrayElement(LOCATIONS_POOL),
          },
        },
      },
    });
    createdShops.push(shop);
  }

  console.log("👥 3. Đang tạo các Creator ngẫu nhiên...");
  const createdCreators = [];

  // Tạo Khánh Linh (Creator chính cố định)
  const creatorMain = await prisma.user.create({
    data: {
      name: "Lê Khánh Linh (KOL)",
      email: "kol_01@gmail.com",
      password: HASHED_PASSWORD_123,
      role: Role.CREATOR,
      plan: SubscriptionPlan.PRO,
      hearts: 120,
      connects: 50,
      creatorProfile: {
        create: {
          bio: "Fashionista & Content Creator đam mê phối đồ phong cách Streetwear và Minimalist. Hợp tác với hơn 50 nhãn hàng nội địa. Cam kết video đạt chuẩn 4K, kịch bản độc đáo, kéo traffic cực mạnh.",
          styles: ["Streetwear", "Minimalism", "Vintage", "Fashion"],
          portfolioUrl: "https://behance.net/khanhlinh_fashion",
          mainImage: CREATOR_AVATARS[0],
          coverImage: COVER_IMAGES[0],
          gallery: faker.helpers.arrayElements(GALLERY_IMAGES, 4),
          location: "Hồ Chí Minh",
          priceRange: "5.000.000đ - 10.000.000đ / Video",
          followersCount: "1.2M",
          socialLinks: [
            { platform: "TikTok", link: "https://tiktok.com/@linh_streetwear", followers: "1.2M", icon: "🎵" },
            { platform: "Instagram", link: "https://instagram.com/linh_ootd", followers: "500K", icon: "📸" },
            { platform: "YouTube", link: "https://youtube.com/@linh", followers: "100K", icon: "▶️" }
          ]
        },
      },
    },
  });
  createdCreators.push(creatorMain);

  // Tạo thêm 20 Creator ngẫu nhiên (để test Search trang trí)
  for (let i = 0; i < 20; i++) {
    const randomStyles = faker.helpers.arrayElements(STYLES_POOL, faker.number.int({ min: 1, max: 4 }));
    const randomFollowers = faker.number.int({ min: 10, max: 5000 }) + "K";
    
    const creator = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: HASHED_PASSWORD_123,
        role: Role.CREATOR,
        plan: faker.helpers.arrayElement([SubscriptionPlan.FREE, SubscriptionPlan.PRO]),
        creatorProfile: {
          create: {
            bio: faker.lorem.paragraphs(2),
            styles: randomStyles,
            mainImage: faker.helpers.arrayElement(CREATOR_AVATARS),
            coverImage: faker.helpers.arrayElement(COVER_IMAGES),
            gallery: faker.helpers.arrayElements(GALLERY_IMAGES, faker.number.int({ min: 2, max: 6 })),
            location: faker.helpers.arrayElement(LOCATIONS_POOL),
            priceRange: `${faker.number.int({min: 1, max: 5})}.000.000đ - ${faker.number.int({min: 6, max: 20})}.000.000đ`,
            followersCount: randomFollowers,
            socialLinks: [
              { platform: "TikTok", link: "#", followers: randomFollowers, icon: "🎵" },
              { platform: "Instagram", link: "#", followers: faker.number.int({ min: 10, max: 900 }) + "K", icon: "📸" }
            ]
          },
        },
      },
    });
    createdCreators.push(creator);
  }

  console.log("💼 4. Đang tạo các bài đăng Tuyển dụng (Job) và Review...");
  
  // Mỗi Shop sẽ tạo 2-3 Jobs
  const createdJobs = [];
  for (const shop of createdShops) {
    const numJobs = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < numJobs; i++) {
      const isCompleted = faker.datatype.boolean();
      const job = await prisma.job.create({
        data: {
          shopId: shop.id,
          title: `Tuyển KOC/KOL review ${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
          description: faker.lorem.paragraphs(2),
          budget: `${faker.number.int({min: 2, max: 10})}.000.000đ`,
          status: isCompleted ? JobStatus.COMPLETED : JobStatus.RECRUITING,
          vibeTags: faker.helpers.arrayElements(STYLES_POOL, 2),
        },
      });
      createdJobs.push(job);

      // Nếu Job đã hoàn thành, chọn 1 Creator ngẫu nhiên để đánh giá
      if (isCompleted) {
        const creator = faker.helpers.arrayElement(createdCreators);
        
        // Thêm Application & Milestone giả
        await prisma.application.create({
          data: {
            jobId: job.id,
            creatorId: creator.id,
            matchRate: faker.number.int({ min: 70, max: 99 }),
            status: "ACCEPTED",
          }
        });

        // Đánh giá từ Shop cho Creator
        await prisma.review.create({
          data: {
            shopId: shop.id,
            creatorId: creator.id,
            jobId: job.id,
            rating: faker.number.int({ min: 3, max: 5 }), // Rating ngẫu nhiên từ 3-5
            content: faker.helpers.arrayElement(REVIEWS_POOL) + " " + faker.lorem.sentence(),
          },
        });
      }
    }
  }

  // Tăng ngẫu nhiên review cho tất cả các Creator (để test card rating)
  for (const creator of createdCreators) {
    const numReviews = faker.number.int({ min: 1, max: 8 });
    for (let i = 0; i < numReviews; i++) {
      await prisma.review.create({
        data: {
          shopId: faker.helpers.arrayElement(createdShops).id,
          creatorId: creator.id,
          rating: faker.number.int({ min: 3, max: 5 }),
          content: faker.helpers.arrayElement(REVIEWS_POOL),
        },
      });
    }
  }

  console.log("✨ THÀNH CÔNG! Hàng chục Record đã được ghi vào Database.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
