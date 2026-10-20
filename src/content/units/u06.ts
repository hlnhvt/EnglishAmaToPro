import type { Unit } from '../types.ts'

const unit: Unit = {
  id: "u06",
  order: 6,
  level: "B1",
  topic: "meetings",
  title: "Clarifying in meetings",
  titleVi: "Hỏi lại và làm rõ trong cuộc họp",
  goal: "Hỏi lại cho rõ một cách lịch sự bằng câu hỏi gián tiếp, xác nhận và tóm tắt ý chính, và phản biện nhẹ nhàng mà không làm mất lòng người khác.",
  items: [
    {
      kind: "vocab",
      id: "u06-clarify",
      term: "clarify",
      pos: "verb",
      ipa: "/ˈklærəfaɪ/",
      vi: "làm rõ",
      def: "to make something easier to understand by explaining it in more detail",
      examples: [
        {
          en: "Could you [clarify] what you mean by 'real-time'?",
          vi: "Anh có thể làm rõ ý anh khi nói 'real-time' là gì không?",
        },
        {
          en: "The teacher [clarified] the homework rules before the weekend.",
          vi: "Cô giáo đã giải thích rõ quy định về bài tập về nhà trước cuối tuần.",
        },
      ],
      note: "clarify something (✗ clarify about something). Danh từ: clarification — ask for clarification.",
    },
    {
      kind: "vocab",
      id: "u06-confirm",
      term: "confirm",
      pos: "verb",
      ipa: "/kənˈfɜːrm/",
      vi: "xác nhận",
      def: "to say or show that something is true or will definitely happen",
      examples: [
        {
          en: "Can you [confirm] the release date by email?",
          vi: "Anh xác nhận ngày phát hành qua email giúp tôi được không?",
        },
        {
          en: "I called the hotel to [confirm] our booking.",
          vi: "Tôi đã gọi cho khách sạn để xác nhận việc đặt phòng.",
        },
      ],
      note: "confirm something / confirm that + mệnh đề. ✗ confirm about. Danh từ: confirmation.",
    },
    {
      kind: "vocab",
      id: "u06-follow-up",
      term: "follow up",
      pos: "phrasal verb",
      vi: "liên hệ lại, theo dõi tiếp",
      def: "to contact someone again or take further action after a first contact",
      examples: [
        {
          en: "I'll [follow up] with the client after the meeting.",
          vi: "Sau cuộc họp tôi sẽ liên hệ lại với khách hàng.",
        },
        {
          en: "If the landlord doesn't reply, [follow up] with a phone call.",
          vi: "Nếu chủ nhà không trả lời, hãy gọi điện hỏi lại.",
        },
      ],
      note: "follow up with + người (liên hệ lại với ai); follow up on + việc (theo dõi tiếp việc gì). Danh từ có gạch nối: a follow-up.",
    },
    {
      kind: "vocab",
      id: "u06-point",
      term: "point",
      pos: "noun",
      ipa: "/pɔɪnt/",
      vi: "ý, luận điểm",
      def: "an idea or opinion that someone gives in a discussion",
      examples: [
        {
          en: "That's a good [point]. We didn't think about mobile users.",
          vi: "Ý đó hay đấy. Chúng ta chưa nghĩ tới người dùng di động.",
        },
        {
          en: "My friend made a fair [point] about saving money before traveling.",
          vi: "Bạn tôi nói có lý về chuyện tiết kiệm tiền trước khi đi du lịch.",
        },
      ],
      note: "make a point, a good / fair point, I see your point, get to the point (đi thẳng vào vấn đề).",
    },
    {
      kind: "vocab",
      id: "u06-agenda",
      term: "agenda",
      pos: "noun",
      ipa: "/əˈdʒendə/",
      vi: "chương trình họp; lịch trình",
      def: "a list of topics to discuss at a meeting",
      examples: [
        {
          en: "Let's move to the next item on the [agenda].",
          vi: "Chúng ta chuyển sang mục tiếp theo trong chương trình họp nhé.",
        },
        {
          en: "What's on the [agenda] for the weekend?",
          vi: "Cuối tuần này có kế hoạch gì không?",
        },
      ],
      note: "on the agenda (✗ in the agenda); set / send out the agenda.",
    },
    {
      kind: "vocab",
      id: "u06-action-item",
      term: "action item",
      pos: "noun",
      vi: "đầu việc cần làm (sau cuộc họp)",
      def: "a specific task that someone agrees to do after a meeting",
      examples: [
        {
          en: "Let's review the [action items] before we finish.",
          vi: "Chúng ta rà lại các đầu việc trước khi kết thúc nhé.",
        },
        {
          en: "My only [action item] from the call is to update the mockups.",
          vi: "Đầu việc duy nhất của tôi sau cuộc gọi là cập nhật bản mockup.",
        },
      ],
      note: "Một action item tốt có người phụ trách và hạn chót: 'Action item: Lan to update the spec by Friday.'",
    },
    {
      kind: "vocab",
      id: "u06-misunderstand",
      term: "misunderstand",
      pos: "verb",
      ipa: "/ˌmɪsʌndərˈstænd/",
      vi: "hiểu nhầm",
      def: "to get the wrong idea about what someone says or means",
      examples: [
        {
          en: "Sorry, I think I [misunderstood] the requirement.",
          vi: "Xin lỗi, tôi nghĩ là tôi đã hiểu nhầm yêu cầu.",
        },
        {
          en: "Please don't [misunderstand] me. I really like your idea.",
          vi: "Đừng hiểu lầm tôi nhé. Tôi thật sự thích ý tưởng của bạn.",
        },
      ],
      note: "misunderstand – misunderstood – misunderstood. Danh từ: misunderstanding (There's been a misunderstanding).",
    },
    {
      kind: "vocab",
      id: "u06-align",
      term: "align",
      pos: "verb",
      ipa: "/əˈlaɪn/",
      vi: "thống nhất, đồng bộ (quan điểm)",
      def: "to agree on the same goals or plan with other people",
      examples: [
        {
          en: "Let's [align] with the product owner before we change the flow.",
          vi: "Hãy thống nhất với product owner trước khi thay đổi luồng xử lý.",
        },
        {
          en: "My wife and I need to [align] on our holiday budget.",
          vi: "Vợ chồng tôi cần thống nhất về ngân sách cho kỳ nghỉ.",
        },
      ],
      note: "align with + người, align on + việc; be aligned. Rất phổ biến trong môi trường công ty.",
    },
    {
      kind: "vocab",
      id: "u06-raise-a-concern",
      term: "raise a concern",
      pos: "phrase",
      vi: "nêu lo ngại",
      def: "to tell people that you are worried about something",
      examples: [
        {
          en: "The tester [raised a concern] about the speed of the search page.",
          vi: "Tester đã nêu lo ngại về tốc độ của trang tìm kiếm.",
        },
        {
          en: "Parents [raised concerns] about the new school bus schedule.",
          vi: "Phụ huynh đã bày tỏ lo ngại về lịch xe buýt mới của trường.",
        },
      ],
      note: "raise a concern about + something. 'raise' (ngoại động từ) ✓, ✗ rise a concern (rise là nội động từ).",
    },
    {
      kind: "vocab",
      id: "u06-on-the-same-page",
      term: "on the same page",
      pos: "expression",
      vi: "hiểu giống nhau, cùng quan điểm",
      def: "having the same understanding or opinion about something",
      examples: [
        {
          en: "Before we close, let's make sure we're all [on the same page].",
          vi: "Trước khi kết thúc, hãy chắc chắn là tất cả chúng ta hiểu giống nhau.",
        },
        {
          en: "My roommate and I are finally [on the same page] about cleaning.",
          vi: "Cuối cùng tôi và bạn cùng phòng cũng thống nhất được chuyện dọn dẹp.",
        },
      ],
      note: "be / get on the same page (about something). Thân mật nhưng dùng rất nhiều trong họp.",
    },
    {
      kind: "vocab",
      id: "u06-recap",
      term: "recap",
      pos: "noun",
      ipa: "/ˈriːkæp/",
      vi: "phần tóm tắt lại",
      def: "a short summary of the main things that were said or done",
      examples: [
        {
          en: "Let me give a quick [recap] of what we decided today.",
          vi: "Để tôi tóm tắt nhanh những gì chúng ta đã quyết định hôm nay.",
        },
        {
          en: "The TV show starts with a short [recap] of the last episode.",
          vi: "Chương trình truyền hình mở đầu bằng phần tóm tắt ngắn tập trước.",
        },
      ],
      note: "give a quick recap. Khi kết thúc họp hay nói: 'To recap, ...' (dùng như động từ).",
    },
    {
      kind: "pattern",
      id: "u06-indirect-questions",
      title: "Câu hỏi gián tiếp để hỏi lịch sự",
      summary:
        "Để hỏi lịch sự hơn, đặt câu hỏi sau **Could you tell me / Do you know / Can I ask...**. Phần câu hỏi phía sau dùng **trật tự câu khẳng định** (chủ ngữ + động từ), không đảo ngữ và không dùng do/does/did. ✗ *Could you tell me what is the deadline?* → ✓ *Could you tell me what the deadline is?* Với câu hỏi Yes/No, dùng **if / whether**.",
      form: "Could you tell me / Do you know + wh-word / if + S + V ...?",
      examples: [
        {
          en: "Could you tell me what the deadline is?",
          vi: "Anh có thể cho tôi biết hạn chót là khi nào không?",
        },
        {
          en: "Do you know when the client will sign off?",
          vi: "Anh có biết khi nào khách hàng sẽ ký duyệt không?",
        },
        {
          en: "Can I ask if this feature is in scope?",
          vi: "Cho tôi hỏi tính năng này có nằm trong phạm vi không?",
        },
      ],
      drills: [
        {
          type: "cloze",
          text: "Could you tell me when the next demo [is]?",
          vi: "Anh có thể cho tôi biết buổi demo tới là khi nào không?",
          hint: "(be)",
          explain: "Câu hỏi gián tiếp dùng trật tự câu khẳng định: when + the next demo + is (động từ đứng cuối).",
        },
        {
          type: "cloze",
          text: "Do you know [if|whether] the client has approved the design?",
          vi: "Anh có biết khách hàng đã duyệt thiết kế chưa?",
          hint: "(Yes/No question)",
          explain: "Câu hỏi gốc là Yes/No (Has the client approved...?) nên khi chuyển sang gián tiếp dùng 'if' hoặc 'whether'.",
        },
        {
          type: "fix",
          wrong: "Could you tell me what is the deadline for UAT?",
          answers: ["Could you tell me what the deadline for UAT is?"],
          vi: "Anh có thể cho tôi biết hạn chót của UAT là khi nào không?",
          explain: "Trong câu hỏi gián tiếp, không đảo 'is' lên trước chủ ngữ: what + the deadline for UAT + is.",
        },
        {
          type: "fix",
          wrong: "Do you know when does the next sprint start?",
          answers: ["Do you know when the next sprint starts?", "Do you know when the next sprint will start?"],
          vi: "Anh có biết khi nào sprint tiếp theo bắt đầu không?",
          explain: "Bỏ 'does' trong phần câu hỏi gián tiếp và chia động từ theo chủ ngữ: the next sprint starts.",
        },
        {
          type: "twoTier",
          question: "Complete: 'Could you explain why ___?' Choose ALL correct options.",
          vi: "Anh có thể giải thích vì sao API trả về lỗi không?",
          options: [
            "the API returns an error",
            "does the API return an error",
            "the API is returning an error",
            "is the API returning an error",
          ],
          correct: [0, 2],
          reasons: [
            "Trong câu hỏi gián tiếp, phần sau từ để hỏi dùng trật tự câu khẳng định: chủ ngữ + động từ.",
            "Câu hỏi gián tiếp vẫn phải đảo trợ động từ lên trước chủ ngữ như câu hỏi thường.",
            "Chỉ thì hiện tại đơn mới không đảo ngữ; thì tiếp diễn vẫn phải đảo 'is' lên trước.",
            "Sau 'why' luôn cần 'does/did' để nhấn mạnh lý do.",
          ],
          reasonCorrect: 0,
          explain: "'the API returns' và 'the API is returning' đều giữ trật tự chủ ngữ + động từ nên đúng. Hai lựa chọn còn lại đảo ngữ như câu hỏi trực tiếp.",
        },
        {
          type: "transform",
          instruction: "Make the question more polite. Start with 'Could you tell me'.",
          source: "When will the client confirm the scope?",
          answers: ["Could you tell me when the client will confirm the scope?"],
          explain: "Đưa 'will' về sau chủ ngữ: when + the client + will confirm. Câu kết thúc bằng dấu hỏi vì cả câu vẫn là câu hỏi.",
        },
      ],
    },
    {
      kind: "pattern",
      id: "u06-polite-disagreement",
      title: "Phản biện lịch sự bằng từ làm mềm câu",
      summary:
        "Khi không đồng ý trong cuộc họp, người bản xứ thường **làm mềm** câu nói thay vì nói thẳng 'You're wrong'. Mẫu hay dùng: **I see your point, but...**, **I'm not sure (that)...**, **I'm afraid...**, **Maybe we could...**. Lưu ý: ✗ *I'm not agree* → ✓ *I don't agree* hoặc mềm hơn *I'm not sure I agree*.",
      form: "I see your point, but + clause | I'm not sure (that) + clause | I'm afraid + clause | Maybe we could + V",
      examples: [
        {
          en: "I see your point, but the deadline is too tight for that.",
          vi: "Tôi hiểu ý anh, nhưng hạn chót quá gấp để làm việc đó.",
        },
        {
          en: "I'm not sure that the client will accept this change.",
          vi: "Tôi không chắc là khách hàng sẽ chấp nhận thay đổi này.",
        },
        {
          en: "Maybe we could split this story into two smaller ones.",
          vi: "Có lẽ chúng ta có thể tách story này thành hai story nhỏ hơn.",
        },
      ],
      drills: [
        {
          type: "cloze",
          text: "I see your [point], but we don't have enough testers this sprint.",
          vi: "Tôi hiểu ý anh, nhưng sprint này chúng ta không đủ tester.",
          hint: "(noun)",
          explain: "'I see your point' = tôi hiểu ý bạn; dùng để ghi nhận ý kiến trước khi đưa ra quan điểm khác.",
        },
        {
          type: "cloze",
          text: "I'm not [sure|convinced] this approach will work for mobile users.",
          vi: "Tôi không chắc cách làm này sẽ hiệu quả với người dùng di động.",
          hint: "(adjective)",
          explain: "'I'm not sure...' thể hiện sự nghi ngờ nhẹ nhàng, lịch sự hơn nhiều so với 'This won't work'.",
        },
        {
          type: "cloze",
          text: "I'm [afraid] we can't add this feature before the release.",
          vi: "Tôi e là chúng ta không thể thêm tính năng này trước khi phát hành.",
          hint: "(adjective, báo tin không vui)",
          explain: "'I'm afraid + mệnh đề' là cách lịch sự để báo tin không vui hoặc từ chối, không mang nghĩa 'sợ'.",
        },
        {
          type: "fix",
          wrong: "I am not agree with this estimate.",
          answers: [
            "I don't agree with this estimate.",
            "I do not agree with this estimate.",
            "I'm not sure I agree with this estimate.",
            "I disagree with this estimate.",
          ],
          vi: "Tôi không đồng ý với con số ước lượng này.",
          explain: "'agree' là động từ, nên phủ định bằng 'don't agree', không dùng 'am not agree'. Mềm hơn: I'm not sure I agree.",
        },
        {
          type: "twoTier",
          question: "A developer says: 'Let's skip UAT to save time.' Choose ALL polite, natural replies.",
          vi: "Một lập trình viên nói: 'Bỏ qua UAT cho đỡ mất thời gian đi.' Chọn TẤT CẢ câu trả lời lịch sự, tự nhiên.",
          options: [
            "I see your point, but UAT helps us find serious issues early.",
            "I'm not agree, because UAT helps us find serious issues early.",
            "I'm not sure that's wise, because UAT finds serious issues early.",
            "You are wrong, because UAT helps us find serious issues early.",
          ],
          correct: [0, 2],
          reasons: [
            "Câu lịch sự ghi nhận ý người kia hoặc thể hiện sự không chắc chắn trước khi đưa ra lý do phản đối.",
            "Câu càng thẳng thì càng chuyên nghiệp, nên 'You are wrong' là rõ ràng nhất.",
            "'I'm not agree' lịch sự hơn 'I don't agree' vì dùng 'be' thay cho trợ động từ.",
            "Chỉ cần có lý do ('because...') là câu trở nên lịch sự, cách mở đầu không quan trọng.",
          ],
          reasonCorrect: 0,
          explain: "'I see your point, but...' và 'I'm not sure that's wise...' đều làm mềm câu. 'I'm not agree' sai ngữ pháp; 'You are wrong' quá thẳng, dễ gây căng thẳng.",
        },
        {
          type: "transform",
          instruction: "Make this disagreement more polite. Start with 'I see your point, but'.",
          source: "Your estimate is wrong. It will take two sprints.",
          answers: [
            "I see your point, but I think it will take two sprints.",
            "I see your point, but I think this will take two sprints.",
            "I see your point, but I believe it will take two sprints.",
            "I see your point, but it will take two sprints.",
            "I see your point, but I think it might take two sprints.",
          ],
          explain: "Bỏ câu chê trực tiếp 'Your estimate is wrong', ghi nhận ý người kia rồi nêu quan điểm, thêm 'I think' để mềm hơn.",
        },
      ],
    },
  ],
  aiTasks: [
    {
      id: "u06-ai-1",
      kind: "roleplay",
      title: "Làm rõ một yêu cầu mơ hồ trong cuộc họp",
      brief:
        "Trong buổi họp, khách hàng nói: 'We need the sales report to be real-time and available for everyone.' Yêu cầu này còn mơ hồ và có thể ảnh hưởng tới deadline đã thống nhất.",
      task:
        "You are the BA lead in this meeting. Write what you would say to the client. Ask at least three indirect questions to clarify the requirement (for example, what 'real-time' means, who 'everyone' is, and when they need it). Politely raise one concern about the deadline using a softener ('I see your point, but...' / 'I'm not sure...'). End with a short recap and one action item with an owner.",
      minWords: 100,
      criteria: [
        "Có ít nhất ba câu hỏi gián tiếp đúng trật tự từ (không đảo ngữ, không do/does)",
        "Nêu lo ngại về deadline một cách lịch sự, có dùng từ làm mềm câu",
        "Có phần tóm tắt và action item rõ người phụ trách",
        "Giọng văn chuyên nghiệp, tự nhiên như trong cuộc họp thật",
      ],
    },
    {
      id: "u06-ai-2",
      kind: "translation",
      title: "Dịch phần kết thúc cuộc họp",
      brief: "Bạn là người chủ trì và cần tóm tắt lại cuộc họp với khách hàng nước ngoài.",
      task: "Translate into natural, professional English.",
      source:
        "Cảm ơn mọi người đã tham gia cuộc họp hôm nay. Để chắc chắn chúng ta hiểu giống nhau, tôi xin tóm tắt lại các điểm chính. Anh Nam đã nêu lo ngại về tốc độ của trang tìm kiếm, vì vậy chúng ta cần làm rõ yêu cầu với khách hàng trước thứ Năm. Chị Hoa sẽ xác nhận lại ngày phát hành và liên hệ lại với nhóm QA. Nếu tôi hiểu nhầm điểm nào, xin mọi người cho tôi biết.",
      criteria: [
        "Dùng đúng cụm: on the same page, recap, raise a concern, clarify, confirm, follow up with",
        "Thì và cấu trúc câu chính xác (raised, will confirm, if I have misunderstood...)",
        "Giọng văn tự nhiên, lịch sự như người chủ trì cuộc họp",
        "Không dịch từng chữ, đúng chính tả và ngữ pháp",
      ],
    },
  ],
}

export default unit
