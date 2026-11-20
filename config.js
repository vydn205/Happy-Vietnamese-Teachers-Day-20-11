/* ------------------------------------------------------------------
   CẤU HÌNH — chỉ cần sửa file này để đổi tên, lời chúc, chữ ký, form.
   ------------------------------------------------------------------ */
window.CARD_CONFIG = {
  // 1) ĐỊA CHỈ NHẬN FORM (Formspree). Xem README.md để tạo — miễn phí, ~3 phút.
  //    Dán link dạng:  https://formspree.io/f/abcdwxyz
  //    Đây KHÔNG phải khóa bí mật: nó chỉ cho phép "gửi vào" hộp thư của nhóm.
  formEndpoint: "https://formspree.io/f/mnpdbqob",

  teacherName: "Mr. Minh Sang",

  // Giá trị mặc định trong form
  defaults: {
    fullName: "Lại Minh Sang",
    country: "Hungary",
    city: "Budapest"
  },

  // Nội dung thư — mỗi phần tử là một đoạn
  letter: [
    "Happy Vietnamese Teachers' Day, Mr. Minh Sang!",
    "Thank you for being such an inspiring mentor and for sharing your knowledge, wisdom, and kindness with us.",
    "Your guidance has made a meaningful difference in our learning journey, and we truly appreciate all the encouragement and support you have given us.",
    "Wishing you good health, happiness, and continued success in everything you do.",
    "With heartfelt gratitude and appreciation! ❤️"
  ],

  // Chữ ký tập thể
  signature: ["With warmest wishes,", "Your students"]
};
