import type { Unit } from '../types.ts'

const unit: Unit = {
  id: "u08",
  order: 8,
  level: "B1",
  topic: "work",
  title: "Priorities, estimates and trade-offs",
  titleVi: "Ưu tiên, ước lượng và đánh đổi",
  goal: "Thảo luận ước lượng, rủi ro và các phương án; giải thích hệ quả bằng câu điều kiện loại 1 và so sánh phương án bằng so sánh hơn, so sánh nhất, less/fewer.",
  items: [
    {
      kind: "vocab",
      id: "u08-estimate",
      term: "estimate",
      pos: "verb",
      ipa: "/ˈestɪmeɪt/",
      vi: "ước lượng, ước tính",
      def: "to guess the size, cost or time of something using the information you have",
      examples: [
        {
          en: "The team [estimated] the story at five points.",
          vi: "Nhóm đã ước lượng story này là năm điểm.",
        },
        {
          en: "Can you [estimate] how much the car repair will cost?",
          vi: "Anh ước tính giúp sửa xe sẽ tốn khoảng bao nhiêu được không?",
        },
      ],
      note: "estimate something at + con số. Danh từ đọc là /ˈestɪmət/: give a rough estimate (ước lượng sơ bộ).",
    },
    {
      kind: "vocab",
      id: "u08-effort",
      term: "effort",
      pos: "noun",
      ipa: "/ˈefərt/",
      vi: "công sức; khối lượng công (effort)",
      def: "the amount of work or energy needed to do something",
      examples: [
        {
          en: "How much [effort] will this change need?",
          vi: "Thay đổi này cần bao nhiêu công?",
        },
        {
          en: "Learning a new language takes a lot of [effort].",
          vi: "Học một ngôn ngữ mới tốn rất nhiều công sức.",
        },
      ],
      note: "Thường không đếm được: a lot of effort, less effort. 'make an effort to + V' = cố gắng. Trong IT: effort estimate (ước lượng công), man-days.",
    },
    {
      kind: "vocab",
      id: "u08-trade-off",
      term: "trade-off",
      pos: "noun",
      vi: "sự đánh đổi",
      def: "a balance in which you accept losing one thing to get another",
      examples: [
        {
          en: "There is always a [trade-off|tradeoff] between speed and quality.",
          vi: "Luôn có sự đánh đổi giữa tốc độ và chất lượng.",
        },
        {
          en: "Living downtown is expensive, but a short commute is worth the [trade-off|tradeoff].",
          vi: "Sống ở trung tâm thì đắt, nhưng được đi làm gần thì đáng để đánh đổi.",
        },
      ],
      note: "a trade-off between A and B; make a trade-off. Tiếng Anh Mỹ cũng viết liền: tradeoff.",
    },
    {
      kind: "vocab",
      id: "u08-prioritize",
      term: "prioritize",
      pos: "verb",
      ipa: "/praɪˈɔːrətaɪz/",
      vi: "ưu tiên",
      def: "to decide which things are most important and deal with them first",
      examples: [
        {
          en: "We need to [prioritize] the payment bugs this week.",
          vi: "Tuần này chúng ta cần ưu tiên các lỗi thanh toán.",
        },
        {
          en: "When you're busy, [prioritize] sleep over social media.",
          vi: "Khi bận rộn, hãy ưu tiên giấc ngủ hơn mạng xã hội.",
        },
      ],
      note: "prioritize A over B. ✗ priority the task (priority là danh từ). Tiếng Anh Mỹ viết -ize.",
    },
    {
      kind: "vocab",
      id: "u08-impact",
      term: "impact",
      pos: "noun",
      ipa: "/ˈɪmpækt/",
      vi: "tác động, ảnh hưởng",
      def: "a strong effect that something has on a person, situation or system",
      examples: [
        {
          en: "This change will have a big [impact] on the reporting module.",
          vi: "Thay đổi này sẽ ảnh hưởng lớn đến phân hệ báo cáo.",
        },
        {
          en: "The new metro line had a positive [impact] on local shops.",
          vi: "Tuyến metro mới đã tác động tích cực đến các cửa hàng quanh đó.",
        },
      ],
      note: "have an impact on + something (✗ impact to). impact analysis = phân tích ảnh hưởng.",
    },
    {
      kind: "vocab",
      id: "u08-risk",
      term: "risk",
      pos: "noun",
      ipa: "/rɪsk/",
      vi: "rủi ro",
      def: "the chance that something bad will happen",
      examples: [
        {
          en: "There is a [risk] that the vendor won't deliver the API on time.",
          vi: "Có rủi ro là nhà cung cấp sẽ không bàn giao API đúng hạn.",
        },
        {
          en: "Riding a motorbike without a helmet is a big [risk].",
          vi: "Đi xe máy không đội mũ bảo hiểm là rất nguy hiểm.",
        },
      ],
      note: "a risk of + V-ing / noun; take a risk; risk register (danh sách rủi ro). ✗ a risk to happen.",
    },
    {
      kind: "vocab",
      id: "u08-workaround",
      term: "workaround",
      pos: "noun",
      ipa: "/ˈwɜːrkəraʊnd/",
      vi: "giải pháp tạm thời, cách lách",
      def: "a temporary way to avoid a problem without really solving it",
      examples: [
        {
          en: "Until the fix is ready, the [workaround] is to export the data to Excel.",
          vi: "Trong lúc chờ bản sửa lỗi, giải pháp tạm là xuất dữ liệu ra Excel.",
        },
        {
          en: "The elevator is broken, so our [workaround] is to use the stairs.",
          vi: "Thang máy hỏng, nên tạm thời chúng tôi đi thang bộ.",
        },
      ],
      note: "find / use a workaround. Đây là giải pháp tạm, khác với 'root fix' / 'permanent fix' (sửa tận gốc).",
    },
    {
      kind: "vocab",
      id: "u08-dependency",
      term: "dependency",
      pos: "noun",
      ipa: "/dɪˈpendənsi/",
      vi: "sự phụ thuộc",
      def: "a situation in which one task cannot start or finish until another one is done",
      examples: [
        {
          en: "This story has a [dependency] on the new login API.",
          vi: "Story này phụ thuộc vào API đăng nhập mới.",
        },
        {
          en: "We track every [dependency] between teams on a shared Jira board.",
          vi: "Chúng tôi theo dõi mọi sự phụ thuộc giữa các nhóm trên một Jira board chung.",
        },
      ],
      note: "a dependency on + something. Tính từ: be dependent on. Động từ: depend on (✗ depend in, ✗ depend of).",
    },
    {
      kind: "vocab",
      id: "u08-realistic",
      term: "realistic",
      pos: "adjective",
      ipa: "/ˌriːəˈlɪstɪk/",
      vi: "thực tế, khả thi",
      def: "sensible and possible to achieve, based on the facts",
      examples: [
        {
          en: "Is a two-week deadline [realistic] for this feature?",
          vi: "Hạn chót hai tuần cho tính năng này có khả thi không?",
        },
        {
          en: "It's not [realistic] to become fluent in English in one month.",
          vi: "Nói tiếng Anh trôi chảy trong một tháng là không thực tế.",
        },
      ],
      note: "a realistic deadline / estimate / plan. Trái nghĩa: unrealistic.",
    },
    {
      kind: "vocab",
      id: "u08-capacity",
      term: "capacity",
      pos: "noun",
      ipa: "/kəˈpæsəti/",
      vi: "năng lực, sức chứa (nguồn lực có thể đảm nhận)",
      def: "the amount of work a team can do, or the number of people a place can hold",
      examples: [
        {
          en: "The team doesn't have the [capacity] to take on more stories this sprint.",
          vi: "Sprint này nhóm không còn đủ nguồn lực để nhận thêm story.",
        },
        {
          en: "The stadium has a [capacity] of 40,000 people.",
          vi: "Sân vận động có sức chứa 40.000 người.",
        },
      ],
      note: "team capacity; have the capacity to + V / for + noun; at full capacity (hết công suất).",
    },
    {
      kind: "vocab",
      id: "u08-deprioritize",
      term: "deprioritize",
      pos: "verb",
      vi: "hạ mức ưu tiên",
      def: "to decide that something is less important than before and do it later",
      examples: [
        {
          en: "We [deprioritized] dark mode to meet the deadline.",
          vi: "Chúng tôi đã hạ mức ưu tiên của chế độ tối để kịp hạn chót.",
        },
        {
          en: "During exam season, I [deprioritize] the gym.",
          vi: "Vào mùa thi, tôi tạm gác việc tập gym.",
        },
      ],
      note: "Ngược với prioritize. Hay dùng: deprioritize X in favor of Y (hạ ưu tiên X để làm Y).",
    },
    {
      kind: "vocab",
      id: "u08-buffer",
      term: "buffer",
      pos: "noun",
      ipa: "/ˈbʌfər/",
      vi: "khoảng dự phòng (thời gian, nguồn lực)",
      def: "extra time or resources kept for problems you do not expect",
      examples: [
        {
          en: "Let's add a two-day [buffer] for unexpected bugs.",
          vi: "Hãy thêm hai ngày dự phòng cho các lỗi phát sinh.",
        },
        {
          en: "I always leave a 30-minute [buffer] when I go to the airport.",
          vi: "Tôi luôn chừa ra 30 phút dự phòng khi đi sân bay.",
        },
      ],
      note: "add / build in a buffer; buffer time. Nên nói rõ buffer khi đưa ra ước lượng cho khách hàng.",
    },
    {
      kind: "pattern",
      id: "u08-first-conditional",
      title: "Câu điều kiện loại 1: nói về hệ quả của lựa chọn",
      summary:
        "Dùng **câu điều kiện loại 1** để nói về hệ quả có thể xảy ra của một lựa chọn: *If we add this feature, we will miss the deadline.* Mệnh đề **if** dùng **hiện tại đơn** dù nói về tương lai; mệnh đề chính dùng **will / won't / might / can + V**. Lỗi hay gặp do dịch từ 'nếu chúng ta sẽ...': ✗ *If we will add...*",
      form: "If + S + V (present simple), S + will / won't / might / can + V",
      examples: [
        {
          en: "If we add this feature, we will miss the deadline.",
          vi: "Nếu thêm tính năng này, chúng ta sẽ trễ hạn chót.",
        },
        {
          en: "If the vendor doesn't deliver the API, we won't be able to start testing.",
          vi: "Nếu nhà cung cấp không bàn giao API, chúng ta sẽ không thể bắt đầu kiểm thử.",
        },
        {
          en: "We'll save two days if we use the existing template.",
          vi: "Chúng ta sẽ tiết kiệm được hai ngày nếu dùng mẫu có sẵn.",
        },
      ],
      drills: [
        {
          type: "cloze",
          text: "If we [skip] the regression test, we might miss serious bugs.",
          vi: "Nếu bỏ qua kiểm thử hồi quy, chúng ta có thể bỏ sót lỗi nghiêm trọng.",
          hint: "(skip)",
          explain: "Mệnh đề 'if' của câu điều kiện loại 1 dùng hiện tại đơn: we skip (không dùng 'will skip').",
        },
        {
          type: "cloze",
          text: "If the client approves the change today, we [will start|'ll start] tomorrow.",
          vi: "Nếu hôm nay khách hàng duyệt thay đổi, chúng ta sẽ bắt đầu vào ngày mai.",
          hint: "(start)",
          explain: "Mệnh đề chính nói về kết quả trong tương lai → will + V: will start.",
        },
        {
          type: "fix",
          wrong: "If we will add two more stories, the team will be overloaded.",
          answers: ["If we add two more stories, the team will be overloaded."],
          vi: "Nếu thêm hai story nữa, nhóm sẽ bị quá tải.",
          explain: "Không dùng 'will' trong mệnh đề 'if'. Dùng hiện tại đơn: If we add...",
        },
        {
          type: "fix",
          wrong: "We will miss the release if the PO doesn't signs off today.",
          answers: [
            "We will miss the release if the PO doesn't sign off today.",
            "We'll miss the release if the PO doesn't sign off today.",
            "We will miss the release if the PO does not sign off today.",
          ],
          vi: "Chúng ta sẽ trễ đợt phát hành nếu hôm nay PO không ký duyệt.",
          explain: "Sau 'doesn't' dùng động từ nguyên mẫu: doesn't sign off (không thêm -s).",
        },
        {
          type: "twoTier",
          question: "Complete: 'If the test server ___ down again, we will lose another day.' Choose ALL correct options.",
          vi: "Nếu máy chủ test lại sập, chúng ta sẽ mất thêm một ngày.",
          options: ["goes", "is", "will go", "will be"],
          correct: [0, 1],
          reasons: [
            "Trong mệnh đề 'if' của câu điều kiện loại 1, dùng hiện tại đơn dù đang nói về tương lai.",
            "Vì sự việc xảy ra trong tương lai, cả hai mệnh đề đều cần 'will'.",
            "Mệnh đề 'if' dùng hiện tại đơn chỉ khi chủ ngữ là người, còn với vật thì dùng 'will'.",
            "Chỉ dùng 'will' trong mệnh đề 'if' khi người nói chắc chắn việc đó sẽ xảy ra.",
          ],
          reasonCorrect: 0,
          explain: "'goes down' (bị sập) và 'is down' (đang sập) đều đúng ở hiện tại đơn. 'will go' và 'will be' sai vì mệnh đề 'if' không dùng 'will'.",
        },
        {
          type: "transform",
          instruction: "Join the two sentences into one first conditional sentence starting with 'If'.",
          source: "We remove the export feature. We finish on time.",
          answers: [
            "If we remove the export feature, we will finish on time.",
            "If we remove the export feature, we'll finish on time.",
            "If we remove the export feature, we can finish on time.",
          ],
          explain: "Mệnh đề 'if' giữ hiện tại đơn (we remove), mệnh đề chính dùng will + V (we will finish).",
        },
      ],
    },
    {
      kind: "pattern",
      id: "u08-comparing-options",
      title: "So sánh phương án: so sánh hơn, so sánh nhất, less / fewer",
      summary:
        "Khi so sánh các phương án, dùng **so sánh hơn** (cheaper, faster, more flexible, less risky + than) và **so sánh nhất** (the cheapest, the most realistic). **Fewer** + danh từ đếm được số nhiều (fewer bugs, fewer developers), **less** + danh từ không đếm được (less effort, less time). Lỗi hay gặp: ✗ *more cheaper*, ✗ *less bugs* (trong văn viết chuẩn).",
      form: "adj-er / more + adj (+ than) | the adj-est / the most + adj | fewer + N đếm được | less + N không đếm được",
      examples: [
        {
          en: "Option A is cheaper than Option B, but it is riskier.",
          vi: "Phương án A rẻ hơn phương án B, nhưng rủi ro hơn.",
        },
        {
          en: "This is the most realistic plan we have.",
          vi: "Đây là kế hoạch khả thi nhất mà chúng ta có.",
        },
        {
          en: "The workaround needs less effort and causes fewer changes to the database.",
          vi: "Giải pháp tạm cần ít công hơn và gây ít thay đổi hơn cho cơ sở dữ liệu.",
        },
      ],
      drills: [
        {
          type: "cloze",
          text: "Option B needs [less] effort than Option A.",
          vi: "Phương án B cần ít công hơn phương án A.",
          hint: "(less / fewer)",
          explain: "'effort' là danh từ không đếm được → dùng 'less'.",
        },
        {
          type: "cloze",
          text: "This sprint we have [fewer] developers because two people are on leave.",
          vi: "Sprint này chúng ta có ít lập trình viên hơn vì hai người đang nghỉ phép.",
          hint: "(less / fewer)",
          explain: "'developers' là danh từ đếm được số nhiều → dùng 'fewer'.",
        },
        {
          type: "cloze",
          text: "Of the three options, the workaround is [the cheapest].",
          vi: "Trong ba phương án, giải pháp tạm là rẻ nhất.",
          hint: "(cheap)",
          explain: "So sánh trong một nhóm từ ba lựa chọn trở lên → so sánh nhất: the + adj-est (the cheapest).",
        },
        {
          type: "fix",
          wrong: "Option A is more cheaper than Option B.",
          answers: ["Option A is cheaper than Option B."],
          vi: "Phương án A rẻ hơn phương án B.",
          explain: "Tính từ ngắn 'cheap' chỉ cần thêm -er. Không dùng 'more' cùng với đuôi -er.",
        },
        {
          type: "twoTier",
          question: "Choose ALL correct sentences comparing two options.",
          vi: "Chọn TẤT CẢ câu đúng khi so sánh hai phương án.",
          options: [
            "The cloud option is more flexible than the on-premise one.",
            "The cloud option is flexibler than the on-premise one.",
            "The cloud option is less risky than the on-premise one.",
            "The cloud option is more riskier than the on-premise one.",
          ],
          correct: [0, 2],
          reasons: [
            "Tính từ dài (flexible) dùng 'more'; 'less + tính từ' dùng được với mọi tính từ; không dùng 'more' cùng đuôi -er.",
            "Mọi tính từ đều có thể thêm -er để so sánh hơn.",
            "Dùng 'more' cùng đuôi -er để nhấn mạnh hơn trong văn viết trang trọng.",
            "'less' chỉ dùng trước danh từ, không dùng trước tính từ.",
          ],
          reasonCorrect: 0,
          explain: "'more flexible' và 'less risky' đúng. 'flexibler' sai vì tính từ dài phải dùng 'more'; 'more riskier' sai vì thừa 'more'.",
        },
        {
          type: "transform",
          instruction: "Rewrite the sentence with Option B as the subject. Use 'fewer'.",
          source: "Option A has more bugs than Option B.",
          answers: ["Option B has fewer bugs than Option A.", "Option B has fewer bugs than Option A does."],
          explain: "'bugs' là danh từ đếm được số nhiều → ngược nghĩa với 'more bugs' là 'fewer bugs' (không dùng 'less bugs').",
        },
      ],
    },
  ],
  aiTasks: [
    {
      id: "u08-ai-1",
      kind: "writing",
      title: "Trả lời yêu cầu thêm phạm vi",
      brief:
        "Giám đốc kinh doanh (một stakeholder quan trọng) muốn thêm tính năng xuất báo cáo PDF vào bản phát hành tháng sau. Nhóm đã dùng hết capacity của sprint và hạn chót rất sát.",
      task:
        "Write a reply email to the stakeholder. Explain the impact of adding the feature using at least two first conditional sentences. Compare at least two options (for example: add it now and delay the release, move it to the next release, or use a workaround) using comparatives, superlatives, and less / fewer. Recommend the most realistic option and ask the stakeholder to confirm.",
      minWords: 120,
      criteria: [
        "Có ít nhất hai câu điều kiện loại 1 đúng (không dùng 'will' trong mệnh đề if)",
        "So sánh phương án đúng ngữ pháp: so sánh hơn, so sánh nhất, less/fewer",
        "Nêu rõ tác động, rủi ro và đề xuất cụ thể, có lời yêu cầu xác nhận",
        "Giọng văn lịch sự, thuyết phục, không từ chối thẳng thừng",
      ],
    },
    {
      id: "u08-ai-2",
      kind: "translation",
      title: "Dịch phân tích phương án",
      brief: "Bạn gửi phân tích nhanh cho product owner sau khi ước lượng lại yêu cầu mới.",
      task: "Translate into natural, professional English.",
      source:
        "Chúng tôi đã ước lượng lại công cho yêu cầu mới. Nếu thêm tính năng này, nhóm sẽ trễ hạn chót khoảng một tuần vì sprint hiện tại đã hết capacity. Phương án B ít rủi ro hơn và cần ít công hơn, nhưng phụ thuộc vào API của đối tác. Trong lúc chờ, người dùng có thể dùng giải pháp tạm là xuất dữ liệu ra Excel. Chúng tôi đề xuất ưu tiên các lỗi thanh toán trước và chuyển tính năng này sang bản phát hành sau.",
      criteria: [
        "Dùng đúng thuật ngữ: estimate, effort, capacity, risk, dependency, workaround, prioritize",
        "Câu điều kiện loại 1 và so sánh hơn (less risky, less effort) đúng ngữ pháp",
        "Giọng văn rõ ràng, chuyên nghiệp, không dịch từng chữ",
        "Đúng chính tả và ngữ pháp",
      ],
    },
  ],
}

export default unit
