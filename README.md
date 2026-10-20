# ama·to·pro

App học tiếng Anh cá nhân, từ A2 đến thành thạo, tập trung vào giao tiếp hằng ngày và công việc BA/IT.

## Chạy

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # bản production trong dist/
node scripts/validate-content.ts   # kiểm tra cấu trúc nội dung bài học
```

## Nguyên tắc chống đoán mò

| Cơ chế | Ở đâu |
|---|---|
| Tự gõ đáp án thay vì chọn A/B/C/D | `Cloze`, `Recall`, `Dictation`, `Fix`, `Transform` trong `src/components/exercises.tsx` |
| Nút "Kiểm tra" (chắc chắn) và "Đoán thử" — đoán đúng vẫn được ôn lại sớm | `toGrade()` trong `src/lib/srs.ts` |
| Trắc nghiệm hai tầng: chọn tất cả đáp án đúng + chọn lý do | `TwoTier` |
| Lỗi gõ nhẹ được "gần đúng", nhưng sai đuôi -s/-ed thì tính sai | `checkTyped()` trong `src/lib/grading.ts` |
| Mỗi lần ôn đổi dạng bài hoặc câu ví dụ | `reviewVariant()` trong `src/lib/session.ts` |
| Sai thì làm lại sau vài câu, bằng dạng bài khác | `commit()` trong `src/pages/Session.tsx` |

## Chấm bài bằng AI (không cần API key)

1. Viết bài trong app → app tạo prompt (đề + tiêu chí + bài làm + định dạng trả lời).
2. Dán vào AI chat bất kỳ.
3. Dán phản hồi về app → app đọc `ĐIỂM: x/10` và các dòng `LỖI: sai => đúng | giải thích`, rồi đưa lỗi vào lịch ôn tập.

## Cấu trúc

```
src/content/units/   nội dung bài học (u01–u10), kiểu dữ liệu ở src/content/types.ts
src/lib/             store (localStorage), SRS (FSRS), chấm bài, giọng nói, prompt AI, tạo buổi học
src/components/      giao diện dùng chung + các dạng bài tập
src/pages/           các màn hình
```

Thêm unit mới: tạo `src/content/units/uXX.ts` export default một `Unit`, chạy validator. App tự nhận file mới.

Dữ liệu chỉ nằm trong localStorage của trình duyệt — dùng Cài đặt → Xuất file để sao lưu.
