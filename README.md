# Thiệp chúc mừng 20/11 cho Mr. Minh Sang 💌

Website tĩnh (HTML + CSS + JS thuần, không cần cài đặt gì): phong bì → lá thư → hộp quà bất ngờ → form địa chỉ → màn hình cảm ơn.

## Chạy thử trên máy

Mở thư mục này trong terminal rồi chạy một trong hai:

```bash
python -m http.server 8000      # rồi mở http://localhost:8000
# hoặc: npx serve .
```
(Có thể double-click `index.html`, nhưng chạy qua server sẽ giống thực tế hơn.)

## ⚠️ BẮT BUỘC trước khi gửi cho thầy: kết nối form (Formspree, miễn phí)

Hiện tại form **chưa kết nối**. Nếu bấm gửi, form sẽ báo thật là "chưa kết nối" chứ không giả vờ thành công.

1. Vào https://formspree.io → đăng ký bằng email của một bạn trong nhóm (đây sẽ là nơi nhận địa chỉ).
2. **New Form** → đặt tên, chọn email nhận → copy link dạng `https://formspree.io/f/abcdwxyz`.
3. Mở [config.js](config.js), dán vào `formEndpoint`.
4. Trong Formspree → Settings của form: bật **reCAPTCHA/spam protection** nếu muốn, và (tuỳ chọn) thêm tên miền website vào mục *Allowed domains* để người lạ không gửi bừa được.
5. **Tự gửi thử 1 lần** bằng dữ liệu giả, xác nhận email về hộp thư, rồi mới gửi link cho thầy.

Ghi chú về bảo mật: link Formspree trong code không phải khóa bí mật — nó chỉ cho phép *gửi vào* hộp thư của bạn, không cho phép đọc. Địa chỉ của thầy chỉ nằm trong email/dashboard Formspree của nhóm, không hiển thị trên website. Gói miễn phí có giới hạn ~50 lượt gửi/tháng (đủ dùng). Trang có `noindex` nên Google sẽ không lập chỉ mục.

## Deploy miễn phí

**Netlify (dễ nhất):** vào https://app.netlify.com/drop → kéo thả cả thư mục `thay-sang-card` vào → nhận link `xxx.netlify.app` (có thể đổi tên link ở Site settings).

**Vercel:** `npm i -g vercel` rồi chạy `vercel` trong thư mục này (Framework: Other, không cần build).

**GitHub Pages:** đẩy thư mục lên một repo → Settings → Pages → Deploy from branch → `main` / root.

## Chỉnh sửa nội dung

| Muốn đổi | Sửa ở đâu |
|---|---|
| Tên thầy | `teacherName` trong [config.js](config.js) (nhớ sửa cả câu chào đầu thư trong `letter`) |
| Nội dung thư | mảng `letter` trong [config.js](config.js) |
| Chữ ký | `signature` trong [config.js](config.js) |
| Tên/quốc gia/thành phố mặc định | `defaults` trong [config.js](config.js) |
| Màu sắc | các biến `--cream`, `--dusty`, `--burgundy`, `--gold`… ở đầu [styles.css](styles.css) |
| Chữ trên màn hình chào, màn quà, form | [index.html](index.html) |

## Ghi chú kỹ thuật

- Không phụ thuộc thư viện nào (chỉ Google Fonts; nếu offline sẽ tự dùng font hệ thống).
- Tôn trọng `prefers-reduced-motion` (tắt cánh hoa, confetti, hiệu ứng).
- Form: kiểm tra số điện thoại quốc tế (bắt buộc `+mã nước`, riêng `+36` kiểm tra độ dài), mã bưu chính Hungary 4 chữ số, địa chỉ phải có số nhà. Không dùng GPS, không có bản đồ.
- Có "honeypot" chống bot; thêm trường `gift_reply` để biết thầy bấm "Of course😊" hay "Yeah sureee".
