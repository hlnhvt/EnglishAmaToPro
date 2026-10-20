import type { Unit } from '../types.ts'

const unit: Unit = {
  id: "u07",
  order: 7,
  level: "B1",
  topic: "writing",
  title: "Status updates and emails",
  titleVi: "Báo cáo tiến độ và email công việc",
  goal: "Viết status update và email công việc rõ ràng: báo tiến độ, blocker, thời gian dự kiến; dùng đúng hiện tại hoàn thành và quá khứ đơn; dùng đúng các cụm cố định trong email.",
  items: [
    {
      kind: "vocab",
      id: "u07-on-track",
      term: "on track",
      pos: "phrase",
      vi: "đúng tiến độ",
      def: "making progress as planned and likely to succeed",
      examples: [
        {
          en: "The project is [on track] for the June release.",
          vi: "Dự án đang đúng tiến độ cho bản phát hành tháng Sáu.",
        },
        {
          en: "I'm saving every month, so I'm [on track] to buy a car next year.",
          vi: "Tháng nào tôi cũng tiết kiệm, nên tôi đang đúng kế hoạch để mua xe vào năm sau.",
        },
      ],
      note: "be on track for + noun / on track to + V. Trái nghĩa: off track, behind schedule (chậm tiến độ).",
    },
    {
      kind: "vocab",
      id: "u07-blocker",
      term: "blocker",
      pos: "noun",
      ipa: "/ˈblɑːkər/",
      vi: "vấn đề chặn tiến độ, trở ngại",
      def: "a problem that stops work from moving forward",
      examples: [
        {
          en: "The missing API is a [blocker] for the payment team.",
          vi: "Việc chưa có API là trở ngại chặn tiến độ của nhóm thanh toán.",
        },
        {
          en: "In the stand-up, the Scrum Master asked if anyone had any [blockers].",
          vi: "Trong buổi stand-up, Scrum Master hỏi có ai đang gặp vướng mắc gì không.",
        },
      ],
      note: "Câu hỏi quen thuộc trong daily stand-up: 'Any blockers?' Động từ: be blocked by something.",
    },
    {
      kind: "vocab",
      id: "u07-deadline",
      term: "deadline",
      pos: "noun",
      ipa: "/ˈdedlaɪn/",
      vi: "hạn chót",
      def: "the latest time or date by which something must be finished",
      examples: [
        {
          en: "We can't miss the [deadline] for the UAT build.",
          vi: "Chúng ta không được trễ hạn chót của bản build UAT.",
        },
        {
          en: "The [deadline] for the visa application is next Monday.",
          vi: "Hạn chót nộp hồ sơ xin visa là thứ Hai tới.",
        },
      ],
      note: "meet / miss / extend a deadline; a tight deadline. 'Trễ deadline' = miss the deadline (✗ late the deadline).",
    },
    {
      kind: "vocab",
      id: "u07-attach",
      term: "attach",
      pos: "verb",
      ipa: "/əˈtætʃ/",
      vi: "đính kèm",
      def: "to add a file to an email or a document to a form",
      examples: [
        {
          en: "I've [attached] the updated test report.",
          vi: "Tôi đã đính kèm báo cáo kiểm thử đã cập nhật.",
        },
        {
          en: "Please [attach] a photo of your ID to the application form.",
          vi: "Vui lòng đính kèm ảnh giấy tờ tùy thân vào đơn đăng ký.",
        },
      ],
      note: "attach something to an email. ✗ attach with. Tính từ: the attached file. Cụm cố định: Please find attached...",
    },
    {
      kind: "vocab",
      id: "u07-follow-up-on",
      term: "follow up on",
      pos: "phrasal verb",
      vi: "hỏi lại, theo dõi tiếp (một việc)",
      def: "to check or take more action on something that was discussed or started before",
      examples: [
        {
          en: "I'm writing to [follow up on] our call last Tuesday.",
          vi: "Tôi viết email này để trao đổi tiếp về cuộc gọi hôm thứ Ba tuần trước.",
        },
        {
          en: "Can you [follow up on] my refund? I still haven't received it.",
          vi: "Anh kiểm tra lại giúp tôi khoản hoàn tiền được không? Tôi vẫn chưa nhận được.",
        },
      ],
      note: "follow up on + việc; follow up with + người. Danh từ: a follow-up email.",
    },
    {
      kind: "vocab",
      id: "u07-update",
      term: "update",
      pos: "noun",
      ipa: "/ˈʌpdeɪt/",
      vi: "thông tin cập nhật",
      def: "the newest information about a situation",
      examples: [
        {
          en: "Here is a quick [update] on the CRM project.",
          vi: "Sau đây là cập nhật nhanh về dự án CRM.",
        },
        {
          en: "Any [updates] on your job interview?",
          vi: "Buổi phỏng vấn xin việc của bạn có tin gì mới chưa?",
        },
      ],
      note: "an update on + chủ đề; give / send someone an update; weekly status update. Động từ (nhấn âm 2): update the ticket.",
    },
    {
      kind: "vocab",
      id: "u07-delay",
      term: "delay",
      pos: "noun",
      ipa: "/dɪˈleɪ/",
      vi: "sự chậm trễ; làm trễ",
      def: "a situation in which something happens later than planned",
      examples: [
        {
          en: "There is a two-day [delay] because the test server is down.",
          vi: "Bị chậm hai ngày vì máy chủ test đang gặp sự cố.",
        },
        {
          en: "Our flight was [delayed] by three hours.",
          vi: "Chuyến bay của chúng tôi bị hoãn ba tiếng.",
        },
      ],
      note: "a delay in / to something; be delayed by + thời gian. ✗ delay 2 days → ✓ a two-day delay / delayed by two days.",
    },
    {
      kind: "vocab",
      id: "u07-eta",
      term: "ETA",
      pos: "noun",
      vi: "thời gian dự kiến (đến nơi / hoàn thành)",
      def: "the time when something is expected to arrive or be finished",
      examples: [
        {
          en: "What's the [ETA] for the bug fix?",
          vi: "Khi nào dự kiến sửa xong lỗi này?",
        },
        {
          en: "The taxi app says the driver's [ETA] is five minutes.",
          vi: "Ứng dụng taxi báo tài xế dự kiến đến trong năm phút.",
        },
      ],
      note: "Viết tắt của 'estimated time of arrival'; trong IT dùng cho thời gian dự kiến xong việc. Đọc từng chữ: E-T-A.",
    },
    {
      kind: "vocab",
      id: "u07-as-discussed",
      term: "as discussed",
      pos: "expression",
      vi: "như đã trao đổi",
      def: "in the way we agreed when we talked earlier",
      examples: [
        {
          en: "I've moved the demo to Thursday, [as discussed].",
          vi: "Như đã trao đổi, tôi đã dời buổi demo sang thứ Năm.",
        },
        {
          en: "The rent will go up by five percent, [as discussed] last month.",
          vi: "Như đã bàn tháng trước, tiền thuê nhà sẽ tăng năm phần trăm.",
        },
      ],
      note: "Hay dùng ở đầu email: 'As discussed, ...' ✗ As discussed about. Biến thể: as agreed, as mentioned.",
    },
    {
      kind: "vocab",
      id: "u07-heads-up",
      term: "heads-up",
      pos: "noun",
      vi: "lời báo trước",
      def: "a short warning about something that is going to happen",
      examples: [
        {
          en: "Just a [heads-up]: the server will be down tonight from 10 to 11 p.m.",
          vi: "Báo trước nhé: tối nay máy chủ sẽ ngừng hoạt động từ 10 đến 11 giờ.",
        },
        {
          en: "Thanks for the [heads-up] about the traffic jam.",
          vi: "Cảm ơn bạn đã báo trước vụ kẹt xe.",
        },
      ],
      note: "give someone a heads-up (about something). Thân mật nhưng rất phổ biến trong email và chat nội bộ.",
    },
    {
      kind: "vocab",
      id: "u07-progress",
      term: "progress",
      pos: "noun",
      ipa: "/ˈprɑːɡres/",
      vi: "tiến độ, sự tiến bộ",
      def: "movement toward finishing something or getting better at it",
      examples: [
        {
          en: "We made good [progress] on the reporting module this week.",
          vi: "Tuần này chúng tôi đã có tiến triển tốt ở phân hệ báo cáo.",
        },
        {
          en: "My English teacher is happy with my [progress].",
          vi: "Giáo viên tiếng Anh hài lòng với sự tiến bộ của tôi.",
        },
      ],
      note: "Danh từ không đếm được: ✗ a progress, ✗ progresses. make progress (✗ do progress); progress on + việc.",
    },
    {
      kind: "vocab",
      id: "u07-complete",
      term: "complete",
      pos: "verb",
      ipa: "/kəmˈpliːt/",
      vi: "hoàn thành",
      def: "to finish doing or making something",
      examples: [
        {
          en: "We [have completed|'ve completed] all the test cases for sprint 5.",
          vi: "Chúng tôi đã hoàn thành tất cả test case của sprint 5.",
        },
        {
          en: "You need to [complete] this form before your appointment.",
          vi: "Bạn cần điền xong mẫu đơn này trước buổi hẹn.",
        },
      ],
      note: "complete a task / a form / a sprint. Trang trọng hơn 'finish'. Tính từ: complete (hoàn chỉnh).",
    },
    {
      kind: "pattern",
      id: "u07-perfect-vs-past",
      title: "Hiện tại hoàn thành vs quá khứ đơn trong status update",
      summary:
        "Trong status update, dùng **hiện tại hoàn thành** khi kết quả quan trọng ở hiện tại và **không nêu thời điểm cụ thể** (thường đi với so far, already, yet, this week): *We have completed the testing.* Dùng **quá khứ đơn** khi có **thời điểm cụ thể đã qua** (yesterday, last week, on Monday): *We completed it yesterday.* ✗ *We have completed it yesterday.*",
      form: "have/has + V3 (không nêu thời điểm) | V2 + yesterday / last week / on Monday",
      examples: [
        {
          en: "We have completed the integration testing.",
          vi: "Chúng tôi đã hoàn thành kiểm thử tích hợp.",
        },
        {
          en: "We completed the integration testing yesterday.",
          vi: "Chúng tôi đã hoàn thành kiểm thử tích hợp vào hôm qua.",
        },
        {
          en: "Have you sent the release notes to the client yet?",
          vi: "Anh đã gửi release notes cho khách hàng chưa?",
        },
      ],
      drills: [
        {
          type: "cloze",
          text: "So far, we [have fixed|'ve fixed] 12 of the 15 bugs.",
          vi: "Đến giờ, chúng tôi đã sửa được 12 trên 15 lỗi.",
          hint: "(fix)",
          explain: "'So far' (tính đến hiện tại) không nêu thời điểm cụ thể → hiện tại hoàn thành: have fixed.",
        },
        {
          type: "cloze",
          text: "The client [approved] the design last Friday.",
          vi: "Khách hàng đã duyệt thiết kế vào thứ Sáu tuần trước.",
          hint: "(approve)",
          explain: "'last Friday' là thời điểm cụ thể đã qua → quá khứ đơn: approved.",
        },
        {
          type: "cloze",
          text: "Has the QA team [finished] the regression test yet?",
          vi: "Nhóm QA đã chạy xong kiểm thử hồi quy chưa?",
          hint: "(finish)",
          explain: "'Has ... yet?' là câu hỏi hiện tại hoàn thành → cần V3: finished.",
        },
        {
          type: "fix",
          wrong: "We have finished the UAT last week.",
          answers: ["We finished the UAT last week.", "We finished UAT last week."],
          vi: "Chúng tôi đã hoàn thành UAT vào tuần trước.",
          explain: "Có mốc thời gian cụ thể 'last week' nên không dùng hiện tại hoàn thành. Dùng quá khứ đơn: finished.",
        },
        {
          type: "twoTier",
          question: "Choose ALL correct sentences for a status update.",
          vi: "Chọn TẤT CẢ câu đúng cho một bản cập nhật tiến độ.",
          options: [
            "The team has deployed the new build to staging.",
            "The team has deployed the new build on Monday.",
            "The team deployed the new build on Monday.",
            "The team deploys the new build last Monday.",
          ],
          correct: [0, 2],
          reasons: [
            "Có thời điểm cụ thể trong quá khứ (on Monday) thì dùng quá khứ đơn; không nêu thời điểm thì dùng hiện tại hoàn thành.",
            "Hiện tại hoàn thành dùng được với mọi mốc thời gian vì nó nói về việc đã xong.",
            "Status update nói về tình hình hiện tại nên luôn dùng thì hiện tại đơn.",
            "Quá khứ đơn chỉ dùng cho việc xảy ra đã lâu, không dùng cho việc trong tuần này.",
          ],
          reasonCorrect: 0,
          explain: "'has deployed' (không có thời điểm) và 'deployed ... on Monday' đều đúng. 'has deployed ... on Monday' sai vì có mốc thời gian cụ thể; 'deploys ... last Monday' sai thì.",
        },
        {
          type: "transform",
          instruction: "Add 'yesterday' at the end and change the tense if needed.",
          source: "We have sent the test report to the client.",
          answers: ["We sent the test report to the client yesterday."],
          explain: "Thêm 'yesterday' (thời điểm cụ thể đã qua) → phải chuyển sang quá khứ đơn: have sent → sent.",
        },
      ],
    },
    {
      kind: "pattern",
      id: "u07-email-phrases",
      title: "Cụm cố định và giới từ trong email",
      summary:
        "Một số cụm cố định trong email công việc: **Please find attached** + tài liệu (hoặc **I've attached** + tài liệu), **look forward to + V-ing / danh từ** (vì 'to' ở đây là giới từ), **an update on** + chủ đề, **follow up on** + việc. Lỗi hay gặp: ✗ *I look forward to hear from you* → ✓ *I look forward to hearing from you*; ✗ *Please find attach...* → ✓ *Please find attached...*",
      form: "Please find attached + noun | look forward to + V-ing / noun | an update on + noun | follow up on + noun",
      examples: [
        {
          en: "Please find attached the updated test plan.",
          vi: "Vui lòng xem kế hoạch kiểm thử đã cập nhật trong tệp đính kèm.",
        },
        {
          en: "I look forward to hearing from you.",
          vi: "Tôi mong sớm nhận được phản hồi của anh/chị.",
        },
        {
          en: "Here is a quick update on the payment module.",
          vi: "Sau đây là cập nhật nhanh về phân hệ thanh toán.",
        },
      ],
      drills: [
        {
          type: "cloze",
          text: "I look forward to [hearing] from you.",
          vi: "Tôi mong sớm nhận được phản hồi của anh/chị.",
          hint: "(hear)",
          explain: "'to' trong 'look forward to' là giới từ → theo sau là V-ing: hearing.",
        },
        {
          type: "cloze",
          text: "Here is a quick update [on] the data migration.",
          vi: "Sau đây là cập nhật nhanh về việc chuyển đổi dữ liệu.",
          hint: "(preposition)",
          explain: "'an update on + chủ đề' là collocation chuẩn để nói cập nhật về việc gì.",
        },
        {
          type: "fix",
          wrong: "I look forward to meet you at the workshop.",
          answers: ["I look forward to meeting you at the workshop."],
          vi: "Tôi mong được gặp anh/chị tại buổi workshop.",
          explain: "Sau 'look forward to' dùng V-ing, không dùng V nguyên mẫu: meeting.",
        },
        {
          type: "fix",
          wrong: "Please find attach the meeting minutes.",
          answers: [
            "Please find attached the meeting minutes.",
            "Please find the meeting minutes attached.",
            "I've attached the meeting minutes.",
            "I have attached the meeting minutes.",
          ],
          vi: "Vui lòng xem biên bản cuộc họp trong tệp đính kèm.",
          explain: "Cụm cố định là 'Please find attached' (attached là tính từ/V3), không dùng 'attach'.",
        },
        {
          type: "twoTier",
          question: "Complete the email: 'We look forward to ___ the final version next week.' Choose ALL correct options.",
          vi: "Chúng tôi mong nhận được / xem bản cuối cùng vào tuần sau.",
          options: ["receiving", "reviewing", "receive", "review"],
          correct: [0, 1],
          reasons: [
            "'to' trong 'look forward to' là giới từ, nên theo sau là V-ing hoặc danh từ.",
            "'look forward to' giống 'want to', nên theo sau là V nguyên mẫu.",
            "Vì hành động xảy ra trong tương lai (next week), phải dùng V nguyên mẫu.",
            "Chỉ những động từ chỉ cảm xúc mới dùng V-ing sau 'look forward to'.",
          ],
          reasonCorrect: 0,
          explain: "'receiving' và 'reviewing' đều đúng ngữ pháp và hợp nghĩa. 'receive' và 'review' sai vì sau giới từ 'to' phải là V-ing.",
        },
        {
          type: "transform",
          instruction: "Rewrite more formally. Start with 'Please find attached'.",
          source: "Here's the report you asked for.",
          answers: [
            "Please find attached the report you asked for.",
            "Please find attached the report you requested.",
            "Please find attached the report that you asked for.",
            "Please find attached the report that you requested.",
          ],
          explain: "'Please find attached + tài liệu' là cách mở đầu trang trọng khi gửi file kèm email.",
        },
      ],
    },
  ],
  aiTasks: [
    {
      id: "u07-ai-1",
      kind: "writing",
      title: "Viết email cập nhật tiến độ hằng tuần",
      brief:
        "Cuối tuần, bạn gửi status update cho khách hàng. Dự án nhìn chung đúng tiến độ, nhưng có một blocker: môi trường test bị lỗi từ thứ Tư, làm UAT có thể trễ hai ngày.",
      task:
        "Write a weekly status update email to the client. Include: the overall status (on track or not), what the team has completed this week (present perfect), what happened on specific days (past simple), one blocker and its impact on the deadline, a new ETA, next steps, and a polite closing with 'look forward to + V-ing'. Mention one attached document.",
      minWords: 120,
      criteria: [
        "Dùng đúng hiện tại hoàn thành (không có mốc thời gian) và quá khứ đơn (có mốc thời gian)",
        "Nêu rõ trạng thái, blocker, ảnh hưởng tới deadline và ETA mới",
        "Dùng đúng cụm email: Please find attached / I've attached, look forward to + V-ing",
        "Bố cục email rõ ràng, giọng văn chuyên nghiệp",
      ],
    },
    {
      id: "u07-ai-2",
      kind: "translation",
      title: "Dịch email báo tiến độ có rủi ro trễ",
      brief: "Bạn gửi email cho khách hàng sau buổi họp thứ Hai.",
      task: "Translate into natural, professional English.",
      source:
        "Chào anh Mark, như đã trao đổi trong cuộc họp hôm thứ Hai, tôi gửi kèm bản cập nhật kế hoạch UAT. Nhóm chúng tôi đã hoàn thành 80% test case và dự án vẫn đang đúng tiến độ. Tuy nhiên, tôi muốn báo trước là việc bàn giao phân hệ báo cáo có thể bị trễ hai ngày vì máy chủ test gặp sự cố hôm qua. Tôi sẽ theo dõi việc này với nhóm hạ tầng và gửi anh thời gian dự kiến hoàn thành trước thứ Tư. Tôi mong sớm nhận được phản hồi của anh.",
      criteria: [
        "Dùng đúng cụm: as discussed, please find attached, on track, heads-up, follow up on/with, ETA",
        "Phân biệt đúng hiện tại hoàn thành (đã hoàn thành 80%) và quá khứ đơn (gặp sự cố hôm qua)",
        "Kết thư đúng: I look forward to hearing from you",
        "Giọng văn tự nhiên, chuyên nghiệp, đúng ngữ pháp",
      ],
    },
  ],
}

export default unit
